/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction, Transaction } from 'symbol-sdk'

import { Concern } from './Concern'
import { Identity } from '../Repositories/Identity'

import { SnippetInputs as CommandLineArguments } from '../../../kernel/Snippet';
import { PasswordResolver } from '../Resolvers/PasswordResolver';
import {
  getContract,
  getIdentityAliasTransactions,
} from '../../../snippets/symbol/core'

/**
 * The Governance class describes an atomically executable
 * digital concern.
 *
 * This concern is responsible for the creation of digital
 * contracts related to distributed governance.
 */
export class Governance extends Concern {

  /**
   * Creates a distributed governance concern where
   * \a identities *may* be involved.
   *
   * @param   Identity[]   identities  Identities that may be involved when this concern is dispatched.
   * @return  Governance
   */
  public constructor(
    protected identities: Identity[] = [],
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
    // - Governance works with digital identities
    if (! this.identities.length) {
      throw 'No identities configured. Please, add identities information first.'
    }

    // - All transactions will be bundled in one contract
    let transactions: Transaction[] = []

    // - Iterate all identities to be digitalised
    for (let i = 0, m = this.identities.length; i < m; i++) {

      // shortcuts
      const identity = this.identities[i] as Identity

      // - Ask for password input or read from `inputs`
      const unlocked = identity.unlock(PasswordResolver(
        inputs,
        'password' + i,
        '\nEnter the password for \'' + identity.name + '\': '
      ))

      console.log(identity.name + " unlocked: ", unlocked.privateKey)

      // - Create namespace for identity alias on-chain
      // * - NamespaceRegistrationTransactions for names and children.
      // * - AddressAliasTransaction for aliasing accounts on-chain.
      const innerTransactions = getIdentityAliasTransactions(identity.alias.toLowerCase(), unlocked.publicAccount)

      // - Add transactions to contract
      transactions = transactions.concat(innerTransactions)
    }

    // - Setup our distributed governance digital contract.
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract(transactions);
  }
}
