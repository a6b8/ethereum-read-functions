require( 'dotenv' ).config( { path: './../../.env' } )
const { readFunctions } = require( '../src/index.js' )

const tests = [
    {
        "name": "Anchor Certificate",
        "address": "0x600a4446094C341693C415E6743567b9bfc8a4A8",
        "cmd": 'tokenURI("40304442284165873759735888198141729455299047240663990062446596565539534752893")' //uint256 as "string"
    },
    {
        "name": "Loot",
        "address": "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7",
        "cmd": 253 // short for tokenURI(253)
    }
]

const configs = tests.map( ( test ) => { 
    let config = {
        'cmds': null,
        'address': null,
        'network': 'homestead',
        'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
        'infura_project_id': process.env.INFURA_PROJECT_ID,
        'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
        // 'silent': false,
        // 'shrink': true,
        // 'try_blind': true,
        // 'try_all': true
    }

    config['cmds'] = [ test['cmd'], 'name()', 'symbol()' ]
    config['address'] = test['address']
    return config
} )


readFunctions( configs )
.then( ( results ) => {
    let r = JSON.stringify( results, null, 4 )
    //console.log( r )
    
    names = results['data'].map( rr => rr['name'] )
    console.log( names )
    console.log( names === [ 'Loot', 'Anchor Certificates' ] )
} )