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
    this.path = __dirname + '/../../../data/'
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

}
