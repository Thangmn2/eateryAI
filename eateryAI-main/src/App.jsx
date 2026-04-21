import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import menuJson from './data/menuData.json'
import chipotleBuilderFallback from './data/chipotleBuilderData.json'
import GoalTracker from './components/GoalTracker'
import ChipotleBuilder from './components/ChipotleBuilder'
import RestaurantFilter from './components/RestaurantFilter'
import MenuGrid from './components/MenuGrid'
import ItemModal from './components/ItemModal'
import CartPanel from './components/CartPanel'
import CameraScanner from './components/CameraScanner'
import PhotoGallery from './components/PhotoGallery'
import RestaurantMap from './components/RestaurantMap'
import MenufyMenuSection from './components/MenufyMenuSection'
import LazyRender from './components/LazyRender'
import { loadScannedMenuItems, loadScannedPhotos } from './utils/scannedMenus'
import slugify from './utils/slugify'

const confirmedItems = menuJson.menuItems.filter(i => !i['Nutrition Estimated'])
const unconfirmedItems = menuJson.menuItems.filter(i => i['Nutrition Estimated'])

function getCartKey(item) {
  return item['Cart Key'] || `${item.Restaurant}::${item['Item Name']}`
}

function loadInitialTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  return window.localStorage.getItem('eatery-theme') === 'light' ? 'light' : 'dark'
}

export default function App() {
  const [view, setView] = useState('map')
  const [selectedRestaurant, setSelectedRestaurant] = useState('All')
  const [focusedMenufyRestaurant, setFocusedMenufyRestaurant] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [goals, setGoals] = useState({ price: 30, calories: 2000, protein: 150 })
  const [showCamera, setShowCamera] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryScanCount, setGalleryScanCount] = useState(() => loadScannedPhotos().length)
  const [scannedMenuItems, setScannedMenuItems] = useState(() => loadScannedMenuItems())
  const [chipotleBuilderData, setChipotleBuilderData] = useState(chipotleBuilderFallback)
  const [chipotleBuilderLoading, setChipotleBuilderLoading] = useState(true)
  const [theme, setTheme] = useState(loadInitialTheme)

  const isLight = theme === 'light'

  const restaurants = useMemo(() => {
    return [...new Set([...menuJson.menuItems.map(item => item.Restaurant), ...scannedMenuItems.map(item => item.Restaurant)])].sort()
  }, [scannedMenuItems])

  const restaurantCounts = useMemo(() => {
    return [...confirmedItems, ...unconfirmedItems, ...scannedMenuItems].reduce((counts, item) => {
      counts[item.Restaurant] = (counts[item.Restaurant] || 0) + 1
      return counts
    }, {})
  }, [scannedMenuItems])

  const filteredConfirmed = useMemo(() => {
    return selectedRestaurant === 'All'
      ? confirmedItems
      : confirmedItems.filter(i => i.Restaurant === selectedRestaurant)
  }, [selectedRestaurant])

  const filteredScannedItems = useMemo(() => {
    return selectedRestaurant === 'All'
      ? scannedMenuItems
      : scannedMenuItems.filter(item => item.Restaurant === selectedRestaurant)
  }, [scannedMenuItems, selectedRestaurant])

  const filteredUnconfirmed = useMemo(() => {
    const baseUnconfirmed = selectedRestaurant === 'All'
      ? unconfirmedItems
      : unconfirmedItems.filter(i => i.Restaurant === selectedRestaurant)

    return [...filteredScannedItems, ...baseUnconfirmed]
  }, [filteredScannedItems, selectedRestaurant])

  function groupItems(items) {
    if (selectedRestaurant === 'All') {
      const byRestaurant = {}
      items.forEach(item => {
        const r = item.Restaurant
        if (!byRestaurant[r]) byRestaurant[r] = {}
        const cat = item.Category || 'Other'
        if (!byRestaurant[r][cat]) byRestaurant[r][cat] = []
        byRestaurant[r][cat].push(item)
      })
      return { type: 'byRestaurant', data: byRestaurant }
    } else {
      const groups = {}
      items.forEach(item => {
        const cat = item.Category || 'Other'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(item)
      })
      return { type: 'byCategory', data: groups }
    }
  }

  const groupedConfirmed = useMemo(() => groupItems(filteredConfirmed), [filteredConfirmed, selectedRestaurant])
  const groupedUnconfirmed = useMemo(() => groupItems(filteredUnconfirmed), [filteredUnconfirmed, selectedRestaurant])
  const hasScannedUnconfirmed = filteredScannedItems.length > 0
  const totalItemCount = menuJson.menuItems.length + scannedMenuItems.length

  const cartTotals = useMemo(() => {
    return cart.reduce(
      (acc, entry) => ({
        price: acc.price + (parseFloat(entry.item['Price ($)']) || 0) * entry.qty,
        calories: acc.calories + (parseFloat(entry.item.Calories) || 0) * entry.qty,
        protein: acc.protein + (parseFloat(entry.item['Protein (g)']) || 0) * entry.qty,
      }),
      { price: 0, calories: 0, protein: 0 }
    )
  }, [cart])

  function addToCart(item, qty = 1) {
    setCart(prev => {
      const key = getCartKey(item)
      const idx = prev.findIndex(entry => getCartKey(entry.item) === key)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty }
        return updated
      }
      return [...prev, { item, qty }]
    })
    setSelectedItem(null)
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  function updateCartQty(index, delta) {
    setCart(prev => {
      const updated = [...prev]
      const newQty = updated[index].qty + delta
      if (newQty <= 0) return prev.filter((_, i) => i !== index)
      updated[index] = { ...updated[index], qty: newQty }
      return updated
    })
  }

  function refreshScannedContent() {
    setGalleryScanCount(loadScannedPhotos().length)
    setScannedMenuItems(loadScannedMenuItems())
  }

  function handleRestaurantSelect(name) {
    setFocusedMenufyRestaurant(name)
    setSelectedRestaurant(restaurants.includes(name) ? name : 'All')
    setView('menu')
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  useEffect(() => {
    if (selectedRestaurant !== 'All' && !restaurants.includes(selectedRestaurant)) {
      setSelectedRestaurant('All')
    }
  }, [restaurants, selectedRestaurant])

  useEffect(() => {
    let ignore = false

    async function loadChipotleBuilder() {
      try {
        const response = await fetch('/api/chipotle-builder')
        const payload = await response.json().catch(() => ({}))

        if (!response.ok || !payload?.data || ignore) {
          return
        }

        setChipotleBuilderData(payload.data)
      } catch {
        // Keep the bundled fallback snapshot when the server route is unavailable.
      } finally {
        if (!ignore) {
          setChipotleBuilderLoading(false)
        }
      }
    }

    void loadChipotleBuilder()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('eatery-theme', theme)
    document.body.style.backgroundColor = isLight ? '#f6f1e8' : '#000000'
    document.body.style.color = isLight ? '#111827' : '#ffffff'
    document.documentElement.style.colorScheme = isLight ? 'light' : 'dark'
  }, [isLight, theme])

  useEffect(() => {
    function syncRestaurantFromHash() {
      const hash = window.location.hash
      if (hash.startsWith('#menufy-restaurant-')) {
        const id = hash.replace('#', '')
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        return
      }
      if (!hash.startsWith('#restaurant-')) return

      const slug = hash.replace('#restaurant-', '')
      const matchedRestaurant = restaurants.find(
        name => slugify(name) === slug
      )

      if (matchedRestaurant) {
        setSelectedRestaurant(matchedRestaurant)
        setFocusedMenufyRestaurant('')
        setView('menu')

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const el = document.getElementById(`restaurant-${slug}`)
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          })
        })
      }
    }

    syncRestaurantFromHash()
    window.addEventListener('hashchange', syncRestaurantFromHash)

    return () => {
      window.removeEventListener('hashchange', syncRestaurantFromHash)
    }
  }, [restaurants])

  return (
    <div
      className={`grain ${
        view === 'map' ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'
      } ${isLight ? 'theme-light bg-[#f6f1e8]' : 'theme-dark bg-black'}`}
    >
      {view === 'map' ? (
        <main className={`h-[100dvh] overflow-hidden ${isLight ? 'bg-[#f6f1e8]' : 'bg-black'}`}>
          <RestaurantMap
            theme={theme}
            onRestaurantClick={handleRestaurantSelect}
            onOpenMenu={() => setView('menu')}
          />
        </main>
      ) : (
        <>
          <GoalTracker
            goals={goals}
            totals={cartTotals}
            onGoalsChange={setGoals}
            cartCount={cart.reduce((s, e) => s + e.qty, 0)}
            onCartClick={() => setShowCart(true)}
            onOpenCamera={() => setShowCamera(true)}
            onOpenGallery={() => setShowGallery(true)}
            galleryScanCount={galleryScanCount}
            theme={theme}
            onThemeToggle={() => setTheme(current => current === 'light' ? 'dark' : 'light')}
          />

          <main className={`max-w-7xl mx-auto px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6 pb-24 ${isLight ? 'bg-[#f6f1e8]' : 'bg-black'}`}>
            <div className={`sticky top-[72px] z-30 -mx-4 mb-6 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${
              isLight ? 'bg-[#f6f1e8]/92 border-b border-black/10' : 'bg-black border-b border-white/10'
            }`}>
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isLight
                      ? 'bg-black text-white hover:bg-black/85'
                      : 'bg-white text-black hover:bg-white/85'
                  }`}
                >
                  Back to map
                </button>
              </div>

              <RestaurantFilter
                restaurants={restaurants}
                selected={selectedRestaurant}
                onSelect={value => {
                  setSelectedRestaurant(value)
                  setFocusedMenufyRestaurant('')
                }}
                counts={restaurantCounts}
                theme={theme}
              />
            </div>

            <div className="min-w-0">
              <p className={`mb-6 -mt-2 text-sm ${isLight ? 'text-warmgray-dark' : 'text-white/80'}`}>
                {totalItemCount} items across {restaurants.length} restaurants
              </p>

              <MenuGrid
                groupedItems={groupedConfirmed}
                onItemClick={setSelectedItem}
                cart={cart}
                theme={theme}
                selectedRestaurant={selectedRestaurant}
                afterRestaurantName={selectedRestaurant === 'All' ? 'J Sushi Orange' : undefined}
                afterRestaurantContent={selectedRestaurant === 'All' ? (
                  <ChipotleBuilder
                    data={chipotleBuilderData}
                    onAdd={addToCart}
                    isLoading={chipotleBuilderLoading}
                    theme={theme}
                  />
                ) : null}
              />

              {focusedMenufyRestaurant ? (
                <MenufyMenuSection theme={theme} focusRestaurant={focusedMenufyRestaurant} />
              ) : (
                <LazyRender
                  rootMargin="300px"
                  minHeight="320px"
                  placeholder={(
                    <section className="mt-12">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className={`font-display text-2xl sm:text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                          Menufy Menu
                        </h2>
                        <span className={`text-xs ${isLight ? 'text-warmgray' : 'text-white/60'}`}>Load on scroll</span>
                      </div>
                    </section>
                  )}
                >
                  <MenufyMenuSection theme={theme} focusRestaurant={focusedMenufyRestaurant} />
                </LazyRender>
              )}

              {filteredUnconfirmed.length > 0 && (
                <div className="mt-6">
                  <div className={`flex items-center gap-3 mb-6 pt-6 border-t-2 border-dashed ${isLight ? 'border-black/10' : 'border-white/30'}`}>
                    <div className="flex items-center gap-2">
                      <svg className={`w-5 h-5 ${isLight ? 'text-gray-900' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <h3 className={`font-display text-xl sm:text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Unconfirmed Data</h3>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${isLight ? 'text-warmgray-dark bg-black/5' : 'text-white/70 bg-black/20'}`}>
                      {filteredUnconfirmed.length} items
                    </span>
                  </div>
                  <p className={`text-sm mb-5 -mt-3 ${isLight ? 'text-warmgray-dark' : 'text-white'}`}>
                    {hasScannedUnconfirmed
                      ? 'Recently scanned menu items appear here first. OCR can misread names, prices, and nutrition values, and older items in this section may still use estimated nutrition.'
                      : 'Nutritional info for these items was estimated based on typical serving sizes and may not be accurate.'}
                  </p>
                  <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${isLight ? 'border-black/10' : 'border-cream'}`}>
                    <h2 className={`font-display text-xl sm:text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {selectedRestaurant}
                    </h2>
                  </div>
                  <div className="opacity-80">
                    <MenuGrid groupedItems={groupedUnconfirmed} onItemClick={setSelectedItem} cart={cart} theme={theme} selectedRestaurant={selectedRestaurant} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      <AnimatePresence>
        {showCamera && (
          <CameraScanner
            knownRestaurants={restaurants}
            onClose={() => setShowCamera(false)}
            onPhotoSaved={refreshScannedContent}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGallery && (
          <PhotoGallery theme={theme} onClose={() => setShowGallery(false)} onPhotosChanged={refreshScannedContent} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <ItemModal theme={theme} item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addToCart} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <CartPanel
            theme={theme}
            cart={cart}
            totals={cartTotals}
            goals={goals}
            onClose={() => setShowCart(false)}
            onRemove={removeFromCart}
            onUpdateQty={updateCartQty}
            onClear={() => setCart([])}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
