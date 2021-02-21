/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
// backend / external dependencies
const fs = require('fs')
import { command, metadata, option } from 'clime';
import chalk from 'chalk';

// in-package dependencies
import { OptionsResolver } from '../../kernel/OptionsResolver';
import { Snippet, SnippetInputs } from '../../kernel/Snippet';

// in-snippet dependencies
import { description } from './default'
import { IdentityResolver } from './Resolvers/IdentityResolver';
import { PasswordResolver } from './Resolvers/PasswordResolver';
import { Business } from './Repositories/Business'
import { Backup } from './Repositories/Backup'
import { Identity } from './Repositories/Identity'

export class CreateInputs extends SnippetInputs {
  @option({
    flag: 'n',
    description: 'The name of the digital business to create.',
  })
  name: string;
  @option({
    flag: 'p',
    description: 'The password to unlock this digital business.',
  })
  password: string;
}

@command({
  description: 'Create a digital business with MiniBusiness by Using Blockchain Ltd (https://ubc.digital)',
})
export default class extends Snippet {
  /**
   * Our backup instance
   * @var Backup
   */
  protected backup: Backup

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
    return 'Create'
  }

  /**
   * Execution routine for the `Create` command.
   *
   * @param CreateInputs inputs
   * @return Promise<any>
   */
  @metadata
  async execute(inputs: CreateInputs) 
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

    try {
      inputs['password'] = PasswordResolver(
        inputs,
        'password',
        '\nEnter the password for this digital business: '
      )
    } catch (err) { this.error('Please, enter a password.'); }

    // - Try to re-create from backup
    this.backup = new Backup(inputs['name'])

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

    if (! fs.existsSync(this.backup.filepath)) {

      // - Reads identities from command line
      this.digitalBiz = new Business(
        inputs['name'],
        new Identity('governor', 'governor', inputs['password']),
        IdentityResolver(inputs['password'], inputs, 'identities'),
        [],
        inputs['debug'],
      )

      // - Make sure we have backed up sensitive data
      this.backup.business = this.digitalBiz
      this.backup.save()
    }
    else {
      // - Reads digital business from backup
      this.digitalBiz = this.backup.business
    }

    if (!('quiet' in inputs) || !inputs['quiet']) {
      console.log('')
      console.log(chalk.yellow('Your digital business is located at: ') + chalk.cyan(this.backup.filepath))
      console.log('')
      console.log(chalk.yellow('Business governor: ') + chalk.cyan(this.digitalBiz.governor.publicKey))
      this.digitalBiz.identities.map(identity => {
        console.log(chalk.yellow('Digital identity for "' + identity.name + '" (public): ') + chalk.cyan(identity.publicKey))
      })
    }

    return process.exit(0)
  }
}
