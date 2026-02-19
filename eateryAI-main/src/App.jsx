import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import menuJson from './data/menuData.json'
import GoalTracker from './components/GoalTracker'
import RestaurantFilter from './components/RestaurantFilter'
import MenuGrid from './components/MenuGrid'
import ItemModal from './components/ItemModal'
import CartPanel from './components/CartPanel'
import CameraScanner from './components/CameraScanner'
import PhotoGallery from './components/PhotoGallery'

const confirmedItems = menuJson.menuItems.filter(i => !i['Nutrition Estimated'])
const unconfirmedItems = menuJson.menuItems.filter(i => i['Nutrition Estimated'])
const RESTAURANTS = [...new Set(menuJson.menuItems.map(i => i.Restaurant))].sort()

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [goals, setGoals] = useState({ price: 30, calories: 2000, protein: 150 })
  const [showCamera, setShowCamera] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryScanCount, setGalleryScanCount] = useState(
    () => JSON.parse(localStorage.getItem('eateryai_scanned_photos') || '[]').length
  )

  const filteredConfirmed = useMemo(() => {
    return selectedRestaurant === 'All'
      ? confirmedItems
      : confirmedItems.filter(i => i.Restaurant === selectedRestaurant)
  }, [selectedRestaurant])

  const filteredUnconfirmed = useMemo(() => {
    return selectedRestaurant === 'All'
      ? unconfirmedItems
      : unconfirmedItems.filter(i => i.Restaurant === selectedRestaurant)
  }, [selectedRestaurant])

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
      const key = `${item.Restaurant}::${item['Item Name']}`
      const idx = prev.findIndex(e => `${e.item.Restaurant}::${e.item['Item Name']}` === key)
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

  function handlePhotoSaved() {
    setGalleryScanCount(JSON.parse(localStorage.getItem('eateryai_scanned_photos') || '[]').length)
  }

  return (
    <div className="grain min-h-screen">
      <GoalTracker
        goals={goals}
        totals={cartTotals}
        onGoalsChange={setGoals}
        cartCount={cart.reduce((s, e) => s + e.qty, 0)}
        onCartClick={() => setShowCart(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Header */}
        <div className="pt-6 pb-4 flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Eatery
            </h1>
            <p className="mt-1 text-warmgray text-sm">
              {menuJson.menuItems.length} items across {RESTAURANTS.length} restaurants
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Saved Scans button */}
            <button
              onClick={() => setShowGallery(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Saved Scans
              {galleryScanCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {galleryScanCount}
                </span>
              )}
            </button>
            {/* Scan Menu button */}
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold shadow-md transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              Scan Menu
            </button>
          </div>
        </div>

        <RestaurantFilter
          restaurants={RESTAURANTS}
          selected={selectedRestaurant}
          onSelect={setSelectedRestaurant}
          summary={menuJson.summary}
        />

        <MenuGrid groupedItems={groupedConfirmed} onItemClick={setSelectedItem} cart={cart} />

        {filteredUnconfirmed.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-6 pt-6 border-t-2 border-dashed border-cream">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-warmgray-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-warmgray">Unconfirmed Data</h2>
              </div>
              <span className="text-xs text-warmgray-light bg-cream px-2.5 py-1 rounded-full">
                {filteredUnconfirmed.length} items
              </span>
            </div>
            <p className="text-sm text-warmgray-light mb-5 -mt-3">
              Nutritional info for these items was estimated based on typical serving sizes and may not be accurate.
            </p>
            <div className="opacity-80">
              <MenuGrid groupedItems={groupedUnconfirmed} onItemClick={setSelectedItem} cart={cart} />
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showCamera && (
          <CameraScanner onClose={() => setShowCamera(false)} onPhotoSaved={handlePhotoSaved} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGallery && (
          <PhotoGallery onClose={() => setShowGallery(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addToCart} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <CartPanel
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