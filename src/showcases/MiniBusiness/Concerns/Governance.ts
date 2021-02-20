/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction, Transaction } from 'symbol-sdk'

import { Concern } from './Concern'
import { Identity } from '../Repositories/Identity'

import { SnippetInputs as CommandLineArguments } from '../../../kernel/Snippet';
import { PasswordResolver } from '../Resolvers/PasswordResolver';
import { IdentityResolver } from '../Resolvers/IdentityResolver';
import {
  getContract,
  getMultisigConvertTransaction,
  getPublicKey,
} from '../../../kernel/adapters/Symbol'

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
    private password: string,
    protected identities: Identity[] = [],
    protected governor: Identity = null,
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

    // - Creates co-signature to accept the distributed governance
    // * - MultisigAccountModificationTransaction with all identities as cosignatories
    const convertTransaction = getMultisigConvertTransaction(
      this.identities.map(i => i.getPublicInfo())
    )

    // - Setup our distributed governance digital contract.
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract([

      // - Sign off #1: The governor is whom signs off for the conversion
      convertTransaction.toAggregate(this.governor.getPublicInfo()),

    ]);
  }
}
