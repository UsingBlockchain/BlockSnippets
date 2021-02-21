/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import * as readlineSync from 'readline-sync';
import { Product } from '../Repositories/Product'

/**
 * Products command line argument reader. This method asks for
 * the input of several fields related to digital products that
 * are created through the command line.
 */
export const ProductResolver = (
  options: any,
  key: string,
  readlineDependency?: any
): Product[] => {

  const readline = readlineDependency || readlineSync;
  const fields = {
    'name': key + '_name',
    'sku': key + '_sku',
    'price': key + '_price',
    'count': key + '_count',
    'next': key + '_next'
  }

  let products = [],
      next = false,
      ix = 1
  do {
    const name = options[fields['name']] !== undefined 
      ? options[fields['name']]
      : readline.question('\nEnter a product name for the product #' + ix + ':  ')

    const sku = options[fields['sku']] !== undefined 
      ? options[fields['sku']]
      : readline.question('\nEnter a product SKU (i.e. a unique identifier) for the product #' + ix + ': ')

    const price = options[fields['price']] !== undefined 
      ? options[fields['price']]
      : readline.question('\nEnter a price in USD for the product #' + ix + ': ')

    const count = options[fields['count']] !== undefined 
      ? options[fields['count']]
      : readline.question('\nHow many items of the product #' + ix + ' do you have in stock? ')

    // - Store as Product
    products.push({name, sku, count, price})

    next = options[fields['next']] !== undefined 
      ? options[fields['next']]
      : readline.keyInYN('\nDo you want to setup another product?')

    ix++
  }
  while (true === next)

  return products
}

export const DigitalProductResolver = (
  knownProducts: Product[],
  options: any,
  key: string,
  readlineDependency?: any
): Product[] => {
  const readline = readlineDependency || readlineSync;
  const fields = {
    'sku': key + '_sku',
    'next': key + '_next'
  }

  let products = [],
      next = false,
      ix = 1
  do {
    const sku = options[fields['sku']] !== undefined 
      ? options[fields['sku']]
      : readline.question('\nEnter the product SKU (i.e. a unique identifier): ')

    let index
    if (-1 !== (index = knownProducts.findIndex(p => p.sku === sku))) {
      // - Identifiable product found
      products.push(knownProducts[index])
    }

    next = options[fields['next']] !== undefined 
      ? options[fields['next']]
      : readline.keyInYN('\nDo you want to select another product?')

    ix++
  }
  while (true === next)

  return products
}

