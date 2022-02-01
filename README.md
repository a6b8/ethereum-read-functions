<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/custom/ethereum-read-functions-for-node.js" height="45px" alt="Ethereum Read Functions for Node.js" name="# Ethereum Read Functions for Node.js">
</a>

Read smart contract functions from the ethereum and every other evm blockchain.

<br>

<a href="#headline">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/examples.svg" height="45px" alt="Examples" name="examples">
</a>

**Fetch tokenURI and Name**
```javascript

require( 'dotenv' ).config( { path: '.env' } )
const { readFunction } = require( 'ethereum-read-functions' )

const config = {
    'cmds': [ 'tokenURI(1)', 'name()' ],
    'network': 'homestead',
    'address': '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
}

readFunction( config )
.then( ( result ) => console.log( result ) )
.catch( ( e ) => console.log( e ) )

```

**Unverified source code on Etherscan**  
Set ``try blind`` to `true`

```javascript
require( 'dotenv' ).config( { path: '.env' } )
const { readFunction } = require( 'ethereum-read-functions' )

const config = {
    'cmds': [ 'tokenURI(19)' ],
    'network': 'homestead',
    'address': '0x4ef107a154cb7580c686c239ed9f92597a42b961',
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
    'try_blind': true,
}

readFunction( config )
.then( ( result ) => console.log( result ) )
.catch( ( e ) => console.log( e ) )
```


**Fetch all viewable Functions**
```javascript
require( 'dotenv' ).config( { path: '.env' } )
const { readFunction } = require( 'ethereum-read-functions' )

const config = {
    'cmds': [],
    'network': 'homestead',
    'address': '0x4ef107a154cb7580c686c239ed9f92597a42b961',
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
    'try_all': true
}

readFunction( config )
.then( ( result ) => console.log( result ) )
.catch( ( e ) => console.log( e ) )
```

<br>

<a href="#headline">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/table-of-contents.svg" height="45px" alt="Table of Contents" name="table-of-contents">
</a>

1. [Examples](#examples)<br>
2. [Quickstart](#quickstart)<br>
3. [Setup](#setup)
4. [Options](#options)<br>
5. [Contributing](#contributing)<br>
6.  [License](#license)<br>
7.  [Code of Conduct](#code-of-conduct)<br>
8.  [Support my Work](#support-my-work)<br>

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/quickstart.svg" height="45px" alt="Quickstart" name="quickstart">
</a>


```javascript
require( 'dotenv' ).config( { path: '.env' } )
const { readFunction } = require( 'ethereum-read-functions' )

readFunction( {
    'cmds': [ 'tokenURI(19)' ],
    'network': 'homestead',
    'address': '0x4ef107a154cb7580c686c239ed9f92597a42b961',
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
} )
.then( ( result ) => console.log( result ) )
.catch( ( e ) => console.log( e ) )
```


<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/setup.svg" height="45px" name="setup" alt="Setup">
</a>

```javascript
npm i ethereum-read-functions
```

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/options.svg" height="45px" alt="Options" name="Options">
</a>

```nodejs
{
    'cmds': null,
    'address': null,
    'network': 'homestead',
    'etherscan_api_key': process.env.ETHERSCAN_API_KEY,
    'infura_project_id': process.env.INFURA_PROJECT_ID,
    'infura_project_secret': process.env.INFURA_PROJECT_SECRET,
    'silent': false,
    'shrink': true,
    'try_blind': true,
    'try_all': true
}
```


**Validation**
| **Name** | **Type** | **Required** | **Default** | **Description** |
|------:|:------|:------|:------|:------|
| **cmds** | ```Array of numbers or strings``` | No | [] | Set here your function names. If you set ```1``` it will interpreted as ```tokenURI(1)```. Please cast long int to string. |
| **address** | ```String``` | Yes | | Set smart contract address here |
| **network** | ```String``` | Yes | `"Homestead"` | Choose network. `Homestead === Ethereum Mainnet`, visit etherjs documentation for more [Informations](https://docs.ethers.io/v5/api/providers/api-providers/) |
| **etherscan_api_key** | ```String``` | Yes | `""` | Some request will work without api key. More Informations to Etherscan Api you can find [here](https://etherscan.io/apis) |
| **infura_project_id** | ```String``` | Yes | `""` | More Informations to Infura´s Api you can find [here](https://etherscan.io/apis) |
| **infura_secret_id** | ```String``` | Yes | `""` | More Informations to Infura´s Api you can find [here](https://etherscan.io/apis) |
| **silent** | ```Boolean``` | no | `false` | By default console output will print helpful status messages. |
| **shrink** | ```Boolean``` | no | `true` | Reduces to size of the result. |
| **try_blind** | ```Boolean``` | no | `false` | Experimental! If no ABIs was found (means Etherscan source code is verified) the algorithm uses a default ABIs to guess the ABI and fetch ***only*** a tokenURI call. |
| **try_all** | ```Boolean``` | no | `false` | Experimental! Search inside of ABIs for viewable function without parameters and fetch them all automatically. |

<br>


<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/contributing.svg" height="45px" alt="Contributing" name="contributing">
</a>

Bug reports and pull requests are welcome on GitHub at https://github.com/a6b8/ethereum-read-functions. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/a6b8/statosio/blob/master/CODE_OF_CONDUCT.md).

<br>


<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/limitations.svg" height="45px" name="limitations" alt="Limitations">
</a>

- Not tested for production
- Works only with Infura and Etherscan.
- Build for NFT request only.

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/credits.svg" height="45px" name="credits" alt="Credits">
</a>

- Function are executed with ether.js
- ABIs are fetched from Etherscan once for every address.
  
<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/license.svg" height="45px" alt="License" name="license">
</a>

The module is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

<br>

<a href="#table-of-contents">
<img src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/code-of-conduct.svg" height="45px" alt="Code of Conduct" name="code-of-conduct">
</a>
    
Everyone interacting in the Statosio project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/a6b8/ethereum-read-functions/blob/main/CODE_OF_CONDUCT.md).

<br>

<a href="#table-of-contents">
<img href="#table-of-contents" src="https://raw.githubusercontent.com/a6b8/a6b8/main/assets/headlines/default/star-us.svg" height="45px" name="star-us" alt="Star us">
</a>

Please ⭐️ star this Project, every ⭐️ star makes us very happy!