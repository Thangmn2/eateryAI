import { motion } from 'framer-motion'

export default function CartPanel({ cart, totals, goals, onClose, onRemove, onUpdateQty, onClear }) {
  const isEmpty = cart.length === 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white shadow-modal flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">Your Cart</h2>
            <p className="text-xs text-warmgray mt-0.5">
              {cart.reduce((s, e) => s + e.qty, 0)} items
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center hover:bg-cream transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-3 opacity-30">🛒</span>
              <p className="font-display text-lg font-semibold text-gray-900 mb-1">Cart is empty</p>
              <p className="text-sm text-warmgray">Browse the menu and add items</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((entry, idx) => {
                const price = parseFloat(entry.item['Price ($)'])
                const hasPrice = price && price > 0
                const entryImgUrl = entry.item['Image URL'] || ''
                const hasImage = entryImgUrl.startsWith('http') && !entryImgUrl.includes('Logo.png')
                return (
                  <div key={idx} className="flex gap-3 bg-ivory/50 rounded-xl p-3">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream shrink-0">
                      {hasImage ? (
                        <img
                          src={entryImgUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-lg opacity-20">🍽</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {entry.item['Item Name']}
                      </h4>
                      <p className="text-[11px] text-warmgray truncate">{entry.item.Restaurant}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        {/* Qty controls */}
                        <div className="flex items-center bg-white rounded-lg border border-cream overflow-hidden">
                          <button
                            onClick={() => onUpdateQty(idx, -1)}
                            className="w-7 h-7 flex items-center justify-center text-warmgray hover:text-gray-900 transition-colors"
                          >
                            {entry.qty === 1 ? (
                              <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" d="M5 12h14" />
                              </svg>
                            )}
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">{entry.qty}</span>
                          <button
                            onClick={() => onUpdateQty(idx, 1)}
                            className="w-7 h-7 flex items-center justify-center text-warmgray hover:text-gray-900 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                        {hasPrice && (
                          <span className="text-sm font-bold text-terra">
                            ${(price * entry.qty).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Totals */}
        {!isEmpty && (
          <div className="border-t border-cream px-5 py-4">
            {/* Summary Bars */}
            <div className="space-y-2.5 mb-4">
              <SummaryRow
                label="Total"
                value={`$${totals.price.toFixed(2)}`}
                max={goals.price}
                current={totals.price}
                color="bg-terra"
                formatMax={v => `$${v}`}
              />
              <SummaryRow
                label="Calories"
                value={Math.round(totals.calories).toLocaleString()}
                max={goals.calories}
                current={totals.calories}
                color="bg-amber-400"
                formatMax={v => v.toLocaleString()}
              />
              <SummaryRow
                label="Protein"
                value={`${Math.round(totals.protein)}g`}
                max={goals.protein}
                current={totals.protein}
                color="bg-sage"
                formatMax={v => `${v}g`}
              />
            </div>

            <button
              onClick={onClear}
              className="w-full py-2 text-sm text-warmgray hover:text-red-500 transition-colors font-medium"
            >
              Clear Cart
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function SummaryRow({ label, value, max, current, color, formatMax }) {
  const pct = Math.min((current / max) * 100, 100)
  const isOver = current > max

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-warmgray">{label}</span>
        <span className={`text-xs font-semibold ${isOver ? 'text-red-500' : 'text-gray-900'}`}>
          {value}
          <span className="text-warmgray-light font-normal"> / {formatMax(max)}</span>
        </span>
      </div>
      <div className="h-1.5 bg-cream rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-400' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
