import { memo, useEffect, useMemo, useState } from 'react'
import slugify from '../utils/slugify'

const INITIAL_RESTAURANT_COUNT = 10
const LOAD_MORE_STEP = 5
const MAX_RESTAURANT_COUNT = 50
const DEFAULT_MENUFY_LOCATION = {
  latitude: 33.7419795,
  longitude: -117.8231586,
}

function parsePrice(value) {
  if (!value) return null
  const num = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(num) && num > 0 ? num : null
}

function toCartItemShape(item, price) {
  return {
    'Item Name': item.name || 'Untitled item',
    Restaurant: item.restaurant || 'Unknown restaurant',
    Category: item.category || 'Other',
    Source: 'Menufy',
    Description: item.description || '',
    Address: item.address || '',
    'Image URL': item.item_image || '',
    'Menu URL': item.menu_url || '',
    'Price ($)': price !== null ? String(price) : '',
    Calories: '',
    'Protein (g)': '',
    'Fat (g)': '',
    'Nutrition Estimated': true,
    'Cart Key': `menufy::${item.restaurant || 'unknown'}::${item.name || 'untitled'}`,
  }
}

const MenufyItemCard = memo(function MenufyItemCard({ item, theme, onAdd, inCartQty }) {
  const isLight = theme === 'light'
  const price = parsePrice(item.price)
  const hasPrice = price !== null
  const imgUrl = item.item_image || ''
  const hasImage = typeof imgUrl === 'string' && imgUrl.startsWith('http')
  const cartItem = toCartItemShape(item, price)

  return (
    <div
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
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center ${
              isLight
                ? 'bg-gradient-to-br from-cream via-ivory to-cream'
                : 'bg-gradient-to-br from-[#16181d] via-[#101216] to-[#181b20]'
            }`}
          >
            <span className="text-4xl mb-2 drop-shadow-sm">🍽</span>
            <p className={`px-3 text-center text-[11px] font-medium leading-tight ${isLight ? 'text-warmgray/60' : 'text-white/45'}`}>
              {item.name}
            </p>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className={`mb-1.5 line-clamp-2 text-sm font-semibold leading-snug ${isLight ? 'text-gray-900' : 'text-white'}`}>
          {item.name}
        </h3>
        {item.description ? (
          <p className={`mb-2 line-clamp-2 text-xs ${isLight ? 'text-warmgray-light' : 'text-white/60'}`}>
            {item.description}
          </p>
        ) : null}
        <div className="flex items-center justify-between">
          {hasPrice ? (
            <span className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>${price.toFixed(2)}</span>
          ) : (
            <span className={`text-xs italic ${isLight ? 'text-warmgray-light' : 'text-white/45'}`}>Price N/A</span>
          )}
          <div className="flex items-center gap-2">
            {inCartQty > 0 ? (
              <span className={`text-[10px] font-semibold ${isLight ? 'text-black/75' : 'text-white/70'}`}>
                In cart: {inCartQty}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onAdd?.(cartItem, 1)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                isLight
                  ? 'bg-black text-white hover:bg-black/85'
                  : 'bg-white text-black hover:bg-white/85'
              }`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

const CategorySection = memo(function CategorySection({ title, description, items, theme, onAdd, cartQtyMap }) {
  const isLight = theme === 'light'

  return (
    <div className="mb-8">
      <div className="mb-3">
        <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
          <span className={`w-6 h-px ${isLight ? 'bg-black/20' : 'bg-cream'}`} />
          {title}
        </h3>
        {description ? (
          <p className={`mt-1 text-xs ${isLight ? 'text-warmgray-light' : 'text-white/60'}`}>{description}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const cartKey = `menufy::${item.restaurant || 'unknown'}::${item.name || 'untitled'}`

          return (
            <MenufyItemCard
              key={`${item.name}-${i}`}
              item={item}
              theme={theme}
              onAdd={onAdd}
              inCartQty={cartQtyMap[cartKey] || 0}
            />
          )
        })}
      </div>
    </div>
  )
})

function collectRestaurantGallery(categories) {
  return Object.values(categories)
    .flatMap(payload => payload.items || [])
    .map(item => ({
      image: item.item_image || '',
      title: item.name || '',
      description: item.description || '',
      category: item.category || '',
    }))
    .filter(entry => entry.image.startsWith('http'))
    .filter((entry, index, array) => array.findIndex(other => other.image === entry.image) === index)
    .slice(0, 6)
}

function buildRestaurantHighlights(categories) {
  const categoryEntries = Object.entries(categories)
  const tags = categoryEntries
    .map(([category]) => category)
    .filter(Boolean)
    .slice(0, 4)

  const previewItem = categoryEntries
    .flatMap(([, payload]) => payload.items || [])
    .find(item => typeof item.description === 'string' && item.description.trim().length > 0)

  const fallbackNames = categoryEntries
    .flatMap(([, payload]) => payload.items || [])
    .slice(0, 3)
    .map(item => item.name)
    .filter(Boolean)

  return {
    tags,
    previewText: previewItem?.description?.trim()
      || (fallbackNames.length > 0 ? `Popular picks include ${fallbackNames.join(', ')}.` : 'Browse this restaurant’s Menufy menu.'),
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

function MenufyRestaurantCard({
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
  const itemCount = categoryEntries.reduce(
    (sum, [, payload]) => sum + (Array.isArray(payload.items) ? payload.items.length : 0),
    0
  )
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
              <h3 className={`font-display text-xl font-bold sm:text-2xl ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {restaurant}
              </h3>
              <p className={`mt-1 text-sm ${isLight ? 'text-warmgray-dark' : 'text-white/65'}`}>
                {itemCount} items across {categoryEntries.length} categories
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

export default function MenufyMenuSection({ theme, focusRestaurant, onAdd, cart = [], allowedRestaurantNames = [], onStatsChange }) {
  const [rows, setRows] = useState([])
  const [focusedRows, setFocusedRows] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loadedRestaurantCount, setLoadedRestaurantCount] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [origin, setOrigin] = useState(DEFAULT_MENUFY_LOCATION)
  const [expandedRestaurants, setExpandedRestaurants] = useState([])
  const [restaurantMetadata, setRestaurantMetadata] = useState({})
  const cartQtyMap = useMemo(() => {
    return cart.reduce((acc, entry) => {
      const key = entry?.item?.['Cart Key']
      if (key) {
        acc[key] = entry.qty || 0
      }
      return acc
    }, {})
  }, [cart])

  async function loadChunk({ append, limit }) {
    const skip = append ? loadedRestaurantCount : 0
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
      user_latitude: String(origin.latitude),
      user_longitude: String(origin.longitude),
    })
    allowedRestaurantNames.forEach(name => params.append('name', name))
    const url = `/api/menufy/menu-items?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Menufy data request failed.')
    }
    const payload = await res.json()
    const nextItems = Array.isArray(payload?.items) ? payload.items : []
    const returnedRestaurants = Number(payload?.returnedRestaurants) || 0
    setRows(prev => (append ? [...prev, ...nextItems] : nextItems))
    setLoadedRestaurantCount(prev => (append ? prev + returnedRestaurants : returnedRestaurants))
    setHasMore(Boolean(payload?.hasMore) && (append ? loadedRestaurantCount + returnedRestaurants : returnedRestaurants) < MAX_RESTAURANT_COUNT)
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      return undefined
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setOrigin({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    )

    return undefined
  }, [])

  useEffect(() => {
    if (focusRestaurant) {
      return undefined
    }

    let isMounted = true

    async function loadMenufyData() {
      try {
        setStatus('loading')
        setError('')
        setHasMore(false)
        setLoadedRestaurantCount(0)
        await loadChunk({ append: false, limit: INITIAL_RESTAURANT_COUNT })
        if (isMounted) {
          setStatus('ready')
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load Menufy data.')
          setStatus('error')
        }
      }
    }

    void loadMenufyData()

    return () => {
      isMounted = false
    }
  }, [allowedRestaurantNames, focusRestaurant, origin.latitude, origin.longitude])

  useEffect(() => {
    let isMounted = true

    async function loadFocusedRestaurant() {
      if (!focusRestaurant) {
        setFocusedRows([])
        return
      }

      try {
        const params = new URLSearchParams({
          restaurant: focusRestaurant,
          limit: '200',
        })
        const res = await fetch(`/api/menufy/menu-items?${params.toString()}`)
        if (!res.ok) {
          throw new Error('Focused Menufy restaurant request failed.')
        }
        const payload = await res.json()
        const nextItems = Array.isArray(payload?.items) ? payload.items : []
        if (isMounted) {
          setFocusedRows(nextItems)
          setStatus('ready')
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              document.getElementById(`menufy-restaurant-${slugify(focusRestaurant)}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            })
          })
        }
      } catch (err) {
        if (isMounted) {
          setError(current => current || err?.message || 'Focused Menufy restaurant request failed.')
        }
      }
    }

    void loadFocusedRestaurant()

    return () => {
      isMounted = false
    }
  }, [focusRestaurant])

  useEffect(() => {
    if (focusRestaurant) {
      setExpandedRestaurants(current => {
        const next = current.filter(name => name !== focusRestaurant)
        return [focusRestaurant, ...next]
      })
      return
    }

    setExpandedRestaurants([])
  }, [focusRestaurant])

  async function handleLoadMore() {
    try {
      setIsLoadingMore(true)
      await loadChunk({
        append: true,
        limit: Math.min(LOAD_MORE_STEP, MAX_RESTAURANT_COUNT - loadedRestaurantCount),
      })
    } catch (err) {
      setError(err?.message || 'Failed to load more Menufy restaurants.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const grouped = useMemo(() => {
    const byRestaurant = {}
    const sourceRows = [...focusedRows, ...rows]

    sourceRows.forEach(row => {
      if (!row?.restaurant || !row?.category || !Array.isArray(row.items)) return
      if (!byRestaurant[row.restaurant]) byRestaurant[row.restaurant] = {}
      if (byRestaurant[row.restaurant][row.category]) return

      byRestaurant[row.restaurant][row.category] = {
        description: row.category_description || '',
        items: row.items,
      }
    })
    return byRestaurant
  }, [focusedRows, rows])
  const restaurantNames = useMemo(() => {
    const names = Object.keys(grouped)
    if (!focusRestaurant) return names
    return names.sort((a, b) => {
      if (a === focusRestaurant) return -1
      if (b === focusRestaurant) return 1
      return a.localeCompare(b)
    })
  }, [focusRestaurant, grouped])

  useEffect(() => {
    let ignore = false

    async function loadMetadata() {
      try {
        const nextMetadata = await fetchRestaurantMetadata(restaurantNames)
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
  }, [restaurantNames])

  if (status === 'loading') {
    return (
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display text-2xl sm:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Menufy Menu
          </h2>
          <span className={`text-xs ${theme === 'light' ? 'text-warmgray' : 'text-white/60'}`}>Loading…</span>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display text-2xl sm:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Menufy Menu
          </h2>
        </div>
        <p className={`text-sm ${theme === 'light' ? 'text-warmgray' : 'text-white/60'}`}>
          Menufy menu data couldn’t be loaded: {error}
        </p>
      </section>
    )
  }

  const restaurants = useMemo(
    () => restaurantNames.map(name => [name, grouped[name]]),
    [grouped, restaurantNames]
  )

  const displayedStats = useMemo(() => {
    return restaurants.reduce(
      (acc, [, categories]) => {
        const itemCount = Object.values(categories).reduce(
          (sum, payload) => sum + (Array.isArray(payload.items) ? payload.items.length : 0),
          0
        )

        return {
          restaurants: acc.restaurants + 1,
          items: acc.items + itemCount,
        }
      },
      { restaurants: 0, items: 0 }
    )
  }, [restaurants])

  useEffect(() => {
    onStatsChange?.(displayedStats)
  }, [displayedStats, onStatsChange])

  useEffect(() => {
    return () => {
      onStatsChange?.({ restaurants: 0, items: 0 })
    }
  }, [onStatsChange])

  if (restaurants.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className={`font-display text-2xl sm:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          Menufy Menu
        </h2>
        <p className={`text-sm ${theme === 'light' ? 'text-warmgray' : 'text-white/60'}`}>
          Items sourced from Menufy with no nutrition data. Displayed separately from the main menu.
        </p>
      </div>

      {restaurants.map(([restaurant, categories]) => (
        <div key={restaurant} id={`menufy-restaurant-${slugify(restaurant)}`} className="mb-12 scroll-mt-24">
          <MenufyRestaurantCard
            restaurant={restaurant}
            categories={categories}
            metadata={restaurantMetadata[restaurant]}
            expanded={expandedRestaurants.includes(restaurant)}
            onToggle={() => {
              setExpandedRestaurants(current => (
                current.includes(restaurant)
                  ? current.filter(name => name !== restaurant)
                  : [...current, restaurant]
              ))
            }}
            theme={theme}
          >
            <div className="mb-4">
              <span className={`text-xs ${theme === 'light' ? 'text-warmgray-light' : 'text-white/60'}`}>
                No nutrition data
              </span>
            </div>

            {Object.entries(categories).map(([category, payload]) => (
              <CategorySection
                key={`${restaurant}-${category}`}
                title={category}
                description={payload.description}
                items={payload.items}
                theme={theme}
                onAdd={onAdd}
                cartQtyMap={cartQtyMap}
              />
            ))}
          </MenufyRestaurantCard>
        </div>
      ))}

      {!focusRestaurant && (
        <div className="mt-6 flex min-h-12 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`text-xs ${theme === 'light' ? 'text-warmgray' : 'text-white/60'}`}>
              Showing {loadedRestaurantCount} nearby Menufy restaurants. Search or pick a restaurant to jump to a specific one.
            </span>
            {hasMore && loadedRestaurantCount < MAX_RESTAURANT_COUNT ? (
              <button
                type="button"
                onClick={() => void handleLoadMore()}
                disabled={isLoadingMore}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  theme === 'light'
                    ? 'bg-black text-white hover:bg-black/85 disabled:bg-black/40'
                    : 'bg-white text-black hover:bg-white/85 disabled:bg-white/40'
                }`}
              >
                {isLoadingMore ? 'Loading…' : `Show ${Math.min(LOAD_MORE_STEP, MAX_RESTAURANT_COUNT - loadedRestaurantCount)} more`}
              </button>
            ) : loadedRestaurantCount >= MAX_RESTAURANT_COUNT ? (
              <span className={`text-[11px] ${theme === 'light' ? 'text-warmgray-light' : 'text-white/45'}`}>
                Capped at the nearest {MAX_RESTAURANT_COUNT} restaurants.
              </span>
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}
