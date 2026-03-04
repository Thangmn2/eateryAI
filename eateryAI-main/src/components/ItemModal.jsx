import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ItemModal({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1)

  const price = parseFloat(item['Price ($)'])
  const hasPrice = price && price > 0
  const calories = parseFloat(item.Calories)
  const protein = parseFloat(item['Protein (g)'])
  const fat = parseFloat(item['Fat (g)'])
  const imgUrl = item['Image URL'] || ''
  const hasImage = imgUrl.startsWith('http') && !imgUrl.includes('Logo.png')
  const isEstimated = item['Nutrition Estimated'] === true
  const isScanned = item['OCR Imported'] === true

  const nutrition = [
    { label: 'Calories', value: calories, unit: '', color: 'bg-amber-400', show: calories > 0 },
    { label: 'Protein', value: protein, unit: 'g', color: 'bg-sage', show: protein > 0 },
    { label: 'Fat', value: fat, unit: 'g', color: 'bg-orange-300', show: fat > 0 },
  ].filter(n => n.show)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full sm:w-[440px] sm:max-h-[90vh] max-h-[85vh] overflow-y-auto
                   rounded-t-3xl sm:rounded-3xl shadow-modal"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] bg-cream overflow-hidden">
          {hasImage ? (
            <img
              src={imgUrl}
              alt={item['Item Name']}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">🍽</span>
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                       flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Source */}
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-warmgray">
            via {item.Source}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {item['Item Name']}
            </h2>
            {hasPrice && (
              <span className="shrink-0 text-lg font-bold text-terra">${price.toFixed(2)}</span>
            )}
          </div>

          {/* Restaurant & Category */}
          <div className="flex items-center gap-2 text-sm text-black mb-3">
            <span className="font-medium">{item.Restaurant}</span>
            {item.Category && (
              <>
                <span className="w-1 h-1 rounded-full bg-warmgray-light" />
                <span>{item.Category}</span>
              </>
            )}
          </div>

          {/* Description */}
          {item.Description && (
            <p className="text-sm text-warmgray leading-relaxed mb-4">
              {item.Description}
            </p>
          )}

          {/* Estimated nutrition warning */}
          {(isEstimated || isScanned) && (
            <div className="flex items-start gap-2 mb-3 px-3 py-2.5 rounded-xl border border-amber-200/60">
              <svg className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-xs text-red-700 leading-relaxed">
                {isScanned ? (
                  <>
                    <span className="font-semibold">OCR imported.</span> Item details were scanned from a menu photo and may include text-reading mistakes.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Estimated nutrition.</span> Calorie and protein values are approximate guesses and may not reflect actual nutritional content.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Nutrition */}
          {nutrition.length > 0 && (
            <div className="flex gap-3 mb-5">
              {nutrition.map(n => (
                <div key={n.label} className={`flex-1 rounded-xl px-3 py-2.5 text-center ${isEstimated ? 'bg-black border border-dashed border-white' : 'bg-black'}`}>
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${n.color}`} />
                    <span className="text-[11px] uppercase tracking-wider text-white font-medium">
                      {isEstimated ? '~' : ''}{n.label}
                    </span>
                  </div>
                  <span className="text-base font-bold text-white">
                    {isEstimated ? '~' : ''}{Math.round(n.value)}{n.unit}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Address */}
          {item.Address && (
            <div className="flex items-start gap-2 text-xs text-white mb-5 bg-warmgray-light rounded-lg px-3 py-2">
              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
              </svg>
              <span>{item.Address}</span>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-xl overflow-hidden border border-black">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-warmgray-dark hover:text-gray-900 hover:bg-cream transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M5 12h14" />
                </svg>
              </button>
              <span className="w-8 text-center font-semibold text-sm">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-warmgray hover:text-gray-900 hover:bg-cream transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => onAdd(item, qty)}
              className="flex-1 h-12 rounded-xl bg-terra text-white font-semibold text-sm
                         hover:bg-warmgray-dark active:scale-[0.98] transition-all shadow-sm
                         flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add to Cart
              {hasPrice && (
                <span className="text-white/80 font-normal">
                  &middot; ${(price * qty).toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
