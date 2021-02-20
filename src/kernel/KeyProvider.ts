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
  protected encryptedSeed: string

  /**
   * The public key (in hex format). This is the public key
   * of the default derivation path at: m/44'/4343'/0'/0'/0'
   * @var string
   */
  public publicKey: string
}
