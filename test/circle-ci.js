const fs = require( 'fs' )
// require( 'dotenv' ).config( { path: './../../.env' } )

file = fs.readFileSync( 'test/0-data/diffrent-types-of-nfts.json' )
datas = JSON.parse( file )
const { readFunctions } = require( '../src/index.js' )


const configs = datas['onchain'].map( ( nft ) => {
    let config = {
        'cmds': [ 'name()' ],
        'network': 'homestead',
        'address': nft['address'],
        'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
        'infura_project_id': process.env.INFURA_PROJECT_ID,
        'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
    }
    return config
} )

console.log( configs[ 0 ] )

readFunctions( configs )
.then( ( results ) => {
    let r = JSON.stringify( results, null, 4 )
    names = results['data'].map( rr => rr['name'] )
    console.log( names )
} )