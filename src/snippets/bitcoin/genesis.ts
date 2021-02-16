/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import sha256 from 'fast-sha256';
import chalk from 'chalk'

// @see https://en.bitcoin.it/wiki/Genesis_block
const version = '01000000';
const previousBlock = '0000000000000000000000000000000000000000000000000000000000000000';
const merkleRoot = '3BA3EDFD7A7B12B27AC72C3E67768F617FC81BC3888A51323A9FB8AA4B1E5E4A';
const timestamp = '29AB5F49';
const bits = 'FFFF001D'; 
const nonce = '1DAC2B7C';

// - Concatenate all header data
const header = version + previousBlock + merkleRoot + timestamp + bits + nonce;
const binary = Buffer.from(header, 'hex');

// - Use hasher then convert back to binary
const round1 = sha256(binary);

// - Second hasher pass
const round2 = sha256(round1);

// - Now swap bits back to "big endianness"
const hashed = Buffer.from(round2).reverse().toString('hex');
console.log(chalk.yellow('Genesis Block Hash: ') + hashed);
