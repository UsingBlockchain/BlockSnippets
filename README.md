<p align="center"><img src="https://ubc.digital/wp-content/uploads/2021/02/ubc-logo-black-500x169-1.png" width="220"></p>

# UsingBlockchain/BlockSnippets

Repository for the `BlockSnippets` open source code snippets library.

This package aims to provide with a command line interface helping you to **execute source code snippets** mentioned in [UBC Digital Magazine](https://ubc.digital).

*The author of this package cannot be held responsible for any loss of money or any malintentioned usage forms of this package. Please use this package with caution.*

Package licensed under [LGPLv3](LICENSE) License.

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

1. Execute snippets as showcased in https://ubc.digital :

```bash
$ BlockSnippets ExecuteSnippet -n bitcoin -s genesis
$ BlockSnippets ExecuteSnippet -n symbol -s identities
$ BlockSnippets ExecuteSnippet -n symbol -s products
$ BlockSnippets ExecuteSnippet -n symbol -s streaming
```

2. Tokenize your supply chain with the `MiniSupplyChain` program as showcased in https://ubc.digital :

Note: This program was first showcased in: https://ubc.digital/how-to-use-blockchain-to-tokenise-your-supply-chain/

```bash
# 1) Tokenize your company's products
$ BlockSnippets MiniSupplyChain Create -n "Your Company Name" 

# 2) Sell one of your tokenized products by SKU (e.g. "UBC21-34560015-01")
$ BlockSnippets MiniSupplyChain Sale -n "Your Company Name" --sku "UBC21-34560015-01"
```

## Donations / Pot de vin

Donations can also be made with cryptocurrencies and will be used for running the project!

    NEM:       NB72EM6TTSX72O47T3GQFL345AB5WYKIDODKPPYW
    Bitcoin:   3EVqgUqYFRYbf9RjhyjBgKXcEwAQxhaf6o

## Sponsor us

| Platform | Sponsor Link |
| --- | --- |
| Paypal | [https://paypal.me/usingblockchainltd](https://paypal.me/usingblockchainltd) |
| Patreon | [https://patreon.com/usingblockchainltd](https://patreon.com/usingblockchainltd) |
| Github | [https://github.com/sponsors/UsingBlockchain](https://github.com/sponsors/UsingBlockchain) |

## Credits

| Username | Role |
| --- | --- |
| [Using Blockchain Ltd](https://using-blockchain.org) | Product Owner |
| [eVias](https://github.com/evias) | Project Lead |

## License

This software is released under the [LGPLv3](LICENSE) License.

Copyright © 2021 Grégory Saive for Using Blockchain Ltd (https://using-blockchain.org), All rights reserved.

