/**
 * Part of BlockSnippets shared under AGPLv3
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import chalk from 'chalk'
import { Listener, NamespaceHttp } from 'symbol-sdk'

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
  });
}
catch (e) {}
