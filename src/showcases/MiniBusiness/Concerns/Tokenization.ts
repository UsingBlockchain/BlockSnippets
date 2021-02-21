/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction, Transaction } from 'symbol-sdk'

import { Concern } from './Concern'
import { Identity as IdentityModel } from '../Repositories/Identity'
import { Product as ProductModel } from '../Repositories/Product'

import { SnippetInputs as CommandLineArguments } from '../../../kernel/Snippet';
import {
  getContract,
  getMosaicCreationTransactions,
} from '../../../kernel/adapters/Symbol'

/**
 * The Tokenization class describes an atomically executable
 * digital concern.
 *
 * This concern is responsible for the creation of digital
 * products related to Symbol mosaics (smart assets).
 */
export class Tokenization extends Concern {

  /**
   * Creates a tokenization concern where
   * \a products get digitalised.
   *
   * @param   IdentityModel     owner     Owner of the on-chain assets (i.e. "governor").
   * @param   ProductModel[]    products  Products that will be digitalised.
   * @return  Tokenization
   */
  public constructor(
    protected owner: IdentityModel,
    protected products: ProductModel[],
  ) {
    super()
  }

  /**
   * Execute a concern with arguments \a inputs. This method
   * must be overloaded in children concern classes and must
   * return an `AggregateTransaction` transaction which does
   * not contain *any* signatures, yet.
   *
   * Signatures handling will be done in a separate concern,
   * responsible only for the creation of digital signatures.
   *
   * @param   CommandLineArgument   inputs  A list of command line arguments (see SnippetInputs).
   * @return  AggregateTransaction  The digital contract.
   */
  public execute(
    inputs: CommandLineArguments,
  ): AggregateTransaction {
    // - Tokenization works with digital products
    if (! this.products.length) {
      throw 'No products configured. Please, add products information first.'
    }

    // - All transactions will be bundled in one contract
    let transactions: Transaction[] = []

    // - Iterate all products to be tokenized
    for (let i = 0, m = this.products.length; i < m; i++) {

      // - Create one mosaic per product
      const innerTransactions = getMosaicCreationTransactions(
        this.owner.getPublicInfo().address,
        this.products[i].count
      );
      transactions = transactions.concat(innerTransactions)
    }

    // - Setup our distributed governance digital contract.
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract(transactions);
  }
}
