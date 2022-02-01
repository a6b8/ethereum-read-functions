const ethers = require( 'ethers' )
const https= require( 'https' )

const NFT = class NFT {
    constructor( _config, _abis=null ) {
        this.config = null
        this.silent = false
        this.shrink = true
        this.address = null
        this.provider = ''
        this.messages = []
        this.results = null
    }

    init( config, _abis=null ) {
        return new Promise( ( resolve, reject ) => {
            this.config = config
            this.silent = this.config['silent']
            this.address = this.config['address']
            this.shrink = this.config['shrink']
            this.provider = ethers.getDefaultProvider(
                this.config['network'], 
                {
                    etherscan: this.config['etherscan_api_key'],
                    infura: {
                        projectId: this.config['infura_project_id'],
                        projectSecret: this.config['infura_project_secret'],
                    }
                } 
            )

            if( _abis === null ) {
                this.loadAbi( this.address )
                    .then( ( results ) => {
                        this.abis = results[ 0 ]
                        resolve( results )
                    } )
                    .catch( ( err ) => { 
                        resolve( err ) } )
            } else {
                this.abis = _abis
                resolve( true )
            }
        } )
    }


    loadAbi( address ) {
        return new Promise( ( resolve, reject ) => {
            let human_readable = []

            let url = ''
            url += 'https://api.etherscan.io/api?module=contract&action=getabi&address='
            url +=  address
            url += `&apikey=${this.config['etherscan_api_key']}`

            const req = https.get( url, ( res ) => {
                let body = ''
                res.on( 'data', ( chunk ) => ( body += chunk.toString() ) )
                res.on( 'end', () => {
                    if( res.statusCode >= 200 && res.statusCode <= 299 ) {
                        if( body !== null ) {
                            let json = JSON.parse( body )
                            switch( json['status'] ) {
                                case "0":
                                    !this.silent ? process.stdout.write( '❌ ABI     ' ) : ''
                                    let str = json['result'].substring( 0, 30 )
                                    this.messages.push( `Etherscan: ${str}...` )
                                    break
                                case "1":
                                    !this.silent ? process.stdout.write( '✅ ABI     ' ) : ''
                                    let tmp = JSON.parse( json['result'] )
                                    const iface = new ethers.utils.Interface( tmp )
                                    human_readable = iface.format( ethers.utils.FormatTypes.full )
                                    break
                                default: 
                                    !this.silent ? process.stdout.write( '❌ ABI     ' ) : ''
                                    let str2 = json['result'].substring( 0, 30 )
                                    this.messages.push( `Etherscan: Unknown Etherscan status: ${str2}` )
                            }
                            resolve( [ human_readable, this.messages ] )
                        } else {
                            this.messages.push( `Etherscan: Body is null.`)
                            resolve( [ human_readable, this.messages ] )
                        }
                    } else {
                        this.messages.push( `Etherscan: Http status is not in range 2**.` )
                        resolve( [ human_readable, this.messages ] )
                    }
                } )
            } )
            req.on( 'error', ( err ) => {
                this.messages.push( `Etherscan: Http Request raised an error. Please check "address" and "etherscan api key".` )
                return resolve( [ human_readable, this.messages ] ) 
            } )
        } )
    }


    readFunction( cmd, silent=false ) {
        return new Promise( ( resolve, reject ) => {
            let item = {
                'input': cmd,
                'key': null,
                'value': null,
                'success': false,
                'standard': null,
                'type': null
            }

            let cmd_full = null
            switch( typeof( cmd ) ) {
                case 'number':
                    cmd = `tokenURI(${cmd})`
                    item['standard'] = 'ERC721'
                    break
                case 'string':
                    if( cmd.includes( 'tokenURI(' ) ) {
                        item['standard'] = 'ERC721'
                    } else {
                        item['standard'] = 'n/a'
                    }
                    break
                default:
                    this.messages.push( 'Wrong input type, use Integer or String instead.' )
                    break
            }

            if( this.messages.length == 0 ) {
                let cmd_full = `etherjs.${cmd}`

                let validation = this.compare( cmd, this.abis )
                item['key'] = validation['func']

                if( validation['success'] ) {
                    let etherjs = new ethers.Contract(
                        this.address, 
                        this.abis, 
                        this.provider
                    )

                    try {
                        eval( cmd_full )
                        .then( ( value ) => {
                            item['value'] = value
                            item['success'] = true
                            this.results = item
                            resolve( [ item, this.messages ] )
                        } )
                        .catch( ( err ) => {
                            this.messages.push( 'Function not found or parse error.' )
                            this.results = item
                            resolve( [ item, this.messages ] )
                        } )  
                    } catch( err ) {
                        this.messages.push( `CMDs: ${cmd_full} raised an error.` )
                        this.results = item
                        resolve( [ item, this.messages ] )
                    }  
                } else {
                    this.messages.push( validation['message'] )
                    this.results = item
                    resolve( [ item, this.messages ] )
                }
            } else {
                this.results = item
                resolve( [ item, this.messages ] )
            }
            
        } )
    }


    compare( search, list ) {        
        function str_difference( search, change ) {
            let longer = Math.max( ...[ search.length, change.length ] )
            let same = search
                .split( '' )
                .map( ( str, i ) => [ str, change[ i ] ] )
                .filter( ( a, b ) => { return ( a[ 0 ] === a[ 1 ] ) } )
                .length

            let result = ( longer - same ) / search.length
            return result
        }

        search = this.helperFuncName( search )
        let z = list
            .map( ( word ) => {
                let result = {
                    'score': null,
                    'func': this.helperFuncName( word ),
                    'search': word,
                    'exact': search === this.helperFuncName( word ),
                }
                result['score'] = str_difference( search, this.helperFuncName( word ) )
                result['exact'] = search == this.helperFuncName( word )
                return result
            } )

        let result = null
        let exact = z.filter( ( item ) => { return item['exact'] } ).length != 0

        if( exact ) {
            result = z.filter( ( item ) => { return item['exact'] } )[ 0 ]
            result['message'] = `Success! "${result['func']}" found!`
            result['success'] = true
            return result
        } else {
            result = z.reduce( ( prev, current ) => {
                return ( prev.score < current.score ) ? prev : current
            } )

            result['message'] = `"${search}" not found. Did you mean "${result['func']}()"?`
            result['success'] = false
            return result
        }
    }


    helperFuncName( str ) {
        let search = str
            .split( '(' )[ 0 ]
            .split( ' ' )
            .slice( -1 )[ 0 ]
        return search
    }
    

    messages() { return this.messages }
    results() { return this.results }
    abis() { return this.abis }
}


const methodSingle = async ( cmd, config, abis=null ) => {
    try { 
        const token = new NFT()
        await token.init( config, abis )
        await token.readFunction( cmd, config )

        return [ token.results, token.messages ]
    } catch ( err ) { return err }
}


const try_blind_abi = () => { 
    return [ 'function tokenURI(uint256 tokenId) view returns (string)' ]
}


const readFunction = async ( { 
    cmds=[], 
    address=null, 
    network=null,
    etherscan_api_key=null,
    infura_project_id=null,
    infura_project_secret=null,
    abis=null, 
    try_blind=false, 
    try_all=false, 
    silent=false, 
    shrink=true 
} ) => {
    let config = {}
    let tmp = [
        [ 'cmds', cmds ],
        [ 'network', network ],
        [ 'address', address ],
        [ 'etherscan_api_key', etherscan_api_key ],
        [ 'infura_project_id', infura_project_id ],
        [ 'infura_project_secret', infura_project_secret ],
        [ 'abis',abis ],
        [ 'try_blind', try_blind ],
        [ 'try_all', try_all ],
        [ 'silent', silent ],
        [ 'shrink', shrink ] 
    ]
    tmp.forEach( a => config[ a[ 0 ] ] = a[ 1 ] )

    function printError( messages, silent ) {
        if( messages.length == 0 ) {
            !silent ? console.log() : ''
        } else {
            messages.forEach( ( message, index ) => {
                if( !silent ) {
                    index == 0 ? console.log() : ''
                    console.log( `      - ${message}` )
                }
            } )
        }
    }


    try {
        if( typeof( cmds ) !== 'object' ) {
            cmds = [ cmds ]
        }

        let nr = 25
        !silent ? process.stdout.write( `${address.substring( 0, nr )}... > ` ) : ''

        messages = []
        const tkn = new NFT()
        if( abis == null ) {
            let a = await tkn.init( config, abis )
            messages = messages.concat( a[ 1 ] )
        }

        // If no Abi is found all not "tokenURI" calls will deleted. Also and a default ABI will set.
        if( try_blind ) {
            if( messages.filter( m => m.startsWith( 'Etherscan: Contract source code not verif...' ) ).length > 0 ) {
                !silent ? process.stdout.write( `✅ Blind Mode!     ` ) : ''
                cmds = cmds
                    .filter( cmd => { 
                        return ( String( cmd ).indexOf( '(' ) === -1 || String( cmd ).indexOf( 'tokenURI(' ) !== -1 )
                    } )
                
                tkn.abis = try_blind_abi()
                messages = []
            }
        }

        if( try_all ) {
            let cmds_found = tkn.abis
            .filter( t => t.indexOf( '()' ) !== -1 && t.indexOf( 'view' ) !== -1 )
            .map( ( str ) => ( str.split( '()' )[ 0 ] + '()' ).split( ' ' ).slice( -1 )[ 0 ] )
            
            cmds = cmds
                .concat( cmds_found )
                .filter( ( x, i, a ) =>  a.indexOf( x ) == i )
        }
        
        if( messages.length == 0 ) {
            results = []
            for( let i = 0; i < cmds.length; i++ ) {
                let str = ''
    
                str += cmds[ i ].length > nr-5 ? `${cmds[ i ].substring( 0, nr-5 )}...` : cmds[ i ]
                a = new Array( nr - str.length )
                str += a.map( () => { '' } ).join( ' ' )

                let tmp = await methodSingle( cmds[ i ], config, tkn.abis )
                results.push( tmp[ 0 ] )
                tmp[ 0 ]['value'] == null ? str = '❌ ' + str : str = '✅ ' + str
                messages = messages.concat( tmp[ 1 ] )
                !silent ? process.stdout.write( `${str}` ) : ''
            }
    
            printError( messages, silent )
    
            item = {}
            item['address'] = config['address']

            if( config['shrink'] ) {
                results.forEach( ( r ) => { item[ r['key'] ] =  r['value'] } )
            } else {
                item = results
            }
            return item 
        } else {
            printError( messages, silent )
            return { 'address': config['address'] }
        }

    } catch ( error ) {
        console.log( error )
        item = {}
        item['address'] = config['address']
        return item
    }
}


const readFunctions = async ( configs ) => {
    try {
        let results = { 'data': [] }

        for( let i = 0; i < configs.length; i++ ) {
            let tmp = new Array( 5 - ( i + '' ).length )
            let space = tmp.map( () => { '' } ).join( ' ' )

            let config = configs[ i ]
            !config['silent'] ? process.stdout.write( `[${i}]${space}` ) : ''

            const a = await readFunction( config )
            results['data'].push( a )
        }
        return results
    } catch( err ) {
        console.log( err )
        return {}
    }
}


module.exports = {
    'readFunction': readFunction,
    'readFunctions': readFunctions,
    'NFT': NFT
}