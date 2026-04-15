import { useEffect, useMemo, useState } from 'react'
import slugify from '../utils/slugify'

const PAGE_SIZE = 120

function parsePrice(value) {
  if (!value) return null
  const num = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(num) && num > 0 ? num : null
}

function MenufyItemCard({ item, theme }) {
  const isLight = theme === 'light'
  const price = parsePrice(item.price)
  const hasPrice = price !== null
  const imgUrl = item.item_image || ''
  const hasImage = typeof imgUrl === 'string' && imgUrl.startsWith('http')

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
          <span className={`text-[10px] uppercase tracking-wide ${isLight ? 'text-warmgray/70' : 'text-white/50'}`}>
            No nutrition data
          </span>
        </div>
      </div>
    </div>
  )
}

function CategorySection({ title, description, items, theme }) {
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
        {items.map((item, i) => (
          <MenufyItemCard key={`${item.name}-${i}`} item={item} theme={theme} />
        ))}
      </div>
    </div>
  )
}

export default function MenufyMenuSection({ theme, focusRestaurant }) {
  const [rows, setRows] = useState([])
  const [focusedRows, setFocusedRows] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  async function loadChunk({ append }) {
    const skip = append ? rows.length : 0
    const url = `/api/menufy/menu-items?limit=${PAGE_SIZE}&skip=${skip}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Menufy data request failed.')
    }
    const payload = await res.json()
    const nextItems = Array.isArray(payload?.items) ? payload.items : []
    setRows(prev => (append ? [...prev, ...nextItems] : nextItems))
    setHasMore(nextItems.length === PAGE_SIZE)
  }

  useEffect(() => {
    let isMounted = true

    async function loadMenufyData() {
      try {
        await loadChunk({ append: false })
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
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadFocusedRestaurant() {
      if (!focusRestaurant) {
        setFocusedRows([])
        return
      }

      try {
        const res = await fetch(`/api/menufy/menu-items?restaurant=${encodeURIComponent(focusRestaurant)}&limit=200`)
        if (!res.ok) {
          throw new Error('Focused Menufy restaurant request failed.')
        }
        const payload = await res.json()
        const nextItems = Array.isArray(payload?.items) ? payload.items : []
        if (isMounted) {
          setFocusedRows(nextItems)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              document.getElementById(`menufy-restaurant-${slugify(focusRestaurant)}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            })
          })
        }
      } catch {
        if (isMounted) {
          setFocusedRows([])
        }
      }
    }

    void loadFocusedRestaurant()

    return () => {
      isMounted = false
    }
  }, [focusRestaurant])

  async function handleLoadMore() {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    try {
      await loadChunk({ append: true })
    } catch (err) {
      setError(err?.message || 'Failed to load Menufy data.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const grouped = useMemo(() => {
    const byRestaurant = {}
    ;[...focusedRows, ...rows].forEach(row => {
      if (!row?.restaurant || !row?.category || !Array.isArray(row.items)) return
      if (!byRestaurant[row.restaurant]) byRestaurant[row.restaurant] = {}
      byRestaurant[row.restaurant][row.category] = {
        description: row.category_description || '',
        items: row.items,
      }
    })
    return byRestaurant
  }, [focusedRows, rows])

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

  const restaurants = Object.entries(grouped)

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
          <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${theme === 'light' ? 'border-black/10' : 'border-cream'}`}>
            <h3 className={`font-display text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {restaurant}
            </h3>
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
            />
          ))}
        </div>
      ))}

      <div className="mt-6 flex items-center justify-center">
        {hasMore ? (
          <button
            type="button"
            onClick={handleLoadMore}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              theme === 'light'
                ? 'bg-black text-white hover:bg-black/90'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {isLoadingMore ? 'Loading…' : 'Load more'}
          </button>
        ) : (
          <span className={`text-xs ${theme === 'light' ? 'text-warmgray' : 'text-white/60'}`}>
            All Menufy items loaded.
          </span>
        )}
      </div>
    </section>
  )
}
