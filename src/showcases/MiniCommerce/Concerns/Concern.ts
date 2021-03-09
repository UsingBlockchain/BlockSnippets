/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { AggregateTransaction } from 'symbol-sdk'
import { Identity } from '../Repositories/Identity'
import { SnippetInputs as CommandLineArguments } from '../../../kernel/Snippet';

/**
 * The Concern abstract class describes atomically executable
 * digital concerns. Our hypothetical digital business makes 
 * use of these concerns to create digital contracts that are
 * responsible only for minimal tasks, as to keep an easier
 * interface to our blockchain integration.
 */
export abstract class Concern {
  /**
   * Creates a concern around \a identities.
   *
   * @param   Identity[]  identities  Identities that may be involved when this concern is dispatched.
   */
  public constructor(
    protected readonly identities: Identity[] = [],
  ) {}

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
  public abstract execute(
    inputs: CommandLineArguments,
  ): AggregateTransaction
}
