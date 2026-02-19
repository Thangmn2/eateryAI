import { useRef } from 'react'

export default function RestaurantFilter({ restaurants, selected, onSelect, summary }) {
  const scrollRef = useRef(null)

  function getItemCount(name) {
    const s = summary?.find(s => s.Restaurant === name)
    return s ? s['Total Items'] : null
  }

  return (
    <div className="relative mb-6">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4"
      >
        <button
          onClick={() => onSelect('All')}
          className={`chip whitespace-nowrap ${selected === 'All' ? 'chip-active' : ''}`}
        >
          All Restaurants
        </button>
        {restaurants.map(name => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`chip whitespace-nowrap ${selected === name ? 'chip-active' : ''}`}
          >
            {name}
            {getItemCount(name) && (
              <span className={`ml-1.5 text-xs ${selected === name ? 'text-white/70' : 'text-warmgray-light'}`}>
                {getItemCount(name)}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Fade edges */}
      <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-ivory to-transparent pointer-events-none" />
    </div>
  )
}
