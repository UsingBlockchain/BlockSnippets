/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { MosaicId } from 'symbol-sdk'

/**
 * The Product interface describes products
 * in our hypothetical digital business.
 */
export interface Product {
  name: string
  sku: string
  count: number
  price: number
  tokenId?: MosaicId
}

/**
 * The list of hypothetical products of the company
 * for which the supply chain will be digitalised.
 */
export const EXAMPLE_PRODUCTS: Product[] = [
  {name: 'My awesome book', sku: 'UBC21-34560015-01', count: 100, price: 10},
  {name: 'My other awesome book', sku: 'UBC21-34560015-02', count: 50, price: 20},
  {name: 'My third awesome book', sku: 'UBC21-34560015-03', count: 10000, price: 5.99},
]
