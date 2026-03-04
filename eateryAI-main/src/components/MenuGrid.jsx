function ItemCard({ item, onClick, inCart }) {
  const price = parseFloat(item['Price ($)'])
  const hasPrice = price && price > 0
  const calories = parseFloat(item.Calories)
  const protein = parseFloat(item['Protein (g)'])
  const imgUrl = item['Image URL'] || ''
  const hasImage = imgUrl.startsWith('http') && !imgUrl.includes('Logo.png')

  function getEmoji() {
    const cat = (item.Category || '').toLowerCase()
    const name = (item['Item Name'] || '').toLowerCase()
    if (cat.includes('drink') || cat.includes('tea') || cat.includes('coffee') || name.includes('coffee') || name.includes('tea')) return '🍵'
    if (cat.includes('dessert') || cat.includes('sweet') || name.includes('bao')) return '🍡'
    if (cat.includes('roll') || cat.includes('sushi') || name.includes('roll') || name.includes('sushi')) return '🍣'
    if (name.includes('tempura')) return '🍤'
    if (name.includes('udon') || name.includes('noodle')) return '🍜'
    if (name.includes('bowl') || name.includes('rice')) return '🍚'
    if (name.includes('salad')) return '🥗'
    if (name.includes('fries')) return '🍟'
    if (name.includes('egg roll') || name.includes('spring roll')) return '🥟'
    if (name.includes('burger') || name.includes('slider')) return '🍔'
    if (name.includes('wing')) return '🍗'
    if (cat.includes('taco') || name.includes('taco')) return '🌮'
    if (cat.includes('classic') || cat.includes('appetizer') || cat.includes('starter')) return '🍽'
    return '🍽'
  }

  return (
    <div onClick={() => onClick(item)} className="menu-card group relative">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        {hasImage ? (
          <img
            src={imgUrl}
            alt={item['Item Name']}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div
          className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cream via-ivory to-cream ${hasImage ? 'hidden' : 'flex'}`}
          style={hasImage ? { display: 'none' } : {}}
        >
          <span className="text-5xl mb-2 drop-shadow-sm">{getEmoji()}</span>
          <p className="text-[11px] font-medium text-warmgray/60 px-3 text-center leading-tight">
            {item['Item Name']}
          </p>
        </div>
        {/* Source badge */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 backdrop-blur-sm text-warmgray shadow-sm">
          {item.Source}
        </span>
        {/* In cart indicator */}
        {inCart && (
          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-terra text-white text-xs font-bold flex items-center justify-center shadow-sm">
            {inCart}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2 mb-1.5">
          {item['Item Name']}
        </h3>
        <div className="flex items-center justify-between">
          {hasPrice ? (
            <span className="text-sm font-bold text-black">${price.toFixed(2)}</span>
          ) : (
            <span className="text-xs text-warmgray-light italic">Price N/A</span>
          )}
          <div className="flex items-center gap-2 text-[11px] text-black">
            {item['Nutrition Estimated'] && (
              <span className="text-amber-500" title="Estimated">~</span>
            )}
            {calories > 0 && (
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                {Math.round(calories)} cal
              </span>
            )}
            {protein > 0 && (
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
                {Math.round(protein)}g
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CategorySection({ title, items, onItemClick, cart }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-cream" />
        {title}
        <span className="text-warmgray-light font-normal normal-case tracking-normal">({items.length})</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const cartEntry = cart.find(e =>
            e.item.Restaurant === item.Restaurant && e.item['Item Name'] === item['Item Name']
          )
          return (
            <ItemCard
              key={`${item['Item Name']}-${i}`}
              item={item}
              onClick={onItemClick}
              inCart={cartEntry?.qty}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function MenuGrid({ groupedItems, onItemClick, cart }) {
  if (groupedItems.type === 'byRestaurant') {
    const restaurants = Object.entries(groupedItems.data)
    return (
      <div>
        {restaurants.map(([restaurant, categories]) => (
          <div key={restaurant} className="mb-10">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-cream">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{restaurant}</h2>
              <span className="text-xs text-black bg-white px-2 py-0.5 rounded-full">
                {Object.values(categories).flat().length} items
              </span>
            </div>
            {Object.entries(categories).map(([category, items]) => (
              <CategorySection
                key={category}
                title={category}
                items={items}
                onItemClick={onItemClick}
                cart={cart}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  // Single restaurant view - group by category
  const categories = Object.entries(groupedItems.data)
  return (
    <div>
      {categories.map(([category, items]) => (
        <CategorySection
          key={category}
          title={category}
          items={items}
          onItemClick={onItemClick}
          cart={cart}
        />
      ))}
    </div>
  )
}
