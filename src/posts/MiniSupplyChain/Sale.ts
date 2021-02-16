/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {command, metadata, option} from 'clime';
import chalk from 'chalk';
import * as fs from 'fs';

import { AggregateTransaction, MosaicId, Transaction, TransactionMapping } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
import { TransactionURI } from 'symbol-uri-scheme'

import {OptionsResolver} from '../../kernel/OptionsResolver';
import {Snippet, SnippetInputs} from '../../kernel/Snippet';
import {description} from '../default'

import {
  getAddress,
  getContract,
  getSigner,
  getTransferTransaction,
} from '../../snippets/symbol/core'
import * as env from '../../snippets/symbol/env'

/**
 * The Product interface describes products
 * in our hypothetical company's supply chain.
 */
interface Product {
  name: string
  sku: string
  count: number,
  price: number,
  tokenId?: MosaicId,
}

/**
 * The list of hypothetical products of the company
 * for which the supply chain will be digitalised.
 */
const PRODUCTS: Product[] = [
  {name: 'My awesome book', sku: 'UBC21-34560015-01', count: 100, price: 10, tokenId: new MosaicId([0, 1])},
  {name: 'My other awesome book', sku: 'UBC21-34560015-02', count: 50, price: 20, tokenId: new MosaicId([0, 2])},
  {name: 'My third awesome book', sku: 'UBC21-34560015-03', count: 10000, price: 5.99, tokenId: new MosaicId([0, 3])},
]

/**
 * The MiniSupplyChain class defines a minimal
 * viable supply chain configuration using NEM
 * and Symbol features to tokenise products and
 * track sales using a Symbol blockchain network.
 */
class MiniSupplyChain {
  /**
   * Our company identities
   * @var Map<string, MnemonicPassPhrase>
   */
  protected identities: Map<string, MnemonicPassPhrase> = new Map<string, MnemonicPassPhrase>([
    ['owner', MnemonicPassPhrase.createRandom()],
    ['transporter', MnemonicPassPhrase.createRandom()],
  ])

  /**
   * Tokenise a "mini supply chain"
   *
   * @param   string      company     Our hypothetical company name.
   * @param   Product[]   products    Our hypothetical products.
   * @param   boolean     debug       (Optional) Whether to enable debug mode.
   */
  public constructor(
    public readonly company: string,
    public readonly products: Product[],
    public readonly debug: boolean = false
  ) {
    // - Display supply chain tokenization
    if (this.debug) {
      console.log(chalk.yellow('Company name:         ') + company)
      console.log(chalk.yellow('Number of products:   ') + products.length)
      console.log(chalk.yellow('Address of the Owner: ') + getAddress(this.identities.get('owner')).plain())
    }
  }

  /**
   * Sell a tokenized product to a *random* buyer.
   * 
   * @param   string    sku     The product SKU.
   * @return  SignedTransaction
   */
  public sell(
    sku: string
  ): AggregateTransaction {
    // - Find product by SKU
    const product = this.products.find((p, ix) => {
      return p.sku === sku
    })

    // - Supply Chain Step #1: Send product to Transporter
    const transport = getTransferTransaction(
      getAddress(this.identities.get('transporter')),
      product.tokenId,
      1
    )

    // - Supply Chain Step #2: Transport product to *random* customer
    const delivery = getTransferTransaction(
      getAddress(MnemonicPassPhrase.createRandom()),
      product.tokenId,
      1
    )

    // - Setup our supply chain sales tracking digital contract
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract([

      // - Sign off #1: The company owner is whom signs off for step #1
      transport.toAggregate(getSigner(this.identities.get('owner')).publicAccount),

      // - Sign off #2: The logistics transporter is whom signs off for step #2
      delivery.toAggregate(getSigner(this.identities.get('transporter')).publicAccount)

    ]);
  }
}

export class SaleInputs extends SnippetInputs {
  @option({
    flag: 'n',
    description: 'The company name',
  })
  name: string;

  @option({
    flag: 'p',
    description: 'The product SKU (product identifier)',
  })
  sku: string;
}

@command({
  description: 'Track the sale of a product in your tokenized supply chain with Symbol blockchain',
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
    return 'Sale'
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
   * Execution routine for the `Sale` command.
   *
   * @param {PartialCosignatureInputs} inputs
   * @return {Promise<any>}
   */
  @metadata
  async execute(inputs: SaleInputs) 
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
      inputs['sku'] = OptionsResolver(inputs,
        'sku',
        () => { return ''; },
        '\nEnter the product SKU: ');
    } catch (err) { this.error('Please, enter a product SKU.'); }

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

    // - Prepare our supply chain instance
    const digitalSupplyChain = new MiniSupplyChain(
      inputs['name'],
      PRODUCTS,
      inputs['debug'],
    )

    // - execute snippet
    return new Promise((resolve, reject) => {

      const digitalContract: AggregateTransaction = digitalSupplyChain.sell(inputs['sku'])

      console.log(chalk.yellow('Transaction URI: ') + chalk.yellow((new TransactionURI(
        digitalContract.serialize(),
        TransactionMapping.createFromPayload,
        env.NETWORK_HASH,
        'http://127.0.0.1:3000',
      )).build()))

      return resolve('');
    });
  }
}
