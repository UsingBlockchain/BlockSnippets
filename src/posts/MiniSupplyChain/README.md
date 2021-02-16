<p align="center"><img src="https://ubc.digital/wp-content/uploads/2021/02/ubc-logo-black-500x169-1.png" width="220"></p>

# MiniSupplyChain

## Part of UsingBlockchain/BlockSnippets

Repository for the `MiniSupplyChain` open source simplistic supply chain digitalisation showcase with [Symbol from NEM](https://symbolplatform.com).

This package aims to provide with a command line interface helping you to **tokenize the supply chain of your company** as showcased in [UBC Digital Magazine](https://ubc.digital).

This package was initially published with the following article:

- [How to use blockchain to tokenise your Supply Chain?](https://ubc.digital/how-to-use-blockchain-to-tokenise-your-supply-chain/)

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

1. Tokenize your company's products :

Note: This program was first showcased in: https://ubc.digital/how-to-use-blockchain-to-tokenise-your-supply-chain/

```bash
$ BlockSnippets MiniSupplyChain Create -n "Your Company Name" 
```

2. Sell one of your tokenized products by SKU (e.g. "UBC21-34560015-01")

```bash
$ BlockSnippets MiniSupplyChain Sale -n "Your Company Name" --sku "UBC21-34560015-01"
```

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

## License

This software is released under the [LGPLv3](../../../LICENSE) License.

Copyright © 2021 Grégory Saive for Using Blockchain Ltd (https://using-blockchain.org), All rights reserved.

