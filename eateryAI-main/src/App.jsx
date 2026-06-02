import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import GoalTracker from './components/GoalTracker'
import ItemModal from './components/ItemModal'
import CartPanel from './components/CartPanel'
import CameraScanner from './components/CameraScanner'
import PhotoGallery from './components/PhotoGallery'
import RestaurantMap from './components/RestaurantMap'
import MenufyMenuSection from './components/MenufyMenuSection'
import LazyRender from './components/LazyRender'
import { loadScannedPhotos } from './utils/scannedMenus'
import slugify from './utils/slugify'

function getCartKey(item) {
  return item['Cart Key'] || `${item.Restaurant}::${item['Item Name']}`
}

export default function App() {
  const [showMap, setShowMap] = useState(true)
  const [focusedMenufyRestaurant, setFocusedMenufyRestaurant] = useState('')
  const [visibleMapRestaurants, setVisibleMapRestaurants] = useState([])
  const [menufyStats, setMenufyStats] = useState({ items: 0, restaurants: 0 })
  const [selectedItem, setSelectedItem] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [goals, setGoals] = useState({ price: 30, calories: 2000, protein: 150 })
  const [showCamera, setShowCamera] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryScanCount, setGalleryScanCount] = useState(() => loadScannedPhotos().length)
  const theme = 'dark'
  const isLight = false

  const visibleMapRestaurantNames = useMemo(
    () => visibleMapRestaurants.map(restaurant => restaurant.restaurant_name).filter(Boolean),
    [visibleMapRestaurants]
  )

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
  const cartCount = useMemo(() => cart.reduce((sum, entry) => sum + entry.qty, 0), [cart])
  const mainMenuSummary = useMemo(() => {
    if (menufyStats.restaurants > 0) {
      return `${menufyStats.items} items across ${menufyStats.restaurants} restaurants in this map area`
    }

    return '0 items across 0 restaurants in this map area'
  }, [menufyStats.items, menufyStats.restaurants])

  const addToCart = useCallback((item, qty = 1) => {
    startTransition(() => {
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
      setShowCart(true)
    })
  }, [])

  const removeFromCart = useCallback((index) => {
    startTransition(() => {
      setCart(prev => prev.filter((_, i) => i !== index))
    })
  }, [])

  const updateCartQty = useCallback((index, delta) => {
    startTransition(() => {
      setCart(prev => {
        const updated = [...prev]
        const newQty = updated[index].qty + delta
        if (newQty <= 0) return prev.filter((_, i) => i !== index)
        updated[index] = { ...updated[index], qty: newQty }
        return updated
      })
    })
  }, [])

  const handleGoalsChange = useCallback((nextGoals) => {
    startTransition(() => {
      setGoals(nextGoals)
    })
  }, [])

  const handleCartOpen = useCallback(() => {
    setShowCart(true)
  }, [])

  const handleCameraOpen = useCallback(() => {
    setShowCamera(true)
  }, [])

  const handleGalleryOpen = useCallback(() => {
    setShowGallery(true)
  }, [])

  const handleOpenMenu = useCallback(() => {
    setShowMap(false)
  }, [])

  const handleShowMap = useCallback(() => {
    setShowMap(true)
  }, [])

  const handleMenufyStatsChange = useCallback((nextStats) => {
    setMenufyStats(nextStats)
  }, [])

  function refreshScannedContent() {
    setGalleryScanCount(loadScannedPhotos().length)
  }

  const handleRestaurantSelect = useCallback((name) => {
    const restaurantSlug = slugify(name)

    setFocusedMenufyRestaurant(name)
    requestAnimationFrame(() => {
      const target = document.getElementById('menu-content')
      target?.scrollIntoView({ top: 0, behavior: 'smooth' })
      requestAnimationFrame(() => {
        const menufyTarget = document.getElementById(`menufy-restaurant-${restaurantSlug}`)

        menufyTarget?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem('eatery-theme')
    document.body.style.backgroundColor = '#000000'
    document.body.style.color = '#ffffff'
    document.documentElement.style.colorScheme = 'dark'
  }, [])

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
      const matchedRestaurant = visibleMapRestaurantNames.find(name => slugify(name) === slug)
      if (!matchedRestaurant) return

      setFocusedMenufyRestaurant(matchedRestaurant)
    }

    syncRestaurantFromHash()
    window.addEventListener('hashchange', syncRestaurantFromHash)

    return () => {
      window.removeEventListener('hashchange', syncRestaurantFromHash)
    }
  }, [visibleMapRestaurantNames])

  return (
    <div className="grain min-h-screen theme-dark bg-black">
      <>
        <GoalTracker
          goals={goals}
          totals={cartTotals}
          onGoalsChange={handleGoalsChange}
          cartCount={cartCount}
          onCartClick={handleCartOpen}
          onOpenCamera={handleCameraOpen}
          onOpenGallery={handleGalleryOpen}
          galleryScanCount={galleryScanCount}
          theme={theme}
        />

        <main className={`max-w-7xl mx-auto px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-3 pb-5 ${isLight ? 'bg-[#f6f1e8]' : 'bg-black'}`}>
          {showMap && (
            <RestaurantMap
              theme={theme}
              onRestaurantClick={handleRestaurantSelect}
              onVisibleRestaurantsChange={setVisibleMapRestaurants}
            />
          )}

          <div id="menu-content" className="min-w-0">
              <LazyRender
                rootMargin="300px"
                minHeight="320px"
                placeholder={(
                  <section className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`font-display text-2xl sm:text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        Restaurants in the Area
                      </h2>
                      <span className={`text-xs ${isLight ? 'text-warmgray' : 'text-white/60'}`}>Load on scroll</span>
                    </div>
                  </section>
                )}
              >
                <MenufyMenuSection
                  theme={theme}
                  focusRestaurant={focusedMenufyRestaurant}
                  onItemClick={setSelectedItem}
                  cart={cart}
                  allowedRestaurantNames={visibleMapRestaurantNames}
                  onStatsChange={handleMenufyStatsChange}
                  summaryText={mainMenuSummary}
                  showMap={showMap}
                  onToggleMap={showMap ? handleOpenMenu : handleShowMap}
                />
              </LazyRender>
          </div>
        </main>

      </>

      <AnimatePresence>
        {showCamera && (
          <CameraScanner
            knownRestaurants={visibleMapRestaurantNames}
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
