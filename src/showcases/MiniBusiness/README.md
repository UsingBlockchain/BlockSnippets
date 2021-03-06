<p align="center"><img src="https://ubc.digital/wp-content/uploads/2021/02/ubc-logo-black-500x169-1.png" width="220"></p>

# MiniBusiness

## Part of UsingBlockchain/BlockSnippets

Repository for the `MiniBusiness` open source simplistic business digitalisation showcase with [Symbol from NEM](https://symbolplatform.com).

This package aims to provide with a command line interface helping you to **use blockchain for your business** as showcased in [UBC Digital Magazine](https://ubc.digital).

This package was initially published with the following article:

- [How to use blockchain for your business?](https://ubc.digital/how-to-use-blockchain-for-your-business/)

This package is part of BlockSnippets by Using Blockchain Ltd.

*The author of this package cannot be held responsible for any loss of money or any malintentioned usage forms of this package. Please use this package with caution.*

Package licensed under [LGPLv3](../../../LICENSE) License.

## Requirements

1. Latest NodeJS **stable** version (> v12)

```bash
$ node -v
v12.18.4
```

## Instructions / Environment

- Using NPM

```bash
$ npm install -g @ubcdigital/blocksnippets
```

- Using Git

```bash
$ git clone https://github.com/UsingBlockchain/BlockSnippets
$ cd BlockSnippets && npm install
$ npm run build
$ alias BlockSnippets='./BlockSnippets'
```

## Examples

Note: This program was first showcased in: https://ubc.digital/how-to-use-blockchain-for-your-business/

1. Create a digital business (with 1 employee) :

```bash
$ BlockSnippets MiniBusiness Create -n "Your Company Name"

      ___                 ___  
     (o o)               (o o) 
    (  V  ) UBC Digital (  V  )
    --m-m-----------------m-m--
    ------  MiniBusiness ------
    --m-m-----------------m-m--

Enter the password for this digital business: easypassword

Enter a name (i.e. a full name) for the identity #1:  Grégory Saive

Enter an alias (i.e. a nickname) for the identity #1: evias

Do you want to setup another identity? [y/n]: n

Your digital business is located at: ./data/your-company-name.json

Business governor: 2cec1fd011e9ebd5cc1dea8d56f4eee91d6e9b96620c36ecd8436acf0ddd1990
Digital identity for "Grégory Saive" (public): 62e2997d13cea0808ddad04b5a3284eb2f5d1e55ebce61e71909d06961932c87
```

- This will create and backup one digital identity. To find backup files, have a look inside the data/ folder. In the example above, it would have created a file at: `./data/your-company-name.json`.
- Additionally, digital identities can be mapped to <b>names</b> such that they can be addressed more easily.
- :warning: It is primordial that you understand the importance of storing your [mnemonic phrase](https://ubc.digital/dictionary/mnemonic-phrase) securely.

2. Setup digital identities for your digital business:

```bash
$ BlockSnippets MiniBusiness Identify -n "Your Company Name" -p easypassword

      ___                 ___  
     (o o)               (o o) 
    (  V  ) UBC Digital (  V  )
    --m-m-----------------m-m--
    ------  MiniBusiness ------
    --m-m-----------------m-m--


Enter the password for 'Grégory Saive': easypassword

Digital Contract located at: ./data/your-company-name-contracts/Identify.png
```

- This will create a digital contract stored in a folder just for your digital business at: `./data/your-company-name-contracts/Identify.png`.
- The created contracts are represented as `image/png` files which contain QR Codes.

3. Setup distributed governance schemes for your digital business:

```bash
$ BlockSnippets MiniBusiness Governance -n "Your Company Name" -p easypassword

      ___                 ___  
     (o o)               (o o) 
    (  V  ) UBC Digital (  V  )
    --m-m-----------------m-m--
    ------  MiniBusiness ------
    --m-m-----------------m-m--


Digital Contract located at: ./data/your-company-name-contracts/Governance.png
```

- This will create a digital contract stored in a folder just for your digital business at: `./data/your-company-name-contracts/Governance.png`.
- The created contracts are represented as `image/png` files which contain QR Codes.

## Donations / Pot de vin

Donations can also be made with cryptocurrencies and will be used for running the project!

    NEM:       NB72EM6TTSX72O47T3GQFL345AB5WYKIDODKPPYW
    Bitcoin:   3EVqgUqYFRYbf9RjhyjBgKXcEwAQxhaf6o

## Sponsor us

    Paypal:    https://paypal.me/usingblockchainltd
    Patreon:   https://patreon.com/usingblockchainltd
    Github:    https://github.com/sponsors/UsingBlockchain

## Credits

| Username | Role |
| --- | --- |
| [Using Blockchain Ltd](https://using-blockchain.org) | Product Owner |
| [eVias](https://github.com/evias) | Project Lead |
| [UBC Developers](https://github.com/ubcdevs) | Development |
| [Rebecca Natterer](https://github.com/rebsweb) | Development |

## License

This software is released under the [LGPLv3](../../../LICENSE) License.

Copyright © 2021 Grégory Saive for Using Blockchain Ltd (https://using-blockchain.org), All rights reserved.
