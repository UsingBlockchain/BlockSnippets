/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction } from 'symbol-sdk'

import chalk from 'chalk';
import { Concern } from '../Concerns/Concern';
import { Identity } from './Identity'
import { Product } from './Product'

import { SnippetInputs as CommandLineArguments } from '../../../kernel/Snippet';

/**
 * Type DigitalContract type defines a wrapper
 * for transactions and is used at the runtime
 * of concerns.
 */
export type DigitalContract = AggregateTransaction

/**
 * The Business class defines a minimal
 * viable business configuration using NEM
 * and Symbol features to setup a distributed
 * governance scheme and tokenise products and
 * track sales using a Symbol blockchain network.
 */
export class Business {
  /**
   * Re-create a business from a backup storage.
   *
   * @param   any   backup    The backup data (i.e. a parsed JSON object)
   * @return  Business
   */
  public static createFromBackup(
    backup: any
  ): Business {
    return new Business(
      backup.name,
      Identity.createFromBackup(backup.governor),
      backup.identities ? backup.identities.map(
        i => Identity.createFromBackup(i)
      ) : [],
      backup.products ? backup.products : [],
      backup.debug
    )
  }

  /**
   * Creates a digital business.
   *
   * @param   string      company     Our hypothetical company name.
   * @param   Identity[]  identities  Our company identities.
   * @param   boolean     debug       (Optional) Whether to enable debug mode.
   */
  public constructor(
    public readonly name: string,
    public governor: Identity,
    public identities: Identity[] = [],
    public products: Product[] = [],
    public readonly debug: boolean = false
  ) {
    // - Display debug information
    if (this.debug) {
      console.log(chalk.yellow('Company name:         ') + this.name)
      console.log(chalk.yellow('Count of employees:   ') + this.identities.length)
    }
  }

  /**
   * Formats a business using JSON.
   *
   * @return string
   */
  public toJSON(): string {
    return JSON.stringify({
      name: this.name,
      debug: this.debug,
      governor: this.governor,
      identities: this.identities,
      products: this.products,
    })
  }

  /**
   * Dispatch a digital concern \a concern with arguments
   * \a inputs.
   *
   * @param   Concern                 concern     The digital concern to execute.
   * @param   CommandLineArguments    inputs      The arguments for execution.
   * @return  DigitalContract         A digital contract that can be signed.
   */
  public dispatch(
    concern: Concern,
    inputs: CommandLineArguments,
  ): DigitalContract {
    // - Execute the concern in context of \a inputs
    return concern.execute(inputs)
  }
}
