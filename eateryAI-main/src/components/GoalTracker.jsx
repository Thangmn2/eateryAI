import { memo, useEffect, useRef, useState } from 'react'

function ProgressRing({ value, max, color, trackClassName, size = 38, strokeWidth = 3.5 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  const offset = circumference * (1 - pct)
  const isOver = value > max

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={trackClassName}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={isOver ? '#DC2626' : color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  )
}

function EateryLogo({ isLight }) {
  return (
    <img
      src={isLight ? '/Greenlogoeatery.png' : '/Greenlogoeatery.png'}
      alt="Eatery"
      className="h-10 w-auto shrink-0 sm:h-12"
      draggable="false"
      style={{
        filter: isLight ? 'brightness(0)' : 'brightness(0) invert(1)',
      }}
    />
  )
}

function ScanMenu({ isLight, scanCount, onOpenCamera, onOpenGallery }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  function handleOpenCamera() {
    setIsOpen(false)
    onOpenCamera()
  }

  function handleOpenGallery() {
    setIsOpen(false)
    onOpenGallery()
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(current => !current)}
        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
          isLight
            ? 'border-black/10 bg-white text-black shadow-sm hover:bg-cream'
            : 'border-white/10 bg-white text-black shadow-[0_10px_24px_rgba(255,255,255,0.12)] hover:bg-[#f3f3f3]'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open scan menu"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border p-2 shadow-xl ${
            isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#111317]'
          }`}
        >
          <button
            type="button"
            onClick={handleOpenCamera}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
              isLight ? 'text-gray-900 hover:bg-cream' : 'text-white hover:bg-white/8'
            }`}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <span>Upload a Photo</span>
          </button>
          <button
            type="button"
            onClick={handleOpenGallery}
            className={`mt-1 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
              isLight ? 'text-gray-900 hover:bg-cream' : 'text-white hover:bg-white/8'
            }`}
          >
            <span className="flex items-center gap-3">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>Saved Scans</span>
            </span>
            {scanCount > 0 && (
              <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                isLight ? 'bg-black text-white' : 'bg-white text-black'
              }`}>
                {scanCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

function GoalEditor({ goals, onSave, onClose, theme }) {
  const isLight = theme === 'light'
  const [price, setPrice] = useState(String(goals.price))
  const [calories, setCalories] = useState(String(goals.calories))
  const [protein, setProtein] = useState(String(goals.protein))

  function handleSave() {
    const p = parseFloat(price)
    const c = parseFloat(calories)
    const pr = parseFloat(protein)
    if (p > 0 && c > 0 && pr > 0) {
      onSave({ price: p, calories: c, protein: pr })
      onClose()
    }
  }

  const fields = [
    { label: 'Budget', value: price, onChange: setPrice, prefix: '$', color: 'border-terra/30 focus:border-terra focus:ring-terra/20' },
    { label: 'Calories', value: calories, onChange: setCalories, prefix: '', color: 'border-amber-300/50 focus:border-amber-400 focus:ring-amber-400/20' },
    { label: 'Protein (g)', value: protein, onChange: setProtein, prefix: '', color: 'border-sage/30 focus:border-sage focus:ring-sage/20' },
  ]

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/30 backdrop-blur-sm"
         onClick={onClose}>
      <div
        className={`w-80 rounded-2xl p-6 shadow-modal ${isLight ? 'bg-white' : 'border border-white/10 bg-[#111317]'}`}
        onClick={e => e.stopPropagation()}
      >
        <p className={`mb-5 font-display text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Set your daily targets</p>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.label}>
              <label className={`mb-1 block text-xs font-medium uppercase tracking-wider ${isLight ? 'text-warmgray-dark' : 'text-white/60'}`}>{f.label}</label>
              <div className="relative">
                {f.prefix && (
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-medium ${isLight ? 'text-black' : 'text-white/70'}`}>{f.prefix}</span>
                )}
                <input
                  type="number"
                  value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-base font-medium focus:outline-none focus:ring-2 ${
                    isLight
                      ? 'bg-white text-gray-900'
                      : 'border-white/10 bg-black/40 text-white'
                  } ${f.color} ${f.prefix ? 'pl-7' : ''}`}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${
                    isLight
                      ? 'text-warmgray-dark hover:bg-cream'
                      : 'text-white/70 hover:bg-white/8 hover:text-white'
                  }`}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-terra text-white hover:bg-terra-dark transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function GoalTracker({
  goals,
  totals,
  onGoalsChange,
  cartCount,
  onCartClick,
  onOpenCamera,
  onOpenGallery,
  galleryScanCount,
  theme,
}) {
  const [editing, setEditing] = useState(true)
  const isLight = theme === 'light'

  const metrics = [
    {
      key: 'price',
      label: 'Budget',
      current: totals.price,
      max: goals.price,
      format: v => `$${v.toFixed(2)}`,
      formatMax: v => `$${v}`,
      color: '#C45D35',
    },
    {
      key: 'calories',
      label: 'Calories',
      current: totals.calories,
      max: goals.calories,
      format: v => Math.round(v).toLocaleString(),
      formatMax: v => v.toLocaleString(),
      color: '#D49A3A',
    },
    {
      key: 'protein',
      label: 'Protein',
      current: totals.protein,
      max: goals.protein,
      format: v => `${Math.round(v)}g`,
      formatMax: v => `${v}g`,
      color: '#5F8B64',
    },
  ]

  return (
    <>
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isLight ? 'bg-[#f6f1e8]/95 border-black/10' : 'bg-black border-black'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isLight ? 'bg-[#f6f1e8]/95' : 'bg-black'}`}>
          <div className={`flex flex-wrap items-center justify-between gap-4 py-3 ${isLight ? 'bg-[#f6f1e8]/95' : 'bg-black'}`}>
            <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden sm:gap-6">
              <EateryLogo isLight={isLight} />
              <div className="ml-auto flex min-w-0 items-center justify-end gap-5 overflow-x-auto no-scrollbar sm:gap-8">
              {metrics.map(m => {
                const isOver = m.current > m.max
                return (
                  <button
                    key={m.key}
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2.5 shrink-0 group"
                    title="Click to edit goals"
                  >
                    <ProgressRing
                      value={m.current}
                      max={m.max}
                      color={m.color}
                      trackClassName={isLight ? 'text-black/10' : 'text-cream'}
                    />
                    <div className="text-left">
                      <div className={`text-[11px] uppercase tracking-wider font-medium leading-none mb-0.5 ${isLight ? 'text-warmgray-dark' : 'text-white'}`}>
                        {m.label}
                      </div>
                      <div className={`text-sm font-semibold leading-none ${isOver ? 'text-red-500' : isLight ? 'text-gray-900' : 'text-white'}`}>
                        {m.format(m.current)}
                        <span className={`${isLight ? 'text-warmgray-dark' : 'text-white'} font-normal`}> / {m.formatMax(m.max)}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="h-11 w-11 shrink-0" aria-hidden="true" />
              <ScanMenu
                isLight={isLight}
                scanCount={galleryScanCount}
                onOpenCamera={onOpenCamera}
                onOpenGallery={onOpenGallery}
              />

              <button
                onClick={onCartClick}
                className={`relative shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors group ${
                  isLight
                    ? 'border border-black/10 bg-white hover:bg-cream'
                    : 'border border-white/10 bg-[#111317] hover:bg-[#181b20]'
                }`}
              >
                <svg className={`w-5 h-5 transition-colors group-hover:text-terra ${isLight ? 'text-gray-700' : 'text-white/85'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-terra text-white text-[11px] font-bold
                                 flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Editor Modal */}
      {editing && (
        <GoalEditor
          theme={theme}
          goals={goals}
          onSave={onGoalsChange}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}

export default memo(GoalTracker)
