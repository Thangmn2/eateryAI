import { memo, useEffect, useMemo, useState } from 'react'
import slugify from '../utils/slugify'
import estimateNutrition from '../utils/estimateNutrition'

const INITIAL_RESTAURANT_COUNT = 10
const LOAD_MORE_STEP = 10
const MAX_RESTAURANT_COUNT = 50
const DEFAULT_MENUFY_LOCATION = {
  latitude: 33.6461,
  longitude: -117.8425,
}
const PRELOAD_IMAGE_LIMIT = 80

function parsePrice(value) {
  if (!value) return null
  const num = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(num) && num > 0 ? num : null
}

function toCartItemShape(item, price) {
  const nutrition = estimateNutrition(item)

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
    Calories: nutrition.calories,
    'Protein (g)': nutrition.protein,
    'Fat (g)': nutrition.fat,
    'Nutrition Estimated': true,
    'Cart Key': `menufy::${item.restaurant || 'unknown'}::${item.name || 'untitled'}`,
  }
}

const MenufyItemCard = memo(function MenufyItemCard({ item, theme, onItemClick, inCartQty }) {
  const isLight = theme === 'light'
  const price = parsePrice(item.price)
  const hasPrice = price !== null
  const imgUrl = item.item_image || ''
  const hasImage = typeof imgUrl === 'string' && (imgUrl.startsWith('http') || imgUrl.startsWith('/'))
  const cartItem = toCartItemShape(item, price)

  return (
    <div
      onClick={() => onItemClick?.(cartItem)}
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
          </div>
        </div>
      </div>
    </div>
  )
})

const CategorySection = memo(function CategorySection({ title, description, items, theme, onItemClick, cartQtyMap }) {
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
              onItemClick={onItemClick}
              inCartQty={cartQtyMap[cartKey] || 0}
            />
          )
        })}
      </div>
    </div>
  )
})

function MenufyRestaurantCard({
  restaurant,
  categories,
  address,
  expanded,
  onToggle,
  theme,
  children,
}) {
  const isLight = theme === 'light'

  return (
    <div className={`mb-3 overflow-hidden rounded-[28px] border ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0f1115]'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-5 text-left sm:px-6"
      >
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className={`font-display text-2xl font-bold leading-tight sm:text-3xl ${isLight ? 'text-gray-900' : 'text-white'}`}>
              {restaurant}
            </h3>
            {address ? (
              <p className={`mt-1 text-sm leading-snug ${isLight ? 'text-warmgray-dark' : 'text-white/60'}`}>
                {address}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className={`text-lg transition-transform ${expanded ? 'rotate-180' : ''} ${isLight ? 'text-gray-900' : 'text-white'}`}>
              ⌄
            </span>
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

export default function MenufyMenuSection({
  theme,
  focusRestaurant,
  onItemClick,
  cart = [],
  allowedRestaurantNames = [],
  onStatsChange,
  summaryText = '',
  showMap = true,
  onToggleMap,
}) {
  const [rows, setRows] = useState([])
  const [focusedRows, setFocusedRows] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loadedRestaurantCount, setLoadedRestaurantCount] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [origin, setOrigin] = useState(DEFAULT_MENUFY_LOCATION)
  const [expandedRestaurants, setExpandedRestaurants] = useState([])
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

  const restaurants = useMemo(
    () => restaurantNames.map(name => [name, grouped[name]]),
    [grouped, restaurantNames]
  )
  const menuImageUrls = useMemo(() => {
    const urls = restaurants.flatMap(([, categories]) => (
      Object.values(categories).flatMap(payload => (
        (payload.items || [])
          .map(item => item?.item_image)
          .filter(url => typeof url === 'string' && (url.startsWith('http') || url.startsWith('/')))
      ))
    ))

    return [...new Set(urls)].slice(0, PRELOAD_IMAGE_LIMIT)
  }, [restaurants])

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

    return () => {
      onStatsChange?.({ restaurants: 0, items: 0 })
    }
  }, [displayedStats, onStatsChange])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const preloadedImages = menuImageUrls.map(url => {
      const img = new window.Image()
      img.decoding = 'async'
      img.src = url
      return img
    })

    return () => {
      preloadedImages.forEach(img => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [menuImageUrls])

  if (status === 'loading') {
    return (
      <section className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display text-2xl sm:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Restaurants in the Area
          </h2>
          <span className={`text-xs ${theme === 'light' ? 'text-warmgray' : 'text-white/60'}`}>Loading…</span>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display text-2xl sm:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Restaurants in the Area
          </h2>
        </div>
        <p className={`text-sm ${theme === 'light' ? 'text-warmgray' : 'text-white/60'}`}>
          Menufy menu data couldn’t be loaded: {error}
        </p>
      </section>
    )
  }

  if (restaurants.length === 0) {
    return null
  }

  return (
    <section className="mt-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className={`font-display text-2xl sm:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          Restaurants in the Area
        </h2>
        {onToggleMap ? (
          <button
            type="button"
            onClick={onToggleMap}
            className={`h-8 w-20 shrink-0 rounded-full text-xs font-semibold transition ${
              theme === 'light'
                ? 'bg-black text-white hover:bg-black/85'
                : 'bg-white text-black hover:bg-white/85'
            }`}
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        ) : null}
      </div>

      {restaurants.map(([restaurant, categories]) => (
        <div key={restaurant} id={`menufy-restaurant-${slugify(restaurant)}`} className="mb-5 scroll-mt-24">
          <MenufyRestaurantCard
            restaurant={restaurant}
            categories={categories}
            address={
              Object.values(categories)
                .flatMap(payload => payload.items || [])
                .find(item => item?.address)?.address || ''
            }
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
            {Object.entries(categories).map(([category, payload]) => (
              <CategorySection
                key={`${restaurant}-${category}`}
                title={category}
                description={payload.description}
                items={payload.items}
                theme={theme}
                onItemClick={onItemClick}
                cartQtyMap={cartQtyMap}
              />
            ))}
          </MenufyRestaurantCard>
        </div>
      ))}

      {!focusRestaurant && (
        <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className={`text-sm ${theme === 'light' ? 'text-warmgray-dark' : 'text-white/70'}`}>
              {summaryText}
            </p>
            <p className={`mt-1 text-xs font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white/45'}`}>
              © Eatery 2026
            </p>
          </div>

          <div className="flex justify-start sm:justify-center">
            {hasMore && loadedRestaurantCount < MAX_RESTAURANT_COUNT ? (
              <button
                type="button"
                onClick={() => void handleLoadMore()}
                disabled={isLoadingMore}
                className={`inline-flex min-w-32 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed ${
                  theme === 'light'
                    ? 'border-black/10 bg-black text-white hover:bg-black/85 disabled:bg-black/40'
                    : 'border-white/12 bg-white/10 text-white hover:border-white/25 hover:bg-white/15 disabled:border-white/8 disabled:bg-white/5 disabled:text-white/40'
                }`}
              >
                {isLoadingMore ? 'Loading…' : 'Show more'}
              </button>
            ) : loadedRestaurantCount >= MAX_RESTAURANT_COUNT ? (
              <span className={`text-[11px] ${theme === 'light' ? 'text-warmgray-light' : 'text-white/45'}`}>
                Capped at the nearest {MAX_RESTAURANT_COUNT} restaurants.
              </span>
            ) : null}
          </div>

          <div className="flex justify-start sm:justify-end">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`inline-flex min-w-32 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                theme === 'light'
                  ? 'border-black/10 bg-black text-white hover:bg-black/85'
                  : 'border-white/12 bg-white/10 text-white hover:border-white/25 hover:bg-white/15'
              }`}
            >
              Return to top
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
