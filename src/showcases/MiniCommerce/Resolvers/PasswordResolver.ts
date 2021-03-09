/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import * as readlineSync from 'readline-sync';

/**
 * Command line argument reader for passwords
 *
 * @param options 
 * @param key 
 * @param promptText 
 * @param readlineDependency
 * @return {any}
 */
export const PasswordResolver = (
  options: any,
  key: string,
  promptText: string,
  readlineDependency?: any
): any => {
  const readline = readlineDependency || readlineSync;
  return options[key] !== undefined ? options[key] : readline.question(promptText);
}
