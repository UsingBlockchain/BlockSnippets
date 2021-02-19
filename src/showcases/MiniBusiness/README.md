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

1. Setup a distributed governance scheme for your business (with 3 employees) :

```bash
$ BlockSnippets MiniBusiness Govern -n "Your Company Name"
> Enter the 1st identity role: Owner
> Enter the 1st identity name: Grégory Saive

> Enter the 2nd identity role: Chief Marketing Officer
> Enter the 2nd identity name: John D.

> Enter the 3rd identity role: Chief Technology Officer
> Enter the 3rd identity name: Pascal S.
```

- This will create and backup three digital identities. To find backup files, have a look inside the data/ folder.
- Additionally, digital identities can be mapped to <b>names<b> such that they can be addressed more easily.
- :warning: It is primordial that you understand the importance of storing your [mnemonic phrase](https://ubc.digital/dictionary/mnemonic-phrase) securely.

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
