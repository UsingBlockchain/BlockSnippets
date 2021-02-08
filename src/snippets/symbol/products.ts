/**
 * Part of BlockSnippets shared under AGPLv3
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import chalk from 'chalk'
import { Account, Address, NetworkType } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
import { getContract, getMosaicCreationTransactions, getPrivateKey, getPublicKey } from './core'

//- Create account for Alice
const alicePrivate = MnemonicPassPhrase.createRandom();
const aliceAddress = Address.createFromPublicKey(getPublicKey(alicePrivate), NetworkType.TEST_NET);

//- Display information about Alice's account
console.log('')
console.log(chalk.yellow('Alice\'s pass phrase: ') + alicePrivate.plain);
console.log(chalk.yellow('Alice\'s address #1:  ') + aliceAddress.plain());
console.log('')

//- Prepare transactions
const transactions = getMosaicCreationTransactions(aliceAddress, 100);

//- Write a contract that will be signed by alice
const contract = getContract(transactions);

//- Identify the network for which the transaction shall be made valid
const networkHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

//- Sign transactions (locally)
const signer = Account.createFromPrivateKey(getPrivateKey(alicePrivate), NetworkType.TEST_NET);
const signed = signer.sign(contract, networkHash);

console.log('')
console.log(chalk.yellow('Signed transaction bytes: ') + signed.payload);
console.log('')
