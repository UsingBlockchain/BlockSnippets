/**
 * Part of BlockSnippets shared under AGPLv3
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import chalk from 'chalk'
import { Address, NetworkType } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
import { getPublicKey } from './core'

//- Create account for Alice
const alicePrivate = MnemonicPassPhrase.createRandom();
const aliceAddress = Address.createFromPublicKey(getPublicKey(alicePrivate), NetworkType.TEST_NET);

//- Display information about Alice's account
console.log('')
console.log(chalk.yellow('Alice\'s pass phrase: ') + chalk.red(alicePrivate.plain));
console.log(chalk.yellow('Alice\'s address #1:  ') + aliceAddress.plain());
console.log('')

//- Create account for Bob
const bobPrivate = MnemonicPassPhrase.createRandom();
const bobAddress = Address.createFromPublicKey(getPublicKey(bobPrivate), NetworkType.TEST_NET);

//- Display information about Bob's account
console.log('')
console.log(chalk.yellow('Bob\'s pass phrase:   ') + chalk.red(bobPrivate.plain));
console.log(chalk.yellow('Bob\'s address #1:    ') + bobAddress.plain());
console.log('')


