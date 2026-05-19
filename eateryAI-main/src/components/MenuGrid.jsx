import { useEffect, useMemo, useState } from 'react'
import slugify from '../utils/slugify'

const RESTAURANT_BATCH_SIZE = 10

function ItemCard({ item, onClick, inCart, theme }) {
  const isLight = theme === 'light'
  const price = parseFloat(item['Price ($)'])
  const hasPrice = price && price > 0
  const calories = parseFloat(item.Calories)
  const protein = parseFloat(item['Protein (g)'])
  const imgUrl = item['Image URL'] || ''
  const hasImage = imgUrl.startsWith('http') && !imgUrl.includes('Logo.png')

  function getEmoji() {
    const cat = (item.Category || '').toLowerCase()
    const name = (item['Item Name'] || '').toLowerCase()
    if (cat.includes('drink') || cat.includes('tea') || cat.includes('coffee') || name.includes('coffee') || name.includes('tea')) return '🍵'
    if (cat.includes('dessert') || cat.includes('sweet') || name.includes('bao')) return '🍡'
    if (cat.includes('roll') || cat.includes('sushi') || name.includes('roll') || name.includes('sushi')) return '🍣'
    if (name.includes('tempura')) return '🍤'
    if (name.includes('udon') || name.includes('noodle')) return '🍜'
    if (name.includes('bowl') || name.includes('rice')) return '🍚'
    if (name.includes('salad')) return '🥗'
    if (name.includes('fries')) return '🍟'
    if (name.includes('egg roll') || name.includes('spring roll')) return '🥟'
    if (name.includes('burger') || name.includes('slider')) return '🍔'
    if (name.includes('wing')) return '🍗'
    if (cat.includes('taco') || name.includes('taco')) return '🌮'
    if (cat.includes('classic') || cat.includes('appetizer') || cat.includes('starter')) return '🍽'
    return '🍽'
  }

  return (
    <div
      onClick={() => onClick(item)}
      className={`menu-card group relative border ${
        isLight
          ? 'border-black/10 bg-white'
          : 'border-white/10 bg-[#111317]'
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        {hasImage ? (
          <img
            src={imgUrl}
            alt={item['Item Name']}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div
          className={`w-full h-full flex flex-col items-center justify-center ${
            isLight
              ? 'bg-gradient-to-br from-cream via-ivory to-cream'
              : 'bg-gradient-to-br from-[#16181d] via-[#101216] to-[#181b20]'
          } ${hasImage ? 'hidden' : 'flex'}`}
          style={hasImage ? { display: 'none' } : {}}
        >
          <span className="text-5xl mb-2 drop-shadow-sm">{getEmoji()}</span>
          <p className={`px-3 text-center text-[11px] font-medium leading-tight ${isLight ? 'text-warmgray/60' : 'text-white/45'}`}>
            {item['Item Name']}
          </p>
        </div>

        <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm ${
          isLight
            ? 'bg-white/90 text-warmgray'
            : 'bg-black/55 text-white/75'
        }`}>
          {item.Source}
        </span>

        {inCart && (
          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-terra text-white text-xs font-bold flex items-center justify-center shadow-sm">
            {inCart}
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className={`mb-1.5 line-clamp-2 text-sm font-semibold leading-snug ${isLight ? 'text-gray-900' : 'text-white'}`}>
          {item['Item Name']}
        </h3>
        <div className="flex items-center justify-between">
          {hasPrice ? (
            <span className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>${price.toFixed(2)}</span>
          ) : (
            <span className={`text-xs italic ${isLight ? 'text-warmgray-light' : 'text-white/45'}`}>Price N/A</span>
          )}
          <div className={`flex items-center gap-2 text-[11px] ${isLight ? 'text-black' : 'text-white/80'}`}>
            {item['Nutrition Estimated'] && (
              <span className="text-amber-500" title="Estimated">~</span>
            )}
            {calories > 0 && (
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                {Math.round(calories)} cal
              </span>
            )}
            {protein > 0 && (
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
                {Math.round(protein)}g
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CategorySection({ title, items, onItemClick, cart, theme }) {
  const isLight = theme === 'light'

  return (
    <div className="mb-8">
      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
        <span className={`w-6 h-px ${isLight ? 'bg-black/20' : 'bg-cream'}`} />
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const cartEntry = cart.find(e =>
            e.item.Restaurant === item.Restaurant && e.item['Item Name'] === item['Item Name']
          )
          return (
            <ItemCard
              key={`${item['Item Name']}-${i}`}
              item={item}
              onClick={onItemClick}
              inCart={cartEntry?.qty}
              theme={theme}
            />
          )
        })}
      </div>
    </div>
  )
}

function collectRestaurantGallery(categories) {
  return Object.values(categories)
    .flatMap(items => items)
    .map(item => ({
      image: item['Image URL'] || '',
      title: item['Item Name'] || '',
      description: item.Description || '',
      category: item.Category || '',
    }))
    .filter(entry => entry.image.startsWith('http') && !entry.image.includes('Logo.png'))
    .filter((entry, index, array) => array.findIndex(other => other.image === entry.image) === index)
    .slice(0, 6)
}

function buildRestaurantHighlights(categories) {
  const categoryEntries = Object.entries(categories)
  const tagCandidates = categoryEntries
    .map(([category]) => category)
    .filter(Boolean)
    .slice(0, 4)

  const firstDescribedItem = categoryEntries
    .flatMap(([, items]) => items)
    .find(item => typeof item.Description === 'string' && item.Description.trim().length > 0)

  const fallbackNames = categoryEntries
    .flatMap(([, items]) => items)
    .slice(0, 3)
    .map(item => item['Item Name'])
    .filter(Boolean)

  const previewText = firstDescribedItem?.Description?.trim()
    || (fallbackNames.length > 0 ? `Popular picks include ${fallbackNames.join(', ')}.` : 'Browse this restaurant’s menu and top categories.')

  return {
    tags: tagCandidates,
    previewText,
  }
}

async function fetchRestaurantMetadata(names) {
  if (!Array.isArray(names) || names.length === 0) {
    return {}
  }

  const params = new URLSearchParams()
  names.forEach(name => params.append('name', name))
  const response = await fetch(`/api/restaurants/meta?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Restaurant metadata request failed.')
  }

  const payload = await response.json()
  const rows = Array.isArray(payload?.restaurants) ? payload.restaurants : []
  return rows.reduce((acc, row) => {
    if (row?.restaurant_name) {
      acc[row.restaurant_name] = row
    }
    return acc
  }, {})
}

function RestaurantSummaryCard({
  restaurant,
  categories,
  metadata,
  expanded,
  onToggle,
  theme,
  children,
}) {
  const isLight = theme === 'light'
  const categoryEntries = Object.entries(categories)
  const itemCount = categoryEntries.reduce((sum, [, items]) => sum + items.length, 0)
  const categoryCount = categoryEntries.length
  const gallery = useMemo(() => collectRestaurantGallery(categories), [categories])
  const { tags, previewText } = useMemo(() => {
    const fallback = buildRestaurantHighlights(categories)
    const mongoTags = [...(metadata?.cuisine_tags || []), ...(metadata?.attribute_tags || [])]
      .filter(Boolean)
      .slice(0, 5)

    return {
      tags: mongoTags.length > 0 ? mongoTags : fallback.tags,
      previewText: metadata?.description?.trim() || fallback.previewText,
    }
  }, [categories, metadata])
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const activePhoto = gallery[activePhotoIndex] || null

  useEffect(() => {
    setActivePhotoIndex(0)
  }, [restaurant])

  return (
    <div className={`mb-6 overflow-hidden rounded-[28px] border ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0f1115]'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-5 text-left sm:px-6"
      >
        <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)] md:items-start">
          <div className={`relative overflow-hidden rounded-[24px] ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
            <div className="aspect-[4/3]">
              {activePhoto ? (
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title || restaurant}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${isLight ? 'bg-gradient-to-br from-[#f0e6d8] to-[#f7f1e8]' : 'bg-gradient-to-br from-[#16181d] to-[#0d0f13]'}`}>
                  <span className="text-6xl">🍽</span>
                </div>
              )}
            </div>

            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation()
                    setActivePhotoIndex(current => (current - 1 + gallery.length) % gallery.length)
                  }}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl text-white backdrop-blur"
                  aria-label={`Previous photo for ${restaurant}`}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation()
                    setActivePhotoIndex(current => (current + 1) % gallery.length)
                  }}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl text-white backdrop-blur"
                  aria-label={`Next photo for ${restaurant}`}
                >
                  ›
                </button>
              </>
            ) : null}
          </div>

          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className={`font-display text-xl font-bold sm:text-2xl ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {restaurant}
              </h2>
              <p className={`mt-1 text-sm ${isLight ? 'text-warmgray-dark' : 'text-white/65'}`}>
                {itemCount} items across {categoryCount} categories
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={`${restaurant}-${tag}`}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${isLight ? 'border-black/10 bg-black/[0.03] text-warmgray-dark' : 'border-white/12 bg-white/[0.04] text-white/75'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className={`mt-4 max-w-2xl text-sm leading-7 ${isLight ? 'text-warmgray-dark' : 'text-white/72'}`}>
                {previewText}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${isLight ? 'bg-black/5 text-warmgray-dark' : 'bg-white/10 text-white/70'}`}>
                {expanded ? 'Hide menu' : 'View menu'}
              </span>
              <span className={`text-lg transition-transform ${expanded ? 'rotate-180' : ''} ${isLight ? 'text-gray-900' : 'text-white'}`}>
                ⌄
              </span>
            </div>
          </div>
        </div>
      </button>

      {expanded ? (
        <div className={`border-t px-5 pb-5 pt-4 sm:px-6 sm:pb-6 ${isLight ? 'border-black/10' : 'border-white/10'}`}>
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default function MenuGrid({
  groupedItems,
  onItemClick,
  cart,
  theme,
  afterRestaurantName,
  afterRestaurantContent,
  selectedRestaurant,
  focusRestaurant,
}) {
  const isLight = theme === 'light'
  const [visibleRestaurantCount, setVisibleRestaurantCount] = useState(RESTAURANT_BATCH_SIZE)
  const [expandedRestaurants, setExpandedRestaurants] = useState([])
  const [restaurantMetadata, setRestaurantMetadata] = useState({})
  const restaurants = groupedItems.type === 'byRestaurant'
    ? Object.entries(groupedItems.data)
    : []
  const visibleRestaurants = restaurants.slice(0, visibleRestaurantCount)
  const expandedRestaurantSet = useMemo(
    () => new Set(expandedRestaurants),
    [expandedRestaurants]
  )

  useEffect(() => {
    setVisibleRestaurantCount(RESTAURANT_BATCH_SIZE)
  }, [groupedItems, selectedRestaurant])

  useEffect(() => {
    if (groupedItems.type !== 'byRestaurant') {
      setExpandedRestaurants([])
      return
    }

    if (focusRestaurant) {
      setExpandedRestaurants([focusRestaurant])
      return
    }

    if (selectedRestaurant && selectedRestaurant !== 'All') {
      setExpandedRestaurants([selectedRestaurant])
      return
    }

    setExpandedRestaurants([])
  }, [focusRestaurant, groupedItems.type, selectedRestaurant])

  useEffect(() => {
    if (groupedItems.type !== 'byRestaurant') {
      setRestaurantMetadata({})
      return
    }

    let ignore = false
    const names = visibleRestaurants.map(([restaurant]) => restaurant)

    async function loadMetadata() {
      try {
        const nextMetadata = await fetchRestaurantMetadata(names)
        if (!ignore) {
          setRestaurantMetadata(nextMetadata)
        }
      } catch {
        if (!ignore) {
          setRestaurantMetadata({})
        }
      }
    }

    void loadMetadata()

    return () => {
      ignore = true
    }
  }, [groupedItems.type, visibleRestaurants])

  function toggleRestaurant(restaurant) {
    setExpandedRestaurants(current => (
      current.includes(restaurant)
        ? current.filter(name => name !== restaurant)
        : [...current, restaurant]
    ))
  }

  if (groupedItems.type === 'byRestaurant') {
    return (
      <div>
        {visibleRestaurants.map(([restaurant, categories]) => (
          <div
            key={restaurant}
            id={`restaurant-${slugify(restaurant)}`}
            className="mb-10 scroll-mt-24"
          >
            <RestaurantSummaryCard
              restaurant={restaurant}
              categories={categories}
              metadata={restaurantMetadata[restaurant]}
              expanded={expandedRestaurantSet.has(restaurant)}
              onToggle={() => toggleRestaurant(restaurant)}
              theme={theme}
            >
              {Object.entries(categories).map(([category, items]) => (
                <CategorySection
                  key={category}
                  title={category}
                  items={items}
                  onItemClick={onItemClick}
                  cart={cart}
                  theme={theme}
                />
              ))}

              {restaurant === afterRestaurantName ? afterRestaurantContent : null}
            </RestaurantSummaryCard>
          </div>
        ))}
      </div>
    )
  }

  const categories = Object.entries(groupedItems.data)
  return (
    <div id={selectedRestaurant ? `restaurant-${slugify(selectedRestaurant)}` : undefined} className="scroll-mt-24">
      {categories.map(([category, items]) => (
        <CategorySection
          key={category}
          title={category}
          items={items}
          onItemClick={onItemClick}
          cart={cart}
          theme={theme}
        />
      ))}
    </div>
  )
}
