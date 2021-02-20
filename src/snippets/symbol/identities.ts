/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import chalk from 'chalk'
import { Address, NetworkType } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
import { getPublicKey } from '../../kernel/adapters/Symbol'

//- Create account for Alice
export const alicePrivate = MnemonicPassPhrase.createRandom();
export const aliceAddress = Address.createFromPublicKey(getPublicKey(alicePrivate.toSeed().toString('hex')), NetworkType.TEST_NET);

//- Display information about Alice's account
console.log('')
console.log(chalk.yellow('Alice\'s pass phrase: ') + chalk.red(alicePrivate.plain));
console.log(chalk.yellow('Alice\'s address #1:  ') + aliceAddress.plain());
console.log('')

//- Create account for Bob
export const bobPrivate = MnemonicPassPhrase.createRandom();
export const bobAddress = Address.createFromPublicKey(getPublicKey(bobPrivate.toSeed().toString('hex')), NetworkType.TEST_NET);

//- Display information about Bob's account
console.log('')
console.log(chalk.yellow('Bob\'s pass phrase:   ') + chalk.red(bobPrivate.plain));
console.log(chalk.yellow('Bob\'s address #1:    ') + bobAddress.plain());
console.log('')
