<p align="center"><img src="https://ubc.digital/wp-content/uploads/2021/02/ubc-logo-black-500x169-1.png" width="220"></p>

# MiniCommerce

## Part of UsingBlockchain/BlockSnippets

Repository for the `MiniCommerce` open source simplistic e-commerce showcase with [Symbol from NEM](https://symbolplatform.com).

This package aims to provide with a command line interface helping you to **use blockchain for your business** as showcased in [UBC Digital Magazine](https://ubc.digital).

This package was initially published with the following article:

- [How to use blockchain for your e-commerce?](https://ubc.digital/how-to-use-blockchain-for-your-e-commerce/)

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

Note: This program was first showcased in: https://ubc.digital/how-to-use-blockchain-for-your-e-commerce/

1. Create a digital business for your e-commerce first (with 1 employee) :

```bash
$ BlockSnippets MiniCommerce Create -n "Your e-commerce Name"

      ___                 ___  
     (o o)               (o o) 
    (  V  ) UBC Digital (  V  )
    --m-m-----------------m-m--
    ------  MiniCommerce ------
    --m-m-----------------m-m--

Enter the password for this digital business: easypassword

Enter a name (i.e. a full name) for the identity #1:  Grégory Saive

Enter an alias (i.e. a nickname) for the identity #1: evias

Do you want to setup another identity? [y/n]: n

Your digital business is located at: ./data/your-e-commerce-name.json

Business governor: 2cec1fd011e9ebd5cc1dea8d56f4eee91d6e9b96620c36ecd8436acf0ddd1990
Digital identity for "Grégory Saive" (public): 62e2997d13cea0808ddad04b5a3284eb2f5d1e55ebce61e71909d06961932c87
```

- This will create and backup one digital identity. To find backup files, have a look inside the data/ folder. In the example above, it would have created a file at: `./data/your-e-commerce-name.json`.
- Additionally, digital identities can be mapped to <b>names</b> such that they can be addressed more easily.
- :warning: It is primordial that you understand the importance of storing your [mnemonic phrase](https://ubc.digital/dictionary/mnemonic-phrase) securely.

2. Create online coupons for your customers:

```bash
$ $ ./BlockSnippets MiniCommerce Couponise

      ___                 ___  
     (o o)               (o o) 
    (  V  ) UBC Digital (  V  )
    --m-m-----------------m-m--
    ------  MiniCommerce ------
    --m-m-----------------m-m--


Enter the company name: Your e-commerce name

Enter the password for this digital business: easypassword

Enter a product/service SKU: UBC-21-BOOK-00002

Enter a quantity: 1

Digital Contract located at: ./data/your-e-commerce-name-contracts/Couponise.png
```

3. Create payment requests for your customers:

```bash
$ $ ./BlockSnippets MiniCommerce AcceptPayment

      ___                 ___  
     (o o)               (o o) 
    (  V  ) UBC Digital (  V  )
    --m-m-----------------m-m--
    ------  MiniCommerce ------
    --m-m-----------------m-m--


Enter the company name: Your e-commerce name

Enter the password for this digital business: easypassword

Enter a product/service SKU: UBC-21-BOOK-00002

Enter a quantity: 1

Digital Contract located at: ./data/your-e-commerce-name-contracts/AcceptPayment-UBC-21-BOOK-00002.png
```

- This will create a digital contract stored in a folder just for your digital business at: `./data/your-e-commerce-name-contracts/AcceptPayment-UBC-21-BOOK-00002.png`.
- The created contracts are represented as `image/png` files which contain QR Codes.

## Sponsor us

    Paypal:    https://paypal.me/usingblockchainltd
    Patreon:   https://patreon.com/usingblockchainltd
    Github:    https://github.com/sponsors/UsingBlockchain

## Donations / Pot de vin

Donations can also be made with cryptocurrencies and will be used for running the project!

    NEM      (XEM):     NB72EM6TTSX72O47T3GQFL345AB5WYKIDODKPPYW
    Symbol   (XYM):     NDQALDK4XWLOUYKPE7RDEWUI25YNRQ7VCGXMPCI
    Ethereum (ETH):     0x7a846fd5Daa4b904caF7C59f866bb906153305D2
    Bitcoin  (BTC):     3EVqgUqYFRYbf9RjhyjBgKXcEwAQxhaf6o

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
