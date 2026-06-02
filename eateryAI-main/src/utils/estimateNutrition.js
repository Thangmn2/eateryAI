function hasAny(text, terms) {
  return terms.some(term => text.includes(term))
}

export default function estimateNutrition(item = {}) {
  const text = [
    item.name,
    item['Item Name'],
    item.category,
    item.Category,
    item.description,
    item.Description,
    item.restaurant,
    item.Restaurant,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (hasAny(text, ['tea', 'coffee', 'latte', 'smoothie', 'juice', 'drink', 'lemonade', 'soda', 'matcha', 'boba'])) {
    return { calories: 220, protein: 4, fat: 5 }
  }

  if (hasAny(text, ['salad', 'greens', 'lettuce'])) {
    return { calories: 420, protein: 18, fat: 24 }
  }

  if (hasAny(text, ['fries', 'chips', 'tots', 'rings'])) {
    return { calories: 520, protein: 7, fat: 28 }
  }

  if (hasAny(text, ['dessert', 'cake', 'cookie', 'brownie', 'ice cream', 'sweet', 'churro'])) {
    return { calories: 480, protein: 6, fat: 22 }
  }

  if (hasAny(text, ['burger', 'sandwich', 'sub', 'melt', 'panini'])) {
    return { calories: 760, protein: 34, fat: 38 }
  }

  if (hasAny(text, ['taco', 'burrito', 'quesadilla', 'nacho'])) {
    return { calories: 680, protein: 30, fat: 30 }
  }

  if (hasAny(text, ['sushi', 'roll', 'poke'])) {
    return { calories: 520, protein: 24, fat: 14 }
  }

  if (hasAny(text, ['noodle', 'ramen', 'pho', 'pasta', 'udon', 'spaghetti'])) {
    return { calories: 720, protein: 28, fat: 24 }
  }

  if (hasAny(text, ['rice', 'bowl', 'plate', 'curry', 'teriyaki'])) {
    return { calories: 700, protein: 32, fat: 22 }
  }

  if (hasAny(text, ['chicken', 'beef', 'pork', 'steak', 'fish', 'shrimp', 'salmon', 'tofu'])) {
    return { calories: 620, protein: 36, fat: 26 }
  }

  if (hasAny(text, ['bao', 'bun', 'dumpling', 'gyoza', 'wonton', 'spring roll', 'egg roll'])) {
    return { calories: 430, protein: 16, fat: 18 }
  }

  return { calories: 550, protein: 22, fat: 20 }
}
