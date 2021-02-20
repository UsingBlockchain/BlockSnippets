/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */

import sha256 from 'fast-sha256';

/**
 * Generates a Bitcoin block hash.
 *
 * @param   string  version       Version of the block (256-bit integer, little-endian format)
 * @param   string  previousHash  Hash of the previous block (32 bytes, little-endian format)
 * @param   string  merkleRoot    Merkle root hash (transactions hash ; 32 bytes, little-endian format) 
 * @param   string  timestamp     The block timestamp (256-bit integer, little-endian format) 
 * @param   string  bits          The target bits (256-bit integer, little-endian format) 
 * @param   string  nonce         The nonce byte (256-bit integer, little-endian format) 
 * @return  string  The hexadecimal block hash.
 */
export const getBlockHash = (
  version: string,
  previousHash: string,
  merkleRoot: string,
  timestamp: string,
  bits: string,
  nonce: string,
): string => {
  // - Concatenate all header data
  const header = version + previousHash + merkleRoot + timestamp + bits + nonce;
  const binary = Buffer.from(header, 'hex');

  // - Use SHA-256 hasher a first time
  const round1 = sha256(binary);

  // - Second hasher round
  const round2 = sha256(round1);

  // - Now swap bits back to "big endianness"
  const hashed = Buffer.from(round2).reverse();
  return hashed.toString('hex')
}
