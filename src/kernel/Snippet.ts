/**
 * 
 * Copyright 2020-2021 Grégory Saive for Using Blockchain Ltd
 * (https://using-blockchain.org), All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
   * Returns whether the contract requires authentication
   *
   * @return {boolean}
   */
  public abstract requiresAuth(): boolean

  /**
   * Execute a snippet
   *
   * @param {SnippetInputs} inputs
   * @return {Promise<any>}
   */
  protected async abstract executeSnippet(
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
    description: 'Enable debug mode',
  })
  debug: boolean;
}
