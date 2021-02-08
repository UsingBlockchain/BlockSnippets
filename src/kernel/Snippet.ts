/**
 * Part of BlockSnippets
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
    description: 'Enable debug mode',
  })
  debug: boolean;
}
