/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {command, metadata, option} from 'clime';
import chalk from 'chalk';

import { AggregateTransaction, MosaicId, Transaction, TransactionMapping } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
import { TransactionURI } from 'symbol-uri-scheme'

import {OptionsResolver} from '../../kernel/OptionsResolver';
import {Snippet, SnippetInputs} from '../../kernel/Snippet';
import {description} from './default'

import {
  getAddress,
  getContract,
  getMosaicCreationTransactions,
} from '../../kernel/adapters/Symbol'
import * as env from '../../kernel/env'

/**
 * The Product interface describes products
 * in our hypothetical company's supply chain.
 */
interface Product {
  name: string
  sku: string
  count: number
  price: number
  tokenId?: MosaicId
}

/**
 * The list of hypothetical products of the company
 * for which the supply chain will be digitalised.
 */
const PRODUCTS: Product[] = [
  {name: 'My awesome book', sku: 'UBC21-34560015-01', count: 100, price: 10},
  {name: 'My other awesome book', sku: 'UBC21-34560015-02', count: 50, price: 20},
  {name: 'My third awesome book', sku: 'UBC21-34560015-03', count: 10000, price: 5.99},
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
    // - Use "owner" mnemonic passphrase and convert to BIP32 seed
    const ownerBIP32 = this.identities.get('owner').toSeed().toString('hex')

    // - Display supply chain tokenization
    if (this.debug) {
      console.log(chalk.yellow('Company name:         ') + this.company)
      console.log(chalk.yellow('Number of products:   ') + this.products.length)
      console.log(chalk.yellow('Address of the Owner: ') + getAddress(ownerBIP32).plain())
    }
  }

  /**
   * Tokenize a list of products.
   *
   * @param   Product[]   products    The products that will be mapped with mosaics.
   * @return  AggregateTransaction    The broadcastable signed transaction.
   */
  public tokenize(
    products: Product[],
  ): AggregateTransaction {

    // - All transactions will be bundled in one contract
    let transactions: Transaction[] = []

    // - Iterate all products to be tokenized
    for (let i = 0, m = products.length; i < m; i++) {

      // - Create one mosaic per product
      const innerTransactions = getMosaicCreationTransactions(
        getAddress(this.identities.get('owner').toSeed().toString('hex')),
        products[i].count
      );
      transactions = transactions.concat(innerTransactions)
    }

    // - Setup our supply chain tokenization digital contract.
    //   A digital contract consists in one or many transactions
    //   that are all executed together (atomically).

    return getContract(transactions);
  }
}

export class CreateInputs extends SnippetInputs {
  @option({
    flag: 'n',
    description: 'The company name',
  })
  name: string;
}

@command({
  description: 'Tokenize your supply chain with Create and Symbol blockchain',
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
    return 'Create'
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
   * Execution routine for the `Create` command.
   *
   * @param {PartialCosignatureInputs} inputs
   * @return {Promise<any>}
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

    // - Prepare our supply chain instance
    const digitalSupplyChain = new MiniSupplyChain(
      inputs['name'],
      PRODUCTS,
      inputs['debug'],
    )

    // - execute snippet
    return new Promise((resolve, reject) => {

      const digitalContract: AggregateTransaction = digitalSupplyChain.tokenize(PRODUCTS)

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
