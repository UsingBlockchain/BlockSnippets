/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import chalk from 'chalk'
import { getBlockHash } from '../../kernel/adapters/Bitcoin'

// @see https://en.bitcoin.it/wiki/Genesis_block
console.log(chalk.yellow('Genesis block hash: ') + getBlockHash(
  '01000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '3BA3EDFD7A7B12B27AC72C3E67768F617FC81BC3888A51323A9FB8AA4B1E5E4A',
  '29AB5F49',
  'FFFF001D',
  '1DAC2B7C',
))
