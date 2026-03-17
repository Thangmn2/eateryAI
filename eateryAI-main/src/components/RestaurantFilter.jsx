import { useRef } from 'react'
import slugify from '../utils/slugify'

export default function RestaurantFilter({ restaurants, selected, onSelect, counts, theme }) {
  const scrollRef = useRef(null)
  const isLight = theme === 'light'
  const fadeClass = theme === 'light'
    ? 'from-[#f6f1e8]'
    : 'from-black'

  function getItemCount(name) {
    return counts?.[name] || null
  }

  return (
    <div className="relative mb-6">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4"
      >
        <button
          onClick={() => {
            onSelect('All')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className={`chip whitespace-nowrap ${selected === 'All' ? 'chip-active' : ''}`}
        >
          All Restaurants
        </button>
        {restaurants.map(name => (
          <a
            key={name}
            href={`#restaurant-${slugify(name)}`}
            onClick={() => onSelect(name)}
            className={`chip whitespace-nowrap ${selected === name ? 'chip-active' : ''}`}
          >
            {name}
            {getItemCount(name) && (
              <span className={`ml-1.5 text-xs ${
                selected === name
                  ? isLight
                    ? 'text-white/70'
                    : 'text-black/55'
                  : isLight
                    ? 'text-warmgray-light'
                    : 'text-white/55'
              }`}>
                {getItemCount(name)}
              </span>
            )}
          </a>
        ))}
      </div>
      {/* Fade edges */}
      <div className={`absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l ${fadeClass} to-transparent pointer-events-none`} />
    </div>
  )
}
