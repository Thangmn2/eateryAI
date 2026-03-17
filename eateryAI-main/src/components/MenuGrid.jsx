import slugify from '../utils/slugify'

function ItemCard({ item, onClick, inCart, theme }) {
  const isLight = theme === 'light'
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
    <div
      onClick={() => onClick(item)}
      className={`menu-card group relative border ${
        isLight
          ? 'border-black/10 bg-white'
          : 'border-white/10 bg-[#111317]'
      }`}
    >
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
          className={`w-full h-full flex flex-col items-center justify-center ${
            isLight
              ? 'bg-gradient-to-br from-cream via-ivory to-cream'
              : 'bg-gradient-to-br from-[#16181d] via-[#101216] to-[#181b20]'
          } ${hasImage ? 'hidden' : 'flex'}`}
          style={hasImage ? { display: 'none' } : {}}
        >
          <span className="text-5xl mb-2 drop-shadow-sm">{getEmoji()}</span>
          <p className={`px-3 text-center text-[11px] font-medium leading-tight ${isLight ? 'text-warmgray/60' : 'text-white/45'}`}>
            {item['Item Name']}
          </p>
        </div>

        <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm ${
          isLight
            ? 'bg-white/90 text-warmgray'
            : 'bg-black/55 text-white/75'
        }`}>
          {item.Source}
        </span>

        {inCart && (
          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-terra text-white text-xs font-bold flex items-center justify-center shadow-sm">
            {inCart}
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className={`mb-1.5 line-clamp-2 text-sm font-semibold leading-snug ${isLight ? 'text-gray-900' : 'text-white'}`}>
          {item['Item Name']}
        </h3>
        <div className="flex items-center justify-between">
          {hasPrice ? (
            <span className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>${price.toFixed(2)}</span>
          ) : (
            <span className={`text-xs italic ${isLight ? 'text-warmgray-light' : 'text-white/45'}`}>Price N/A</span>
          )}
          <div className={`flex items-center gap-2 text-[11px] ${isLight ? 'text-black' : 'text-white/80'}`}>
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

function CategorySection({ title, items, onItemClick, cart, theme }) {
  const isLight = theme === 'light'

  return (
    <div className="mb-8">
      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
        <span className={`w-6 h-px ${isLight ? 'bg-black/20' : 'bg-cream'}`} />
        {title}
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
              theme={theme}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function MenuGrid({
  groupedItems,
  onItemClick,
  cart,
  theme,
  afterRestaurantName,
  afterRestaurantContent,
  selectedRestaurant,
}) {
  const isLight = theme === 'light'

  if (groupedItems.type === 'byRestaurant') {
    const restaurants = Object.entries(groupedItems.data)

    return (
      <div>
        {restaurants.map(([restaurant, categories]) => (
          <div
            key={restaurant}
            id={`restaurant-${slugify(restaurant)}`}
            className="mb-10 scroll-mt-24"
          >
            <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${isLight ? 'border-black/10' : 'border-cream'}`}>
              <h2 className={`font-display text-xl sm:text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {restaurant}
              </h2>
            </div>

            {Object.entries(categories).map(([category, items]) => (
              <CategorySection
                key={category}
                title={category}
                items={items}
                onItemClick={onItemClick}
                cart={cart}
                theme={theme}
              />
            ))}

            {restaurant === afterRestaurantName ? afterRestaurantContent : null}
          </div>
        ))}
      </div>
    )
  }

  const categories = Object.entries(groupedItems.data)
  return (
    <div id={selectedRestaurant ? `restaurant-${slugify(selectedRestaurant)}` : undefined} className="scroll-mt-24">
      {categories.map(([category, items]) => (
        <CategorySection
          key={category}
          title={category}
          items={items}
          onItemClick={onItemClick}
          cart={cart}
          theme={theme}
        />
      ))}
    </div>
  )
}
