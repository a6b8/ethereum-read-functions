require( 'dotenv' ).config( { path: './../../.env' } )
const { readFunction } = require( '../src/index.js' )

let config = {
    'cmds': [],
    'network': 'homestead',
    'address': null,
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
    'silent': false,
    'shrink': true,
    'try_blind': true,
    'try_all': true
}

let index = 0
let examples = [
    [ '0x4ef107a154cb7580c686c239ed9f92597a42b961', [ 19 ] ],
    [ '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7', [ 1, 'name()' ] ],
    [ '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7', [ 'tokenURI(1)' ] ],
    [ '0x4ef107a154cb7580c686c239ed9f92597a42b961', [ 'tokenURI(1)', 1, 'name()' ] ]
]

config['cmds'] = examples[ index ][ 1 ]
config['address'] = examples[ index ][ 0 ]

readFunction( config )
.then( ( r ) => {
    let data = { 'data': r }
    console.log( data )
    console.log( data['data']['name'] === 'Loot' )
} )