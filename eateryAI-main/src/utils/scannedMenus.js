const SCANNED_PHOTOS_KEY = 'eateryai_scanned_photos'
const SCANNED_MENU_ITEMS_KEY = 'eateryai_scanned_menu_items'
const MAX_SAVED_SCANS = 20
const DEFAULT_RESTAURANT = 'Recently Scanned'
const DEFAULT_CATEGORY = 'Scanned Items'

const CATEGORY_HINTS = new Set([
  'addons',
  'appetizer',
  'appetizers',
  'beverage',
  'beverages',
  'bowls',
  'breakfast',
  'burgers',
  'coffee',
  'combos',
  'dessert',
  'desserts',
  'dinner',
  'drinks',
  'entree',
  'entrees',
  'extras',
  'lunch',
  'mains',
  'menu',
  'noodles',
  'ramen',
  'rice',
  'salad',
  'salads',
  'sandwiches',
  'sides',
  'smoothie',
  'smoothies',
  'snacks',
  'soups',
  'specials',
  'starters',
  'sushi',
  'tacos',
  'tea',
  'teas',
  'juice',
  'juices',
])

export function loadScannedPhotos() {
  return readStorageArray(SCANNED_PHOTOS_KEY)
}

export function loadScannedMenuItems() {
  return readStorageArray(SCANNED_MENU_ITEMS_KEY)
}

export function saveScannedScan({ imageDataUrl, extractedText, knownRestaurants = [] }) {
  const { restaurantName, items } = parseScannedMenuItems(extractedText, knownRestaurants)

  if (items.length === 0) {
    throw new Error('No menu items with prices or nutrition could be parsed from this scan. Try a clearer photo.')
  }

  const scanId = Date.now()
  const scannedAt = new Date().toISOString()
  const photoEntry = {
    id: scanId,
    image: imageDataUrl,
    extractedText,
    scannedAt,
    restaurantName,
    parsedItemCount: items.length,
  }

  const menuItems = items.map((item, index) => ({
    ...item,
    id: `${scanId}-${index}`,
    scanId,
    scannedAt,
  }))

  const existingPhotos = loadScannedPhotos()
  const existingMenuItems = loadScannedMenuItems()
  const nextPhotos = [photoEntry, ...existingPhotos].slice(0, MAX_SAVED_SCANS)
  const retainedScanIds = new Set(nextPhotos.map(photo => photo.id))
  const nextMenuItems = [...menuItems, ...existingMenuItems].filter(item => retainedScanIds.has(item.scanId))

  writeStorageArray(SCANNED_PHOTOS_KEY, nextPhotos)
  writeStorageArray(SCANNED_MENU_ITEMS_KEY, nextMenuItems)

  return {
    photoEntry,
    menuItems,
    restaurantName,
  }
}

export function deleteScannedScan(scanId) {
  const nextPhotos = loadScannedPhotos().filter(photo => photo.id !== scanId)
  const nextMenuItems = loadScannedMenuItems().filter(item => item.scanId !== scanId)

  writeStorageArray(SCANNED_PHOTOS_KEY, nextPhotos)
  writeStorageArray(SCANNED_MENU_ITEMS_KEY, nextMenuItems)

  return {
    photos: nextPhotos,
    menuItems: nextMenuItems,
  }
}

function parseScannedMenuItems(extractedText, knownRestaurants) {
  const lines = extractedText
    .split(/\r?\n/u)
    .map(cleanLine)
    .filter(Boolean)

  if (lines.length === 0) {
    return { restaurantName: DEFAULT_RESTAURANT, items: [] }
  }

  const restaurantName = inferRestaurantName(lines, knownRestaurants)
  const restaurantKey = normalizeText(restaurantName)
  const items = []
  let currentCategory = DEFAULT_CATEGORY

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const lineKey = normalizeText(line)

    if (!lineKey || lineKey === restaurantKey || isIgnorableLine(line)) {
      continue
    }

    if (isCategoryHeader(line)) {
      currentCategory = toTitleCase(line)
      continue
    }

    const inlineDetails = extractDetails(line)
    if (inlineDetails.hasAny) {
      const name = cleanupItemName(removeExtractedDetails(line, inlineDetails))
      if (isValidItemName(name)) {
        items.push(buildMenuItem({ name, restaurantName, category: currentCategory, details: inlineDetails }))
      }
      continue
    }

    const nextLine = lines[index + 1]
    if (!nextLine || isIgnorableLine(nextLine) || isCategoryHeader(nextLine)) {
      continue
    }

    const nextDetails = extractDetails(nextLine)
    if (!nextDetails.hasAny) {
      continue
    }

    const name = cleanupItemName(line)
    if (!isValidItemName(name)) {
      continue
    }

    items.push(buildMenuItem({ name, restaurantName, category: currentCategory, details: nextDetails }))
    index += 1
  }

  return {
    restaurantName,
    items: dedupeItems(items),
  }
}

function buildMenuItem({ name, restaurantName, category, details }) {
  return {
    Restaurant: restaurantName,
    Address: '',
    Category: category || DEFAULT_CATEGORY,
    'Item Name': name,
    Description: '',
    'Price ($)': details.price ?? '',
    Calories: details.calories ?? '',
    'Protein (g)': details.protein ?? '',
    'Fat (g)': details.fat ?? '',
    'Image URL': '',
    Source: 'Scanned OCR',
    'Menu URL': '',
    'Nutrition Estimated': false,
    'OCR Imported': true,
  }
}

function extractDetails(line) {
  const price = extractPrice(line)
  const calories = extractCalories(line)
  const protein = extractProtein(line)
  const fat = extractFat(line)

  return {
    price,
    calories,
    protein,
    fat,
    hasAny: [price, calories, protein, fat].some(value => value != null),
  }
}

function extractPrice(line) {
  const dollarMatches = [...line.matchAll(/\$\s?(\d{1,3}(?:\.\d{1,2})?)/gu)]
  if (dollarMatches.length > 0) {
    const price = Number.parseFloat(dollarMatches.at(-1)[1])
    return price > 0 && price <= 250 ? price : null
  }

  const decimalMatches = [...line.matchAll(/(?:^|[^\d])(\d{1,3}\.\d{1,2})(?!\s*(?:g|grams?|cal|kcal|oz|ml|lb)\b)/giu)]
  if (decimalMatches.length > 0) {
    const price = Number.parseFloat(decimalMatches.at(-1)[1])
    return price > 0 && price <= 250 ? price : null
  }

  const trailingInteger = line.match(/(?:\.{2,}|\s{2,})(\d{1,2})(?:\s*)$/u)
  if (trailingInteger && !/\b(?:cal|protein|fat)\b/iu.test(line)) {
    const price = Number.parseFloat(trailingInteger[1])
    return price > 0 && price <= 60 ? price : null
  }

  return null
}

function extractCalories(line) {
  const labeledCalories = line.match(/\b(?:calories?|kcal)\s*:?\s*(\d{2,4})\b/iu)
  if (labeledCalories) {
    return Number.parseInt(labeledCalories[1], 10)
  }

  const trailingCalories = line.match(/\b(\d{2,4})\s*(?:cal|cals|calories|kcal)\b/iu)
  if (trailingCalories) {
    return Number.parseInt(trailingCalories[1], 10)
  }

  return null
}

function extractProtein(line) {
  const trailingProtein = line.match(/\b(\d{1,3})\s*g(?:rams?)?\s*protein\b/iu)
  if (trailingProtein) {
    return Number.parseInt(trailingProtein[1], 10)
  }

  const labeledProtein = line.match(/\bprotein\s*:?\s*(\d{1,3})(?:\s*g)?\b/iu)
  if (labeledProtein) {
    return Number.parseInt(labeledProtein[1], 10)
  }

  return null
}

function extractFat(line) {
  const labeledFat = line.match(/\bfat\s*:?\s*(\d{1,3})(?:\s*g)?\b/iu)
  if (labeledFat) {
    return Number.parseInt(labeledFat[1], 10)
  }

  const trailingFat = line.match(/\b(\d{1,3})\s*g(?:rams?)?\s*fat\b/iu)
  if (trailingFat) {
    return Number.parseInt(trailingFat[1], 10)
  }

  return null
}

function inferRestaurantName(lines, knownRestaurants) {
  const candidates = lines.slice(0, 8)

  for (const line of candidates) {
    const knownRestaurant = matchKnownRestaurant(line, knownRestaurants)
    if (knownRestaurant) {
      return knownRestaurant
    }
  }

  for (const line of candidates) {
    if (isRestaurantCandidate(line)) {
      return toTitleCase(line)
    }
  }

  return DEFAULT_RESTAURANT
}

function matchKnownRestaurant(line, knownRestaurants) {
  const normalizedLine = normalizeText(line)
  if (!normalizedLine) return null

  for (const restaurant of knownRestaurants) {
    const normalizedRestaurant = normalizeText(restaurant)
    if (!normalizedRestaurant) continue

    if (
      normalizedLine === normalizedRestaurant ||
      normalizedLine.includes(normalizedRestaurant) ||
      normalizedRestaurant.includes(normalizedLine)
    ) {
      return restaurant
    }
  }

  return null
}

function isRestaurantCandidate(line) {
  const normalized = normalizeText(line)
  if (!normalized) return false
  if (isIgnorableLine(line) || isCategoryHeader(line)) return false
  if (extractDetails(line).hasAny) return false

  const words = normalized.split(' ')
  if (words.length > 6) return false
  if (normalized.length < 3 || normalized.length > 40) return false

  return true
}

function isCategoryHeader(line) {
  const normalized = normalizeText(line)
  if (!normalized || extractDetails(line).hasAny) return false

  const words = normalized.split(' ')
  if (words.length > 4) return false

  return CATEGORY_HINTS.has(normalized) || (line === line.toUpperCase() && words.length <= 4)
}

function isIgnorableLine(line) {
  const normalized = normalizeText(line)
  if (!normalized) return true

  return (
    /^\d+$/.test(normalized) ||
    /\b(?:open|closed|hours|follow|instagram|facebook|phone|call|visit|order online|thank you)\b/iu.test(line) ||
    /https?:\/\//iu.test(line) ||
    /www\./iu.test(line) ||
    /^[@#]/u.test(line)
  )
}

function removeExtractedDetails(line, details) {
  let cleaned = line

  if (details.price != null) {
    cleaned = cleaned
      .replace(/\$\s?\d{1,3}(?:\.\d{1,2})?/gu, ' ')
      .replace(/\b\d{1,3}\.\d{1,2}\b/gu, ' ')
  }

  if (details.calories != null) {
    cleaned = cleaned
      .replace(/\b(?:calories?|kcal)\s*:?\s*\d{2,4}\b/giu, ' ')
      .replace(/\b\d{2,4}\s*(?:cal|cals|calories|kcal)\b/giu, ' ')
  }

  if (details.protein != null) {
    cleaned = cleaned
      .replace(/\bprotein\s*:?\s*\d{1,3}(?:\s*g)?\b/giu, ' ')
      .replace(/\b\d{1,3}\s*g(?:rams?)?\s*protein\b/giu, ' ')
  }

  if (details.fat != null) {
    cleaned = cleaned
      .replace(/\bfat\s*:?\s*\d{1,3}(?:\s*g)?\b/giu, ' ')
      .replace(/\b\d{1,3}\s*g(?:rams?)?\s*fat\b/giu, ' ')
  }

  return cleaned
}

function isValidItemName(name) {
  const normalized = normalizeText(name)
  if (!normalized) return false
  if (CATEGORY_HINTS.has(normalized)) return false
  if (normalized.length < 2 || normalized.length > 60) return false
  if (!/[a-z]/iu.test(normalized)) return false
  if (/\b(?:calories?|price)\b/iu.test(name)) return false

  const words = normalized.split(' ')
  return words.length <= 10
}

function dedupeItems(items) {
  const seen = new Set()

  return items.filter(item => {
    const key = [
      normalizeText(item.Restaurant),
      normalizeText(item.Category),
      normalizeText(item['Item Name']),
      item['Price ($)'],
      item.Calories,
      item['Protein (g)'],
      item['Fat (g)'],
    ].join('::')

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function cleanLine(line) {
  return line
    .replace(/[\u2022\u2023\u2043\u25E6\u2219]/gu, ' ')
    .replace(/\.{2,}/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function cleanupItemName(line) {
  return line
    .replace(/^[\d)\].-]+\s*/u, '')
    .replace(/[|]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim()
}

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(/\s+/u)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function readStorageArray(key) {
  if (typeof window === 'undefined') return []

  try {
    const value = localStorage.getItem(key)
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStorageArray(key, value) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}
