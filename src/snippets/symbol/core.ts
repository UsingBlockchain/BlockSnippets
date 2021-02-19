/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import chalk from 'chalk'
import {
  Account,
  Address,
  AddressAliasTransaction,
  AggregateTransaction,
  AliasAction,
  Deadline,
  Mosaic,
  MosaicDefinitionTransaction,
  MosaicFlags,
  MosaicId,
  MosaicSupplyChangeAction,
  MosaicSupplyChangeTransaction,
  MosaicNonce,
  NamespaceId,
  NamespaceRegistrationTransaction,
  NetworkType,
  PlainMessage,
  PublicAccount,
  Transaction,
  TransferTransaction,
  UInt64,
} from 'symbol-sdk'
import { ExtendedKey, MnemonicPassPhrase, Network, Wallet } from 'symbol-hd-wallets'
import * as env from '../../kernel/env'

/**
 * Display usage information.
 */
export const usage = (): void => {
  console.log('')
  console.log(chalk.green('USAGE'))
  console.log('')
  console.log('  ' + chalk.bold('MiniSupplyChain <subcommand> [SKU]'))
  console.log('')
  console.log(chalk.green('SUBCOMMANDS'))
  console.log('')
  console.log('  ' + chalk.bold('create') + chalk.white(' - Creates the digital supply chain with tokenized products.'))
  console.log('  ' + chalk.bold('sale') + chalk.white('   - Execute a sale of a product by SKU.'))
  console.log('')
}

/**
 * Create an account with mnemonic pass phrase and
 * return its public key in hexadecimal format.
 *
 * @param   MnemonicPassPhrase mnemonic   The mnemonic pass phrase (12,16,24 words)
 * @param   string             path       (Optional) The address derivation path.
 * @return  string  Returns the public key of the derived account.
 */
export const getPublicKey = (
  mnemonic: MnemonicPassPhrase,
  path: string = "m/44'/4343'/0'/0'/0'",
): string => {
  const seed = mnemonic.toSeed().toString('hex')
  const xkey = ExtendedKey.createFromSeed(seed, Network.CATAPULT)
  const wallet = new Wallet(xkey)
  return wallet.getChildAccountPublicKey(
    path,
  );
}

/**
 * Create an account with mnemonic pass phrase and
 * return its private key in hexadecimal format.
 *
 * @param   MnemonicPassPhrase mnemonic   The mnemonic pass phrase (12,16,24 words)
 * @param   string             path       (Optional) The address derivation path.
 * @return  string  Returns the private key of the derived account.
 */
export const getPrivateKey = (
  mnemonic: MnemonicPassPhrase,
  path: string = "m/44'/4343'/0'/0'/0'",
): string => {
  const seed = mnemonic.toSeed().toString('hex')
  const xkey = ExtendedKey.createFromSeed(seed, Network.CATAPULT)
  const wallet = new Wallet(xkey)
  return wallet.getChildAccountPrivateKey(
    path,
  );
}

/**
 * Create an account address around \a mnemonic
 * for network type \a networkType.
 *
 * @param   MnemonicPassPhrase  mnemonic      The mnemonic pass phrase (12,16,24 words)
 * @param   NetworkType         networkType   The symbol network type.
 * @return  Address             The address of said account.
 */
export const getAddress = (
  mnemonic: MnemonicPassPhrase,
  networkType: NetworkType = NetworkType.TEST_NET
): Address => {
  return Address.createFromPublicKey(
    getPublicKey(mnemonic),
    networkType,
  )
}

/**
 * Create a signer account around \a mnemonic
 * for network type \a networkType.
 *
 * @warn    This method returns sensitive information.
 * @param   MnemonicPassPhrase  mnemonic      The mnemonic pass phrase (12,16,24 words)
 * @param   NetworkType         networkType   The symbol network type.
 * @return  Account             The sensitive information of an account (including its' private key).
 */
export const getSigner = (
  mnemonic: MnemonicPassPhrase,
  networkType: NetworkType = NetworkType.TEST_NET,
): Account => {
  return Account.createFromPrivateKey(
    getPrivateKey(mnemonic),
    networkType,
  );
}

/**
 * Returns a prepared transaction for the creation
 * of mosaics to refer to the digital items.
 *
 * @param   Address       ownerAddress  The products owner address
 * @param   number        countItems    The number of items
 * @param   NetworkType   networkType   (Optional) The symbol network type.
 * @param   number        maxFee        (Optional) The symbol network transaction fee.
 * @return  string  Returns the public key of the derived account.
 */
export const getMosaicCreationTransactions = (
  ownerAddress: Address,
  countItems: number,
  networkType: NetworkType = NetworkType.TEST_NET,
  maxFee: number = 30000,
): Transaction[] => {
  let transactions = [];

  const nonce = MosaicNonce.createRandom();
  const mosaicId = MosaicId.createFromNonce(nonce, ownerAddress);

  //- 1) Mosaic definition
  const definition = MosaicDefinitionTransaction.create(
    Deadline.create(1573430400),
    nonce,
    mosaicId,
    MosaicFlags.create(false, false, true),
    0,
    UInt64.fromUint(0),
    networkType,
    UInt64.fromUint(maxFee),
  );
  transactions.push(definition);

  //- 2) Initial supply change
  const initialSupply = MosaicSupplyChangeTransaction.create(
    Deadline.create(1573430400),
    mosaicId,
    MosaicSupplyChangeAction.Increase,
    UInt64.fromUint(countItems),
    networkType,
    UInt64.fromUint(maxFee),
  );
  transactions.push(initialSupply);

  return transactions;
}

/**
 * Returns a prepared transaction for the transfer
 * of mosaics on a Symbol network.
 *
 * @param   Address       recipient
 * @param   MosaicId      mosaicId 
 * @param   number        amount
 * @param   NetworkType   networkType   (Optional) The symbol network type.
 * @param   number        maxFee        (Optional) The symbol network transaction fee.
 * @return  TransferTransaction
 */
export const getTransferTransaction = (
  recipient: Address,
  mosaicId: MosaicId,
  amount: number,
  message: string = '',
  networkType: NetworkType = NetworkType.TEST_NET,
  maxFee: number = 30000,
): TransferTransaction => {
  return TransferTransaction.create(
    Deadline.create(1573430400),
    recipient,
    [new Mosaic(mosaicId, UInt64.fromUint(amount))],
    PlainMessage.create(message),
    networkType,
    UInt64.fromUint(maxFee),
  )
}

/**
 * Returns a prepared transaction for the creation
 * of names on a Symbol network.
 *
 * @param   string        namespaceName 
 * @param   number        duration 
 * @param   NetworkType   networkType   (Optional) The symbol network type.
 * @param   number        maxFee        (Optional) The symbol network transaction fee.
 * @return  NamespaceRegistrationTransaction
 */
export const getNamespaceRegistrationTransaction = (
  namespaceName: string,
  duration: number,
  networkType: NetworkType = NetworkType.TEST_NET,
  maxFee: number = 30000,
): NamespaceRegistrationTransaction => {
  const isSub = /\.{1,}/.test(namespaceName);
  const parts = namespaceName.split('.');
  const parent = parts.slice(0, parts.length-1).join('.');
  const current = parts.pop();

  if (isSub === true) {
    // sub namespace level[i]
    return NamespaceRegistrationTransaction.createSubNamespace(
      Deadline.create(1573430400),
      current,
      parent,
      networkType,
      UInt64.fromUint(maxFee)
    );
  }

  // root namespace
  return NamespaceRegistrationTransaction.createRootNamespace(
    Deadline.create(1573430400),
    namespaceName,
    UInt64.fromUint(duration),
    networkType,
    UInt64.fromUint(maxFee)
  )
}

/**
 * Returns a prepared transaction for the aliasing
 * of addresses on a Symbol network.
 *
 * @param   string        alias 
 * @param   Address       address 
 * @param   NetworkType   networkType   (Optional) The symbol network type.
 * @param   number        maxFee        (Optional) The symbol network transaction fee.
 * @return  NamespaceRegistrationTransaction
 */
export const getAddressAliasTransaction = (
  alias: string,
  address: Address,
  networkType: NetworkType = NetworkType.TEST_NET,
  maxFee: number = 30000,
): AddressAliasTransaction => {
  return AddressAliasTransaction.create(
    Deadline.create(1573430400),
    AliasAction.Link,
    new NamespaceId(alias),
    address,
    networkType,
    UInt64.fromUint(maxFee)
  );
}

/**
 * Returns multiple prepared transactions including:
 * - NamespaceRegistrationTransactions for names and children.
 * - AddressAliasTransaction for aliasing accounts on-chain.
 *
 * @param   string          alias 
 * @param   PublicAccount   publicAccount 
 * @return  Transaction[]
 */
export const getIdentityAliasTransactions = (
  alias: string,
  publicAccount: PublicAccount,
): Transaction[] => {
  const aliasParts = alias.split('.');
  if (aliasParts.length > 3 || !alias.match(/^[a-z0-9-]*/)) {
    throw 'Invalid namespace name "' + alias + '", maximum 3 levels allowed (separated by dots).'
  }

  let registerTxes = [];
  for (let i = 0; i < aliasParts.length; i++) {
    const fullName = i === 0 ? aliasParts[0] : aliasParts.slice(0, i+1).join('.');

    // create current level namespace registration transaction
    const registerTx = getNamespaceRegistrationTransaction(fullName, env.BLOCKS_IN_ONE_YEAR);
    registerTxes.push(registerTx.toAggregate(publicAccount));
  }

  return registerTxes
}

/**
 * Prepare a contract in the form of an aggregate
 * transaction wrapper including \a transactions.
 *
 * @param   Transaction[]   transactions  The transactions to bundle as one contract.
 * @param   NetworkType   networkType     (Optional) The symbol network type.
 * @param   number        maxFee          (Optional) The symbol network transaction fee.
 * @return  AggregateTransaction
 */
export const getContract = (
  transactions: Transaction[],
  networkType: NetworkType = NetworkType.TEST_NET,
  maxFee: number = 30000,
): AggregateTransaction => {
  return AggregateTransaction.createComplete(
    Deadline.create(1573430400),
    transactions,
    networkType,
    [],
    UInt64.fromUint(maxFee),
  );
}
