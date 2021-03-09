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
import { Couponization } from './Concerns/Couponization'
import { Product } from './Repositories/Product'

export class CouponiseInputs extends SnippetInputs {
  @option({
    flag: 'n',
    description: 'The name of the e-commerce.',
  })
  name: string;
  @option({
    flag: 'p',
    description: 'The password to unlock a e-commerce.',
  })
  password: string;
  @option({
    flag: 's',
    description: 'The product SKU for which to create a coupon for price quote requests.',
  })
  sku: string;
  @option({
    flag: 'q',
    description: 'The number of items that are attached in the price quote request.',
  })
  quantity: string;
}

@command({
  description: 'Create online coupons for your e-commerce with MiniCommerce by Using Blockchain Ltd (https://ubc.digital)',
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

  /**
   * The digital product that will be offered as a coupon
   * @var Product[]
   */
  protected product: Product

  constructor() {
      super();
  }

  /**
   * Get the name of the contract
   *
   * @return string
   */
  public getName(): string {
    return 'Couponise'
  }

  /**
   * Execution routine for the `Tokenise` command.
   *
   * @param CouponiseInputs inputs
   * @return Promise<any>
   */
  @metadata
  async execute(inputs: CouponiseInputs) 
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

    try {
      inputs['sku'] = OptionsResolver(inputs,
        'sku',
        () => { return ''; },
        '\nEnter a product/service SKU: ');

      // - Make sure we "know" this product
      if (! this.digitalBiz.products.find(
        p => p.sku === inputs['sku']
      )) throw Error('Invalid product SKU.')
    } catch (err) { this.error('Please, enter a product/service SKU.'); }

    try {
      inputs['quantity'] = OptionsResolver(inputs,
        'quantity',
        () => { return ''; },
        '\nEnter a quantity: ');
    } catch (err) { this.error('Please, enter a quantity.'); }

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

    // - Configure tokenization concern
    const couponization: Couponization = new Couponization(
      this.digitalBiz.governor,
      inputs['sku'],
      parseInt(inputs['quantity']),
    )

    // - Prepare digital contract, currently unsigned
    const digitalContract: DigitalContract = this.digitalBiz.dispatch(couponization, inputs)

    // - Display QR Code for easier access to transaction
    const transactionQR = QRCodeGenerator.createTransactionRequest(
      digitalContract, NetworkType.TEST_NET, env.NETWORK_HASH
    )

    // - Save QR Code to PNG if necessary
    let contractPath = this.backup.contractspath + '/Couponise.png'
    if (!fs.existsSync(contractPath)) {
      let base64 = await transactionQR.toBase64(new QRCodeSettings('M', 50)).toPromise()
      contractPath = this.backup.saveContract('Couponise', base64)
    }

    // - Display digital contract
    console.log('')
    console.log(chalk.yellow("Digital Contract located at: ") + chalk.green(contractPath))
    console.log('')
    return process.exit(0)
  }
}
