import { prop, filter, clone } from 'ramda'

/**
 * Return the maximum sku price
 * @param {array of sku's} items
 */
export const getMaxSkuPrice = items => {
  if (!items) return 0

  return items.reduce((max, sku) => {
    const [
      {
        commertialOffer: { Price },
      },
    ] = sku.sellers

    return Math.max(max, Price)
  }, 0)
}

/**
 * Remove the 'https' from the given url
 * @param {string} url
 */
export const stripUrl = url => url.replace(/^https?:/, '')

/**
 * Parse the variations field in the sku object
 * @param {sku} sku
 */
export const parseSku = sku => {
  const result = clone(sku)
  for(const variation of sku.variations) {
    result[variation.name] = variation.values[0];
  }
  result.variations = sku.variations.map(prop('name'))
  return result
}

/**
 * Verifies if the variation is color
 * @param {string} variation
 */
export const isColor = variation => {
  if (!variation) return false

  return (
    variation.toLowerCase() === 'cor' || variation.toLowerCase() === 'color'
  )
}

/**
 * Choose wich variation will be the main one.
 * @param {Array[string]} variations
 */
export const getMainVariationName = variations => {
  for (let i = 0; i < variations.length; i++) {
    if (isColor(variations[i])) return variations[i]
  }

  return variations[0]
}

/** 
 * Given a selectedVariations, find the first item that has those variations selected
 * selectedVariations format: { "color": "black", size: "small", fabric: null }
 * items: skuItems parsed with variations fields
 * Output: item or null, if not present
*/

export const findItemWithSelectedVariations = (items, selectedVariations) => {
  const selectedNotNull = filter(Boolean, selectedVariations)
  const selectedCount = Object.keys(selectedNotNull).length
  if (selectedCount === 0) {
    // may return any item, return first element
    return items[0]
  }
  return items.find(isSkuSelected(selectedNotNull))
}

/** 
 * Given a selectedVariations, find items that have those variations selected
 * selectedVariations format: { "color": "black", size: "small", fabric: null }
 * items: skuItems parsed with variations fields
 * Output: list of items with those variations
*/

export const findListItemsWithSelectedVariations = (items, selectedVariations) => {
  const selectedNotNull = filter(Boolean, selectedVariations)
  const selectedCount = Object.keys(selectedNotNull).length
  if (selectedCount === 0) {
    // return all
    return items
  }
  return items.filter(isSkuSelected(selectedNotNull))
}

/** Private functions */
const isSkuSelected = (selectedNotNull) => (sku) => {
  const hasAll = Object.keys(selectedNotNull).every(variationName => {
    const selectedValue = selectedNotNull[variationName]
    return sku[variationName] === selectedValue
  })
  return hasAll
}
