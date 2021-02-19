/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {command, metadata, option} from 'clime';
import chalk from 'chalk';
import * as fs from 'fs';

import {OptionsResolver} from '../kernel/OptionsResolver';
import {Snippet, SnippetInputs} from '../kernel/Snippet';
import {description} from './default'

export class ExecuteSnippetInputs extends SnippetInputs {
  @option({
    flag: 'n',
    description: 'The blockchain network (e.g. "bitcoin", "symbol", "nem").',
  })
  network: string;
  @option({
    flag: 's',
    description: 'Name of the snippet.',
  })
  snippet: string;
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
      inputs['network'] = OptionsResolver(inputs,
        'network',
        () => { return ''; },
        '\nEnter the blockchain network name (e.g. "bitcoin"): ');
    } catch (err) { this.error('Please, enter a blockchain network name.'); }

    try {
      inputs['snippet'] = OptionsResolver(inputs,
        'snippet',
        () => { return ''; },
        '\nEnter the name of the snippet: ');
    } catch (err) { this.error('Please, enter a snippet name.'); }

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

    const networksLocation = __dirname + '/../snippets/';
    const networks = fs.readdirSync(networksLocation);

    // - validate network input
    if (! networks.includes(inputs['network'])) {
      return new Promise((resolve, reject) => {
        return resolve(chalk.red('Network with name "' + inputs['network'] + '" does not exist.'));
      });
    }

    const location = networksLocation + inputs['network'] + '/';
    const snippet  = inputs['snippet'].replace(/\.ts$/, '');

    // - validate snippet input
    if (! fs.existsSync(location + snippet + '.js')) {
      return new Promise((resolve, reject) => {
        return resolve(chalk.red('Snippet with name "' + inputs['snippet'] + '" does not exist.'));
      });
    }

    // - execute snippet
    return new Promise((resolve, reject) => {
      require(location + snippet + '.js');
      return resolve('');
    });
  }
}
