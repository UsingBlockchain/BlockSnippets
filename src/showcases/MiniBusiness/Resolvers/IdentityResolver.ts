/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import * as readlineSync from 'readline-sync';
import { PasswordResolver } from './PasswordResolver'
import { Identity } from '../Repositories/Identity'

/**
 * Identity command line argument reader. This method asks for
 * the input of several fields related to identities created
 * through the command line.
 */
export const IdentityResolver = (
  options: any,
  key: string,
  readlineDependency?: any
): any[] => {

  const readline = readlineDependency || readlineSync;
  const fields = {
    'name': key + '_name',
    'alias': key + '_alias',
    'pass': key + '_pass',
    'next': key + '_next'
  }

  let identities = [],
      next = false,
      ix = 1
  do {
    const name = options[fields['name']] !== undefined 
      ? options[fields['name']]
      : readline.question('\nEnter a name (i.e. a full name) for the identity #' + ix + ':  ')

    const alias = options[fields['alias']] !== undefined 
      ? options[fields['alias']]
      : readline.question('\nEnter an alias (i.e. a nickname) for the identity #' + ix + ': ')

    const title = options[fields['title']] !== undefined 
      ? options[fields['title']]
      : readline.question('\nEnter a job title (i.e. CTO) for the identity #' + ix + ':    ')

    const pass = PasswordResolver(
      options,
      fields['pass'],
      '\nEnter the password for the identity #' + ix + ': '
    )

    // - Store as Identity to make use of encrypted data storage
    identities.push(new Identity(name, alias, title, pass))

    next = options[fields['next']] !== undefined 
      ? options[fields['next']]
      : readline.keyInYN('\nDo you want to setup another identity?')

    ix++
  }
  while (true === next)

  return identities
}
