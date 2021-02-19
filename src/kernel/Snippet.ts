/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {Command, Options, option} from 'clime';
import { from as observableFrom } from 'rxjs';

export abstract class Snippet extends Command {

  constructor() {
    super();
  }

/// begin region Abstract Methods
  /**
   * Get the name of the contract
   *
   * @return {string}
   */
  public abstract getName(): string

  /**
   * Execute a snippet
   *
   * @param {SnippetInputs} inputs
   * @return {Promise<any>}
   */
  protected abstract executeSnippet(
    inputs: SnippetInputs,
  ): Promise<any>
/// end region Abstract Methods

  /**
   * Display an error message and exit
   *
   * @internal
   * @param e 
   */
  public error(e) {
    console.error(e)
    process.exit(1)
  }

  /**
   * Configures a disposable smart contract
   *
   * @internal
   * @return {Observable<SnippetInputs}
   */
  protected async configure(
    inputs: SnippetInputs,
  ): Promise<SnippetInputs> {
    const params = new SnippetInputs();

    // done configuring
    return observableFrom([params]).toPromise()
  }
}

export class SnippetInputs extends Options {
  @option({
    flag: 'd',
    required: false,
    description: 'Enables debug mode',
    toggle: true,
  })
  debug: boolean;

  @option({
    flag: 'q',
    required: false,
    description: 'Enables quiet mode',
    toggle: true,
  })
  quiet: boolean;
}
