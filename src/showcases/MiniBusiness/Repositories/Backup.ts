/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
const fs = require('fs')
import { Business } from './Business'
import { slugify } from '../../../kernel/Helpers'

export class Backup {
  /**
   * Storage path (path to folder)
   * @var string
   */
  protected path: string

  /**
   * File name
   * @var string
   */
  protected file: string

  /**
   * Construct a backup storage.
   *
   * @param   string    name
   * @param   Business  business
   */
  public constructor(
    public readonly name: string,
    public business?: Business
  ) {
    this.path = __dirname + '/../../../../data/'
    this.file = slugify(name).replace(/\.json$/, '') + '.json'

    // - Validate storage capacity
    if (! fs.existsSync(this.path)) {
      throw 'Storage path: ' + this.path + ' does not exist.'
    }

    // - Re-create from storage when necessary
    if (! this.business && fs.existsSync(this.filepath)) {
      const json = fs.readFileSync(this.filepath).toString()
      this.business = Business.createFromBackup(JSON.parse(json))
    }
  }

  /**
   * Get the storage file path (full path)
   *
   * @return string
   */
  public get filepath(): string {
    return this.path + this.file
  }

  /**
   * Get the storage path for contracts (full path)
   *
   * @return string
   */
  public get contractspath(): string {
    return this.path + this.file.replace(/\.json$/, '') + '-contracts'
  }

  /**
   * Save the blockchain information to storage.
   *
   * @return  string   The storage file path.
   */
  public save() {
    if (! this.business) {
      throw 'Digital business misconfiguration.'
    }

    // - Save to filesystem
    fs.writeFileSync(this.filepath, this.business.toJSON())
    return this.filepath
  }

  /**
   * Save a prepared contract to storage.
   *
   * @param   string   name     This digital contract name.
   * @param   string   data     Base64 encoded QR Code bytes.
   * @return  string   The digital contract storage path.
   */
  public saveContract(
    name: string,
    data: string,
  ) {
    // - Create contracts folder just in time
    if (! fs.existsSync(this.contractspath)) {
      fs.mkdirSync(this.contractspath)
    }

    // - Strip off the `data:` url prefix to get raw bytes
    data = data.replace(/^data:image\/\w+;base64,/, '')

    // - Decode bytes into binary buffer
    const binaryQR: Buffer = Buffer.from(data, 'base64');
    const contractPath = this.contractspath + '/' + name + '.png'

    // - Save to filesystem
    fs.writeFileSync(contractPath, binaryQR)
    return contractPath
  }

}
