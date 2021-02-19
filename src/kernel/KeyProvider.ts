/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
/**
 * The KeyProvider interface defines base information
 * required for our usage of public key cryptography.
 */
export abstract class KeyProvider {
  /**
   * The encryption salt (in hex format)
   * @var string
   */
  protected salt: string

  /**
   * The encypted BIP32 seed. This is an identity's
   * mnemonic phrase in a storable format.
   * @var string
   */
  protected seed: string
}
