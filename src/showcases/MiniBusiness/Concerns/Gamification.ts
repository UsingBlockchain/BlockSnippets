/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction, Transaction, PlainMessage } from 'symbol-sdk'

import { Concern } from './Concern'
import { Identity as IdentityModel } from '../Repositories/Identity'

import { SnippetInputs as CommandLineArguments } from '../../../kernel/Snippet';
import {
  getContract,
  getTransferTransaction,
} from '../../../kernel/adapters/Symbol'

/**
 * The Profile class describes an atomically executable
 * digital concern.
 *
 * This concern is responsible for the creation of rewards
 * related to Sales of digital products with Symbol mosaics.
 */
export class Gamification extends Concern {

  /**
   * Creates a gamification concern where sales of
   * \a products get rewarded.
   *
   * @param   IdentityModel     owner     Owner of the on-chain assets (i.e. "governor").
   * @param   IdentityModel     employee  The employee that will be rewarded
   * @return  Gamification
   */
  public constructor(
    protected owner: IdentityModel,
    protected employee: IdentityModel,
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
    // - All transactions will be bundled in one contract
    let transactions: Transaction[] = []

    // - Send an appreciation message to the employee
    const rewardTransaction = getTransferTransaction(
      this.employee.getPublicInfo().address,
      null,
      0,
      'It is great to work with you! Rewarded with MiniBusiness',
    )
    transactions.push(rewardTransaction)

    // - Setup our distributed governance digital contract.
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract([
      // Sign off is done by the owner of the digital business ("governor")
      rewardTransaction.toAggregate(this.owner.getPublicInfo())
    ]);
  }
}
