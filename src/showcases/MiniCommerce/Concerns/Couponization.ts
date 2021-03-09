/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction, Transaction } from 'symbol-sdk'

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
 * The Couponization class describes an atomically executable
 * digital concern.
 *
 * This concern is responsible for the creation of digital
 * coupons related to Symbol mosaics (smart assets).
 */
export class Couponization extends Concern {

  /**
   * Creates a couponization concern where \a product
   * can be referred to with an online coupon.
   *
   * @param   IdentityModel     owner     Owner of the on-chain assets (i.e. "governor").
   * @param   ProductModel      product   The product that is referred to with said coupons.
   * @return  Couponization
   */
  public constructor(
    protected owner: IdentityModel,
    protected product: ProductModel,
    protected quantity: number,
  ) {
    super()
  }

  /**
   * This concern creates a "price quote request" coupon
   * which consists in sending a message to the owner of
   * the e-commerce.
   *
   * When your customers scan the resulting QR-Code, all
   * they need to do is to sign the digital contract and
   * you will be notified on your blockchain account.
   *
   * :note: This type of QR-Code can be freely shared with
   * others because it doesn't contain any sensitive info.
   *
   * @param   CommandLineArgument   inputs  A list of command line arguments (see SnippetInputs).
   * @return  DigitalContract       The digital contract representing the online coupon. Share it!
   */
  public execute(
    inputs: CommandLineArguments,
  ): DigitalContract {

    // - All transactions will be bundled in one contract
    let transactions: Transaction[] = []

    // - (1) Prepare a pre-formatted message
    const formattedMessage =  'Price Quote Request for ' 
      + this.quantity
      + ' '
      + this.product.sku

    // - (2) Sends a message to the e-commerce governor
    const productRequest = getTransferTransaction(
      this.owner.getPublicInfo().address,
      undefined, // (3) no assets added
      undefined, // (4) empty quantity
      formattedMessage,
    );
    transactions.push(productRequest)

    // - (5) Setup our distributed governance digital contract.
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract(transactions);
  }
}
