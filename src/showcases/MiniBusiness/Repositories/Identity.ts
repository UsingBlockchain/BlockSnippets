/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import sha256 from 'fast-sha256';
import { Account, Crypto, NetworkType, PublicAccount } from 'symbol-sdk'
import { ExtendedKey, MnemonicPassPhrase, Network, Wallet } from 'symbol-hd-wallets'

import { KeyProvider } from '../../../kernel/KeyProvider'
import { getPrivateKey, getPublicKey } from '../../../kernel/adapters/Symbol'

/**
 * The Identity class describes digital identities
 * in our hypothetical company's digitalisation.
 */
export class Identity extends KeyProvider {

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

  /**
   * A hashed copy of the password.
   * @var string
   */
  public passwordHash: string

  /**
   * Re-create an identity from a backup storage.
   *
   * @param   any   backup    The backup data (i.e. a parsed JSON object)
   * @return  Identity
   */
  public static createFromBackup(
    backup: Identity
  ): Identity {
    // - Reads basic information from identity
    let identity = new Identity(backup.name, backup.alias)
    identity.salt = backup.salt
    identity.encryptedSeed = backup.encryptedSeed
    identity.passwordHash = backup.passwordHash
    identity.publicKey = backup.publicKey

    // - Returns the prepared identity
    return identity
  }

  /**
   * Creates a digital identity.
   *
   * @param   string    name      The employee name (full name).
   * @param   string    alias     A short alias / nickname for the employee.
   * @param   string    title     A job title (e.g. CTO, Chief Executive Officer, Owner, etc.).
   * @param   string    password  The plaintext password to unlock this identity. This field is overwritten in the constructor.
   * @return  Identity  Sensitive information like the `seed` and `password` are encrypted after construction.
   */
  public constructor(
    public readonly name: string,
    public readonly alias: string,
    //XXX if password omitted, should initialize to backup data (readonly)
    private password?: string,
  ) {
    super()

    if (undefined !== this.password) {
      // - Generates random salt and get binary of pass
      const binarySalt = MnemonicPassPhrase.CATAPULT_RNG(16)
      const binaryPw = Buffer.from(this.password, 'utf8')

      // - From here on, always use salted password
      //// Note: It is very important to use the binary *plaintext* password here
      const saltedPw = Buffer.concat([binarySalt, binaryPw])

      // - Stores salt in hexadecimal format
      this.salt = binarySalt.toString('hex')

      // - Create random mnemonic and store pubkey
      const mnemonic = MnemonicPassPhrase.createRandom()
      const pwdSeed  = mnemonic.toSeed(
        saltedPw.toString('utf8')
      ).toString('hex')

      // - Derive default account public key
      this.publicKey = getPublicKey(pwdSeed, "m/44'/4343'/0'/0'/0'")

      // - Uses salted plaintext password to encrypt mnemonic phrase
      this.encryptedSeed = Crypto.encrypt(pwdSeed, saltedPw.toString('utf8'))

      // - Saves password hash to never store in plain text
      this.passwordHash = Buffer.from(sha256(saltedPw)).toString('hex')

      // - Drops the plaintext password from the instance
      delete this.password
    }
  }

  /**
   * Returns a `PublicAccount` object around the
   * current instance's public key.
   *
   * @param   NetworkType   networkType   (Optional) The Symbol network type.
   * @return  PublicAccount
   */
  public getPublicInfo(
    networkType: NetworkType = NetworkType.TEST_NET,
  ): PublicAccount {
    return PublicAccount.createFromPublicKey(
      this.publicKey,
      networkType,
    )
  }

  /**
   * Unlocks a signer account with \a password at BIP32 derivation
   * path \a path for Symbol \a networkType.
   *
   * @warn    This method returns sensitive information.
   * @param   string        password      The plaintext password to unlock the identity.
   * @param   string        path          (Optional) The BIP32 derivation path.
   * @param   NetworkType   networkType   (Optional) The Symbol network type.
   * @return  Account
   */
  public unlock (
    password: string,
    path: string = "m/44'/4343'/0'/0'/0'",
    networkType: NetworkType = NetworkType.TEST_NET,
  ): Account {
    if (! this.encryptedSeed.length) {
      throw 'This identity cannot be unlocked.'
    }

    // - Re-construct binary salt and get binary of pass
    const binarySalt = Buffer.from(this.salt, 'hex')
    const binaryPw = Buffer.from(password, 'utf8')

    // - From here on, always use salted password
    //// Note: It is very important to use the binary *plaintext* password here
    const saltedPw = Buffer.concat([binarySalt, binaryPw])
    const hashedPw = Buffer.from(sha256(saltedPw)).toString('hex')

    // - Security: match passwords
    if (hashedPw !== this.passwordHash) {
      throw 'Account unlock procedure aborted. Invalid password.'
    }

    // - Unlock the BIP32 seed (encrypted with salted plaintext password)
    const unlocked = Crypto.decrypt(this.encryptedSeed, saltedPw.toString('utf8'))

    // - read private key from seed
    const privKey = getPrivateKey(unlocked, path)
    return Account.createFromPrivateKey(
      privKey,
      networkType,
    );
  }
}
