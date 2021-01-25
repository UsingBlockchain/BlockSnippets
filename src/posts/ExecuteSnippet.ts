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
import {command, metadata, option} from 'clime';
import chalk from 'chalk';

import {OptionsResolver} from '../kernel/OptionsResolver';
import {Snippet, SnippetInputs} from '../kernel/Snippet';
import {description} from './default'

export class ExecuteSnippetInputs extends SnippetInputs {
  @option({
    flag: 'p',
    description: 'The post ID.',
  })
  post: string;
  @option({
    flag: 'o',
    description: 'Order of the snippet.',
  })
  order: string;
}

@command({
  description: 'Disposable Smart Snippet execution',
})
export default class extends Snippet {

  constructor() {
      super();
  }

  /**
   * Get the name of the contract
   *
   * @return {string}
   */
  public getName(): string {
    return 'ExecuteSnippet'
  }

  /**
   * Returns whether the contract requires authentication
   *
   * @return {boolean}
   */
  public requiresAuth(): boolean {
    return false
  }

  /**
   * Execution routine for the `ExecuteSnippet` command.
   *
   * @param {PartialCosignatureInputs} inputs
   * @return {Promise<any>}
   */
  @metadata
  async execute(inputs: ExecuteSnippetInputs) 
  {
    console.log(description)

    let argv: SnippetInputs
    try {
      argv = await this.configure(inputs)
    }
    catch (e) {
      this.error(e)
    }

    // -------------------
    // STEP 1: Read Inputs
    // -------------------

    try {
      inputs['post'] = OptionsResolver(inputs,
        'post',
        () => { return ''; },
        '\nEnter the post ID: ');
    } catch (err) { this.error('Please, enter a post ID.'); }

    try {
      inputs['order'] = OptionsResolver(inputs,
        'order',
        () => { return ''; },
        '\nEnter the number of the snippet: ');
    } catch (err) { this.error('Please, enter a number set.'); }

    // --------------------------------
    // STEP 3: Execute Contract Actions
    // --------------------------------

    // sign transaction and broadcast
    return await this.executeSnippet(inputs);
  }

  /**
   * Execute a snippet
   *
   * @param {SnippetInputs} inputs
   * @return {Promise<any>}
   */
  protected async executeSnippet(
    inputs: SnippetInputs,
  ): Promise<any> {

    console.log('')
    console.log(chalk.yellow('Awaiting magic...'))
    console.log('')

    // announce the aggregate transaction
    return new Promise((resolve, reject) => {
      return resolve(true);
    })
  }
}
