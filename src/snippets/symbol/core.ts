/**
 * Part of BlockSnippets shared under AGPLv3
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {
  Address,
  AggregateTransaction,
  Deadline,
  MosaicDefinitionTransaction,
  MosaicFlags,
  MosaicId,
  MosaicSupplyChangeAction,
  MosaicSupplyChangeTransaction,
  MosaicNonce,
  NamespaceRegistrationTransaction,
  NetworkType,
  Transaction,
  UInt64,
} from 'symbol-sdk'
import { ExtendedKey, MnemonicPassPhrase, Network, Wallet } from 'symbol-hd-wallets'

/**
 * Create an account with mnemonic pass phrase and
 * return its public key in hexadecimal format.
 *
 * @param   {MnemonicPassPhrase} mnemonic   The mnemonic pass phrase (12,16,24 words)
 * @param   {string}             path       (Optional) The address derivation path.
 * @return  {string}  Returns the public key of the derived account.
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
 * @param   {MnemonicPassPhrase} mnemonic   The mnemonic pass phrase (12,16,24 words)
 * @param   {string}             path       (Optional) The address derivation path.
 * @return  {string}  Returns the private key of the derived account.
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
 * Create an account with mnemonic pass phrase and
 * return a prepared transaction for the creation
 * of mosaic, adding a namespace to refer to the 
 * created assets by name.
 *
 * @param   {Address} ownerAddress  The products owner address
 * @param   {string}  productName   The product name
 * @param   {number}  countItems    The number of items
 * @return  {string}  Returns the public key of the derived account.
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
 * Prepare a contract in the form of an aggregate
 * transaction wrapper including \a transactions.
 *
 * @param   {Transaction[]}   transactions
 * @return  {AggregateTransaction}
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
