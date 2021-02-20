/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
/**
 * Environment variables
 *
 * @param   string  NETWORK_HASH            Identify a Catapult blockchain network.
 * @param   number  BLOCK_TARGET_SECONDS    Target number of seconds between blocks.
 * @param   number  BLOCKS_IN_ONE_YEAR      Approximate maximum blocks in one year.
 */
export const NETWORK_HASH: string = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
export const BLOCK_TARGET_SECONDS: number = 15
export const BLOCKS_IN_ONE_YEAR: number = (365 * 24 * 60 * 60) / BLOCK_TARGET_SECONDS
