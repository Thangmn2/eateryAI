import { motion } from 'framer-motion'

export default function CartPanel({ cart, totals, goals, onClose, onRemove, onUpdateQty, onClear, theme }) {
  const isLight = theme === 'light'
  const isEmpty = cart.length === 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[4000] bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className={`absolute right-0 top-0 bottom-0 flex w-full flex-col shadow-modal sm:w-[400px] ${
          isLight ? 'bg-white' : 'border-l border-white/10 bg-[#111317]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-5 py-4 ${isLight ? 'border-cream' : 'border-white/10'}`}>
          <div>
            <h2 className={`font-display text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Your Cart</h2>
            <p className={`mt-0.5 text-xs ${isLight ? 'text-warmgray' : 'text-white/55'}`}>
              {cart.reduce((s, e) => s + e.qty, 0)} items
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isLight ? 'bg-cream hover:bg-cream' : 'bg-white/8 hover:bg-white/12'
            }`}
          >
            <svg className={`h-4 w-4 ${isLight ? 'text-gray-600' : 'text-white/75'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-3 opacity-30">🛒</span>
              <p className={`mb-1 font-display text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Cart is empty</p>
              <p className={`text-sm ${isLight ? 'text-warmgray' : 'text-white/55'}`}>Browse the menu and add items</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((entry, idx) => {
                const price = parseFloat(entry.item['Price ($)'])
                const hasPrice = price && price > 0
                const entryImgUrl = entry.item['Image URL'] || ''
                const hasImage = entryImgUrl.startsWith('http') && !entryImgUrl.includes('Logo.png')
                return (
                  <div key={idx} className={`flex gap-3 rounded-xl p-3 ${isLight ? 'bg-ivory-light' : 'bg-white/6'}`}>
                    {/* Thumbnail */}
                    <div className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg ${isLight ? 'bg-cream' : 'bg-black/30'}`}>
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
                      <h4 className={`truncate text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {entry.item['Item Name']}
                      </h4>
                      <p className={`truncate text-[11px] ${isLight ? 'text-warmgray' : 'text-white/55'}`}>{entry.item.Restaurant}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        {/* Qty controls */}
                        <div className={`flex items-center overflow-hidden rounded-lg border ${
                          isLight ? 'border-cream bg-white' : 'border-white/10 bg-black/30'
                        }`}>
                          <button
                            onClick={() => onUpdateQty(idx, -1)}
                            className={`flex h-7 w-7 items-center justify-center transition-colors ${
                              isLight
                                ? 'text-warmgray hover:text-gray-900'
                                : 'text-white/60 hover:text-white'
                            }`}
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
                          <span className={`w-6 text-center text-xs font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>{entry.qty}</span>
                          <button
                            onClick={() => onUpdateQty(idx, 1)}
                            className={`flex h-7 w-7 items-center justify-center transition-colors ${
                              isLight
                                ? 'text-warmgray hover:text-gray-900'
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                        {hasPrice && (
                          <span className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
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
          <div className={`border-t px-5 py-4 ${isLight ? 'border-cream' : 'border-white/10'}`}>
            {/* Summary Bars */}
            <div className="space-y-2.5 mb-4">
              <SummaryRow
                theme={theme}
                label="Total"
                value={`$${totals.price.toFixed(2)}`}
                max={goals.price}
                current={totals.price}
                color="bg-terra"
                formatMax={v => `$${v}`}
              />
              <SummaryRow
                theme={theme}
                label="Calories"
                value={Math.round(totals.calories).toLocaleString()}
                max={goals.calories}
                current={totals.calories}
                color="bg-amber-400"
                formatMax={v => v.toLocaleString()}
              />
              <SummaryRow
                theme={theme}
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
              className={`w-full py-2 text-sm font-medium transition-colors ${
                isLight ? 'text-warmgray hover:text-red-500' : 'text-white/55 hover:text-red-400'
              }`}
            >
              Clear Cart
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function SummaryRow({ label, value, max, current, color, formatMax, theme }) {
  const isLight = theme === 'light'
  const pct = Math.min((current / max) * 100, 100)
  const isOver = current > max

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${isLight ? 'text-warmgray' : 'text-white/55'}`}>{label}</span>
        <span className={`text-xs font-semibold ${isOver ? 'text-red-500' : isLight ? 'text-gray-900' : 'text-white'}`}>
          {value}
          <span className={`font-normal ${isLight ? 'text-warmgray-light' : 'text-white/45'}`}> / {formatMax(max)}</span>
        </span>
      </div>
      <div className={`h-1.5 overflow-hidden rounded-full ${isLight ? 'bg-cream' : 'bg-white/8'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-400' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
