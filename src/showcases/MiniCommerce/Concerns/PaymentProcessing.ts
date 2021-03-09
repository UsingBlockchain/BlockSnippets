/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction, NamespaceId, Transaction } from 'symbol-sdk'

import { Concern } from './Concern'
import { Identity as IdentityModel } from '../Repositories/Identity'
import { Product as ProductModel } from '../Repositories/Product'
import { DigitalContract } from '../Repositories/Business'

import { SnippetInputs as CommandLineArguments } from '../../../kernel/Snippet';
import {
  getContract,
  getTransferTransaction,
} from '../../../kernel/adapters/Symbol'

/**
 * The PaymentProcessing class describes an atomically executable
 * digital concern.
 *
 * This concern is responsible for the creation of digital
 * coupons related to Symbol mosaics (smart assets).
 */
export class PaymentProcessing extends Concern {

  /**
   * Creates a payment processing concern where \a product
   * price is used to create a transfer transaction where
   * the recipient is the e-commerce owner.
   *
   * @param   IdentityModel     owner     Owner of the on-chain assets (i.e. "governor").
   * @param   ProductModel      product   The product that is referred to with said coupons.
   * @return  PaymentProcessing
   */
  public constructor(
    protected owner: IdentityModel,
    protected product: ProductModel,
  ) {
    super()
  }

  /**
   * This concern creates a payment requests QR Code for
   * specific products. It attaches a quantity of assets
   * that is equal to the price of the product.
   *
   * When your customers scan the resulting QR-Code, all
   * they need to do is to sign the digital contract and
   * you will be notified on your blockchain account.
   *
   * :note: This type of QR-Code can be freely shared with
   * others because it doesn't contain any sensitive info.
   *
   * @param   CommandLineArgument   inputs  A list of command line arguments (see SnippetInputs).
   * @return  DigitalContract       The digital contract representing the payment request. Share it!
   */
  public execute(
    inputs: CommandLineArguments,
  ): DigitalContract {

    // - All transactions will be bundled in one contract
    let transactions: Transaction[] = []

    // - (1) Prepare a pre-formatted message
    const formattedMessage =  'Payment Request for ' 
      + this.product.sku

    // - (2) Define which cryptocurrency is accepted
    const digitalCurrency = new NamespaceId('symbol.xym')

    // - (3) Sends a message to the e-commerce governor
    const productRequest = getTransferTransaction(
      this.owner.getPublicInfo().address,
      digitalCurrency, // (4) Paid with XYM
      this.product.price, // (5) Price depends on the product
      formattedMessage,
    );
    transactions.push(productRequest)

    // - (6) Setup our distributed governance digital contract.
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract(transactions);
  }
}
