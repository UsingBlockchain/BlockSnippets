/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import chalk from 'chalk'
import { Listener, NamespaceHttp } from 'symbol-sdk'
import {aliceAddress} from './identities'

//- Configure the websocket endpoint
const endpointUrl = 'http://symbol.ubc.network:3000';

//- Names resolution helper
const helper = new NamespaceHttp(endpointUrl);

//- Websocket channel wrapper
const connector = new Listener(endpointUrl + '/ws', helper);

//- Rest happens asynchronously
try {
  (async () => {
    //- Wait for websocket connection
    await connector.open()

    //- Subscribe to new block events
    connector.newBlock().subscribe((newBlock) => {
      console.log(chalk.yellow('New block intercepted: ') + chalk.green('#' + newBlock.height.toString()))
    })

    //- Subscribe to transaction events
    connector.confirmed(aliceAddress).subscribe((transaction) => {
      console.log(chalk.yellow('Transaction confirmed: ') + chalk.green(transaction.transactionInfo.hash))
    })

    // - Subscribe to status error events
    connector.status(aliceAddress).subscribe((statusError) => {
      console.log(chalk.yellow('Status Error: ') + chalk.green(statusError.code))
    })
  });
}
catch (e) {}
