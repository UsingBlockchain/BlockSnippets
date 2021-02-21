/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
// backend / external dependencies
const fs = require('fs')
import { command, metadata, option } from 'clime';
import chalk from 'chalk';

// Symbol from NEM dependencies
import { NetworkType } from 'symbol-sdk'
import { QRCodeGenerator, QRCodeSettings } from 'symbol-qr-library'

// in-package dependencies
import * as env from '../../kernel/env'
import { OptionsResolver } from '../../kernel/OptionsResolver';
import { Snippet, SnippetInputs } from '../../kernel/Snippet';

// in-snippet dependencies
import { description } from './default'
import { PasswordResolver } from './Resolvers/PasswordResolver';
import { Business, DigitalContract } from './Repositories/Business'
import { Backup } from './Repositories/Backup'
import { Gamification } from './Concerns/Gamification'
import { Product } from './Repositories/Product'
import { Identity } from './Repositories/Identity'
import { slugify } from '../../kernel/Helpers';

export class RewardInputs extends SnippetInputs {
  @option({
    flag: 'n',
    description: 'The name of the digital business.',
  })
  name: string;
  @option({
    flag: 'p',
    description: 'The password to unlock a digital business.',
  })
  password: string;
  @option({
    flag: 'e',
    description: 'The employee that will be rewarded (Sending an appreciation message).',
  })
  employee: string;
}

@command({
  description: 'Reward an employee of your digital business with MiniBusiness by Using Blockchain Ltd (https://ubc.digital)',
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

  /**
   * Our digital products
   * @var Product[]
   */
  protected products: Product[]

  constructor() {
      super();
  }

  /**
   * Get the name of the contract
   *
   * @return string
   */
  public getName(): string {
    return 'Reward'
  }

  /**
   * Execution routine for the `Reward` command.
   *
   * @param RewardInputs inputs
   * @return Promise<any>
   */
  @metadata
  async execute(inputs: RewardInputs) 
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

    try {
      inputs['employee'] = OptionsResolver(inputs,
        'employee',
        () => { return ''; },
        '\nEnter the full name of the employee to reward: ');
    } catch (err) { this.error('Please, enter an employee name.'); }

    // - Try to re-create from backup
    this.backup = new Backup(inputs['name'])
    if (inputs['debug']) {
      console.log('Using data file path: ' + chalk.yellow(this.backup.filepath))
    }

    if (! fs.existsSync(this.backup.filepath)) {
      console.log(chalk.red('Cannot find digital business. Please, run the "Create" command first.'))
      return process.exit(1)
    }

    // - Reads digital business from backup
    this.digitalBiz = this.backup.business

    // - Try to unlock the governor identity (validates password)
    this.digitalBiz.governor.unlock(inputs['password'])

    // - Validate employee by name
    if (-1 === this.digitalBiz.identities.findIndex(
      i => i.name === inputs['employee']
    )) {
      const known = this.digitalBiz.identities
      throw 'Employee could not be found. Should be one of: ' + known.map(i => {
        return i.name
      }).join(', ')
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

    // - "Fetch" employee by name (not optimal ;)
    const employeeIdx = this.digitalBiz.identities.findIndex(
      i => i.name === inputs['employee']
    )

    // - Configure gamification concern
    const gamificationConcern: Gamification = new Gamification(
      this.digitalBiz.governor,
      this.digitalBiz.identities[employeeIdx],
    )

    // - Prepare digital contract, currently unsigned
    const digitalContract: DigitalContract = this.digitalBiz.dispatch(gamificationConcern, inputs)

    // - Display QR Code for easier access to transaction
    const transactionQR = QRCodeGenerator.createTransactionRequest(
      digitalContract, NetworkType.TEST_NET, env.NETWORK_HASH
    )

    // - Save QR Code to PNG if necessary
    let contractName = 'Reward-' + slugify(inputs['employee']),
        contractPath = this.backup.contractspath + '/' + contractName + '.png'
    if (!fs.existsSync(contractPath)) {
      let base64 = await transactionQR.toBase64(new QRCodeSettings('M', 50)).toPromise()
      contractPath = this.backup.saveContract(contractName, base64)
    }

    // - Display digital contract
    console.log('')
    console.log(chalk.yellow("Digital Contract located at: ") + chalk.green(contractPath))
    console.log('')
    return process.exit(0)
  }
}
