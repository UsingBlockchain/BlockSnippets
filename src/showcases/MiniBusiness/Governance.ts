/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
// backend / external dependencies
const fs = require('fs')
import { command, metadata, option } from 'clime';
import chalk from 'chalk';

// Symbol from NEM dependencies
import { AggregateTransaction, NetworkType } from 'symbol-sdk'
import { QRCodeGenerator } from 'symbol-qr-library'

// in-package dependencies
import * as env from '../../kernel/env'
import { OptionsResolver } from '../../kernel/OptionsResolver';
import { Snippet, SnippetInputs } from '../../kernel/Snippet';

// in-snippet dependencies
import { description } from './default'
import { IdentityResolver } from './Resolvers/IdentityResolver';
import { Business } from './Repositories/Business'
import { Backup } from './Repositories/Backup'
import { Governance } from './Concerns/Governance'

export class GovernInputs extends SnippetInputs {
  @option({
    flag: 'n',
    description: 'The company name',
  })
  name: string;
}

@command({
  description: 'Setup distributed governance schemes for your business with Symbol blockchain (https://ubc.digital)',
})
export default class extends Snippet {
  /**
   * Our digital business instance
   * @var Business
   */
  protected digitalBiz: Business

  constructor() {
      super();
  }

  /**
   * Get the name of the contract
   *
   * @return string
   */
  public getName(): string {
    return 'Govern'
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
   * Execution routine for the `Govern` command.
   *
   * @param GovernInputs inputs
   * @return Promise<any>
   */
  @metadata
  async execute(inputs: GovernInputs) 
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
      inputs['name'] = OptionsResolver(inputs,
        'name',
        () => { return ''; },
        '\nEnter the company name: ');
    } catch (err) { this.error('Please, enter a company name.'); }

    // - Try to re-create from backup
    const backup = new Backup(inputs['name'])
    if (inputs['debug']) {
      console.log('Using data file path: ' + chalk.yellow(backup.filepath))
    }

    if (! fs.existsSync(backup.filepath)) {
      // - Reads identities from command line
      this.digitalBiz = new Business(
        inputs['name'],
        IdentityResolver(inputs, 'identities'),
        inputs['debug'],
      )

      // - Make sure we have backed up sensitive data
      backup.business = this.digitalBiz
      backup.save()
    }
    else {
      // - Reads digital business from backup
      this.digitalBiz = backup.business
    }

    // --------------------------------
    // STEP 2: Execute Contract Actions
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

    // - Configure governance scheme with identities
    const governanceConcern: Governance = new Governance(this.digitalBiz.identities)

    // - Prepare digital contract, currently unsigned
    const digitalContract: AggregateTransaction = this.digitalBiz.dispatch(governanceConcern, inputs)

    // - XXX add signature step if necessary

    // - Display QR Code for easier access to transaction
    const transactionQR = QRCodeGenerator.createTransactionRequest(
      digitalContract, NetworkType.TEST_NET, env.NETWORK_HASH
    )

    return (async () => await transactionQR.toString())()
  }
}
