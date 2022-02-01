const fs = require( 'fs' )
// require( 'dotenv' ).config( { path: './../../.env' } )
var _ = require( 'underscore' )


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

readFunctions( configs )
.then( ( results ) => {
    let r = JSON.stringify( results, null, 4 )
    names = results['data'].map( rr => rr['name'] )

    let test = [
        'BoredApeYachtClub',
        'Avastar',
        'Squiggly',
        'Neolastics',
        'TinyBoxes',
        'Mandala Tokens',
        'The Signature',
        'Uniswap V3 Positions NFT-V1',
        'Anchor Certificates',
        'Blitmap',
        'Nouns',
        'Genesis.sol - [sol]Seedlings',
        'Loot',
        'MoonCatLootprint'
    ]

    _.isEqual( names ,  test ) ? process.exit( 0 ) : process.exit( 1 ); 
} )