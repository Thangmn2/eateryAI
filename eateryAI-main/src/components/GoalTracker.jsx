import { useState } from 'react'

function ProgressRing({ value, max, color, size = 38, strokeWidth = 3.5 }) {
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
        className="text-cream"
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

function GoalEditor({ goals, onSave, onClose }) {
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm"
         onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 shadow-modal w-80" onClick={e => e.stopPropagation()}>
        <p className="font-display text-lg font-semibold mb-1">Edit Goals</p>
        <p className="text-warmgray text-sm mb-5">Set your daily targets</p>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium text-warmgray uppercase tracking-wider mb-1 block">{f.label}</label>
              <div className="relative">
                {f.prefix && (
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray-light font-medium">{f.prefix}</span>
                )}
                <input
                  type="number"
                  value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-ivory text-base font-medium
                             focus:outline-none focus:ring-2 ${f.color} ${f.prefix ? 'pl-7' : ''}`}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-warmgray hover:bg-cream transition-colors">
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

export default function GoalTracker({ goals, totals, onGoalsChange, cartCount, onCartClick }) {
  const [editing, setEditing] = useState(false)

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
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-cream/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Goal Metrics */}
            <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar">
              {metrics.map(m => {
                const pct = Math.min((m.current / m.max) * 100, 100)
                const isOver = m.current > m.max
                return (
                  <button
                    key={m.key}
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2.5 shrink-0 group"
                    title="Click to edit goals"
                  >
                    <ProgressRing value={m.current} max={m.max} color={m.color} />
                    <div className="text-left">
                      <div className="text-[11px] uppercase tracking-wider text-warmgray font-medium leading-none mb-0.5">
                        {m.label}
                      </div>
                      <div className={`text-sm font-semibold leading-none ${isOver ? 'text-red-500' : 'text-gray-900'}`}>
                        {m.format(m.current)}
                        <span className="text-warmgray-light font-normal"> / {m.formatMax(m.max)}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative shrink-0 w-10 h-10 flex items-center justify-center rounded-full
                         bg-ivory hover:bg-cream transition-colors group"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-terra transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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

      {/* Goal Editor Modal */}
      {editing && (
        <GoalEditor
          goals={goals}
          onSave={newGoals => onGoalsChange(() => newGoals)}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
