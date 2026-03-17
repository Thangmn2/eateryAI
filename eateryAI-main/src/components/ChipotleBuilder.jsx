import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ZERO_NUTRITION = {
  calories: 0,
  fat: 0,
  carbs: 0,
  protein: 0,
}

const NO_RICE_ID = '__no_rice__'
const NO_BEANS_ID = '__no_beans__'
const INITIAL_EXTRAS = {
  doubleProtein: false,
  doubleWrap: false,
  chips: false,
}

const MEAL_EMOJIS = {
  burrito: '🌯',
  bowl: '🍚',
  salad: '🥗',
  tacos: '🌮',
}

function addNutrition(total, next = ZERO_NUTRITION) {
  return {
    calories: total.calories + (next.calories || 0),
    fat: total.fat + (next.fat || 0),
    carbs: total.carbs + (next.carbs || 0),
    protein: total.protein + (next.protein || 0),
  }
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

function toggleInList(items, value) {
  return items.includes(value) ? items.filter(item => item !== value) : [...items, value]
}

function buildCartKey({ mealTypeId, proteinId, riceId, beanId, shellId, toppings, premiums, extras }) {
  const extrasKey = Object.entries(extras)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)
    .sort()
    .join(',')

  return [
    'chipotle-builder',
    mealTypeId || 'none',
    proteinId || 'none',
    riceId || 'none',
    beanId || 'none',
    shellId || 'none',
    [...toppings].sort().join(',') || 'none',
    [...premiums].sort().join(',') || 'none',
    extrasKey || 'none',
  ].join('::')
}

function getStartingPrice(mealType) {
  const prices = Object.values(mealType?.prices || {}).filter(value => Number.isFinite(value) && value > 0)
  return prices.length ? Math.min(...prices) : 0
}

function itemButtonClass(isActive, isLight) {
  return isActive
    ? isLight
      ? 'border-black bg-cream text-black'
      : 'border-white bg-white text-black'
    : isLight
      ? 'border-black/10 bg-white text-black hover:border-black/30 hover:bg-cream'
      : 'border-white/10 bg-[#15181d] text-white hover:border-white/20 hover:bg-[#1b1f25]'
}

function questionPillClass(isActive, isLight) {
  return isActive
    ? isLight
      ? 'border-black bg-black text-white'
      : 'border-white bg-white text-black'
    : isLight
      ? 'border-black/10 bg-white text-black hover:border-black/30 hover:bg-cream'
      : 'border-white/10 bg-[#15181d] text-white hover:border-white/20 hover:bg-[#1b1f25]'
}

function StepHeader({ title, isLight }) {
  return (
    <div className="mb-4">
      <p className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>{title}</p>
    </div>
  )
}

function ChipotleItemCard({ mealType, onOpen, theme }) {
  const isLight = theme === 'light'
  const startingPrice = getStartingPrice(mealType)
  const emoji = MEAL_EMOJIS[mealType.id] || '🍽'

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`menu-card group relative border text-left ${
        isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#111317]'
      }`}
    >
      <div className={`relative aspect-[4/3] overflow-hidden ${
        isLight
          ? 'bg-gradient-to-br from-cream via-ivory to-cream'
          : 'bg-gradient-to-br from-[#16181d] via-[#101216] to-[#181b20]'
      }`}>
        <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm ${
          isLight ? 'bg-white/90 text-warmgray' : 'bg-black/55 text-white/75'
        }`}>
          Chipotle
        </span>
        <div className="flex h-full items-center justify-center px-4 text-center">
          <span className="text-5xl drop-shadow-sm">{emoji}</span>
        </div>
      </div>

      <div className="p-3.5">
        <h3 className={`mb-1.5 font-semibold leading-snug ${isLight ? 'text-gray-900' : 'text-white'}`}>{mealType.name}</h3>
        <div className="flex items-center justify-between gap-3">
          <span className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
            {startingPrice ? `From ${formatPrice(startingPrice)}` : 'Build your own'}
          </span>
          <span className={`text-[11px] ${isLight ? 'text-black' : 'text-white/80'}`}>
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
            custom
          </span>
        </div>
      </div>
    </button>
  )
}

function ChipotleBuilderModal({ mealType, data, onClose, onAdd, theme }) {
  const isLight = theme === 'light'
  const proteins = data?.proteins || []
  const shells = data?.shells || []
  const rices = data?.rices || []
  const beans = data?.beans || []
  const toppings = data?.toppings || []
  const premiums = data?.premiums || []
  const extras = data?.extras || []

  const [proteinId, setProteinId] = useState(null)
  const [riceId, setRiceId] = useState(null)
  const [beanId, setBeanId] = useState(null)
  const [shellId, setShellId] = useState(null)
  const [selectedToppingIds, setSelectedToppingIds] = useState([])
  const [selectedPremiumIds, setSelectedPremiumIds] = useState([])
  const [selectedExtras, setSelectedExtras] = useState(INITIAL_EXTRAS)
  const [stepIndex, setStepIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const previousIncludedPremiumRef = useRef(null)

  const selectedProtein = useMemo(
    () => proteins.find(item => item.id === proteinId) || null,
    [proteinId, proteins]
  )
  const selectedRice = useMemo(
    () => rices.find(item => item.id === riceId) || null,
    [riceId, rices]
  )
  const selectedBean = useMemo(
    () => beans.find(item => item.id === beanId) || null,
    [beanId, beans]
  )
  const selectedShell = useMemo(
    () => shells.find(item => item.id === shellId) || null,
    [shellId, shells]
  )
  const selectedToppings = useMemo(
    () => toppings.filter(item => selectedToppingIds.includes(item.id)),
    [selectedToppingIds, toppings]
  )
  const selectedPremiums = useMemo(
    () => premiums.filter(item => selectedPremiumIds.includes(item.id)),
    [selectedPremiumIds, premiums]
  )
  const doubleWrap = useMemo(
    () => extras.find(item => item.id === 'double-wrap') || null,
    [extras]
  )
  const chips = useMemo(() => extras.find(item => item.id === 'chips') || null, [extras])

  const steps = useMemo(() => {
    const items = [{ id: 'protein', title: 'Protein' }]

    if (mealType?.allows?.shellChoice) {
      items.push({ id: 'shell', title: 'Shell' })
    }

    if (mealType?.allows?.rice) {
      items.push({ id: 'rice', title: 'Rice' })
    }

    if (mealType?.allows?.beans) {
      items.push({ id: 'beans', title: 'Beans' })
    }

    items.push(
      { id: 'toppings', title: 'Toppings' },
      { id: 'premiums', title: 'Guac / Queso' },
      { id: 'extras', title: 'Extras' }
    )

    return items
  }, [mealType])

  useEffect(() => {
    const nextIncludedPremium = selectedProtein?.includedPremium || null
    const previousIncludedPremium = previousIncludedPremiumRef.current

    setSelectedPremiumIds(previous => {
      let next = previous

      if (previousIncludedPremium && previousIncludedPremium !== nextIncludedPremium) {
        next = next.filter(item => item !== previousIncludedPremium)
      }

      if (nextIncludedPremium && !next.includes(nextIncludedPremium)) {
        next = [...next, nextIncludedPremium]
      }

      return next
    })

    previousIncludedPremiumRef.current = nextIncludedPremium
  }, [selectedProtein?.id, selectedProtein?.includedPremium])

  useEffect(() => {
    if (mealType?.allows?.doubleWrap) {
      return
    }

    setSelectedExtras(previous =>
      previous.doubleWrap ? { ...previous, doubleWrap: false } : previous
    )
  }, [mealType?.allows?.doubleWrap])

  const totals = useMemo(() => {
    if (!mealType || !selectedProtein) {
      return {
        price: 0,
        nutrition: { ...ZERO_NUTRITION },
      }
    }

    let totalNutrition = addNutrition(ZERO_NUTRITION, mealType.baseNutrition)
    totalNutrition = addNutrition(totalNutrition, selectedProtein.nutrition)

    if (mealType.allows?.shellChoice && selectedShell) {
      totalNutrition = addNutrition(totalNutrition, selectedShell.nutrition)
    }

    if (mealType.allows?.rice && selectedRice) {
      totalNutrition = addNutrition(totalNutrition, selectedRice.nutrition)
    }

    if (mealType.allows?.beans && selectedBean) {
      totalNutrition = addNutrition(totalNutrition, selectedBean.nutrition)
    }

    for (const topping of selectedToppings) {
      totalNutrition = addNutrition(totalNutrition, topping.nutrition)
    }

    for (const premium of selectedPremiums) {
      totalNutrition = addNutrition(totalNutrition, premium.nutrition)
    }

    if (selectedExtras.doubleProtein) {
      totalNutrition = addNutrition(totalNutrition, selectedProtein.nutrition)
    }

    if (selectedExtras.doubleWrap && doubleWrap) {
      totalNutrition = addNutrition(totalNutrition, doubleWrap.nutrition)
    }

    if (selectedExtras.chips && chips) {
      totalNutrition = addNutrition(totalNutrition, chips.nutrition)
    }

    let totalPrice = mealType.prices?.[selectedProtein.id] || 0

    for (const premium of selectedPremiums) {
      if (premium.id === selectedProtein.includedPremium) {
        continue
      }

      totalPrice += premium.price || 0
    }

    if (selectedExtras.doubleProtein && selectedProtein.extraPrice) {
      totalPrice += selectedProtein.extraPrice
    }

    if (selectedExtras.doubleWrap && doubleWrap) {
      totalPrice += doubleWrap.price || 0
    }

    if (selectedExtras.chips && chips) {
      totalPrice += chips.price || 0
    }

    return {
      price: totalPrice,
      nutrition: totalNutrition,
    }
  }, [
    beanId,
    chips,
    doubleWrap,
    mealType,
    riceId,
    selectedBean,
    selectedExtras.chips,
    selectedExtras.doubleProtein,
    selectedExtras.doubleWrap,
    selectedPremiums,
    selectedProtein,
    selectedRice,
    selectedShell,
    selectedToppings,
  ])

  const selectionSummary = useMemo(() => {
    const parts = []

    if (selectedProtein) {
      parts.push(selectedProtein.name)
    }

    if (mealType?.allows?.shellChoice && selectedShell) {
      parts.push(selectedShell.name)
    }

    if (mealType?.allows?.rice) {
      if (riceId === NO_RICE_ID) {
        parts.push('No Rice')
      } else if (selectedRice) {
        parts.push(selectedRice.name)
      }
    }

    if (mealType?.allows?.beans) {
      if (beanId === NO_BEANS_ID) {
        parts.push('No Beans')
      } else if (selectedBean) {
        parts.push(selectedBean.name)
      }
    }

    parts.push(...selectedToppings.map(item => item.name))
    parts.push(...selectedPremiums.map(item => item.name))

    if (selectedExtras.doubleProtein) {
      parts.push('Double Protein')
    }

    if (selectedExtras.doubleWrap) {
      parts.push('Double Wrap')
    }

    if (selectedExtras.chips) {
      parts.push('Chips')
    }

    return parts
  }, [
    beanId,
    mealType,
    riceId,
    selectedBean,
    selectedExtras.chips,
    selectedExtras.doubleProtein,
    selectedExtras.doubleWrap,
    selectedPremiums,
    selectedProtein,
    selectedRice,
    selectedShell,
    selectedToppings,
  ])

  const currentStep = steps[stepIndex] || null
  const isComplete = stepIndex >= steps.length
  const canAddToCart = Boolean(
    selectedProtein &&
      (!mealType.allows?.shellChoice || selectedShell) &&
      (!mealType.allows?.rice || riceId !== null) &&
      (!mealType.allows?.beans || beanId !== null)
  )

  const displayItemName = isComplete && selectedProtein
    ? `${selectedProtein.name} ${mealType.name}`
    : mealType.name

  const nutrition = [
    { label: 'Calories', value: totals.nutrition.calories, unit: '', color: 'bg-amber-400', show: totals.nutrition.calories > 0 },
    { label: 'Protein', value: totals.nutrition.protein, unit: 'g', color: 'bg-sage', show: totals.nutrition.protein > 0 },
    { label: 'Fat', value: totals.nutrition.fat, unit: 'g', color: 'bg-orange-300', show: totals.nutrition.fat > 0 },
  ].filter(item => item.show)

  function resetBuilder() {
    setProteinId(null)
    setRiceId(null)
    setBeanId(null)
    setShellId(null)
    setSelectedToppingIds([])
    setSelectedPremiumIds([])
    setSelectedExtras(INITIAL_EXTRAS)
    previousIncludedPremiumRef.current = null
    setStepIndex(0)
    setQty(1)
  }

  function goToPrevious() {
    if (isComplete) {
      setStepIndex(steps.length - 1)
      return
    }

    setStepIndex(previous => Math.max(previous - 1, 0))
  }

  function goToNext() {
    setStepIndex(previous => Math.min(previous + 1, steps.length))
  }

  function handleProteinSelect(id) {
    setProteinId(id)
    goToNext()
  }

  function handleShellSelect(id) {
    setShellId(id)
    goToNext()
  }

  function handleRiceSelect(id) {
    setRiceId(id)
    goToNext()
  }

  function handleBeanSelect(id) {
    setBeanId(id)
    goToNext()
  }

  function toggleTopping(id) {
    setSelectedToppingIds(previous => toggleInList(previous, id))
  }

  function togglePremium(id) {
    setSelectedPremiumIds(previous => toggleInList(previous, id))
  }

  function toggleExtra(id) {
    setSelectedExtras(previous => ({
      ...previous,
      [id]: !previous[id],
    }))
  }

  function handleAddToCart() {
    if (!canAddToCart) {
      return
    }

    const cartKey = buildCartKey({
      mealTypeId: mealType.id,
      proteinId,
      riceId: mealType.allows?.rice ? riceId : null,
      beanId: mealType.allows?.beans ? beanId : null,
      shellId: mealType.allows?.shellChoice ? shellId : null,
      toppings: selectedToppingIds,
      premiums: selectedPremiumIds,
      extras: selectedExtras,
    })

    onAdd(
      {
        Restaurant: data.restaurant.name,
        Address: data.restaurant.address,
        Category: 'Build Your Own',
        'Item Name': `${selectedProtein.name} ${mealType.name}`,
        Description: selectionSummary.join(', '),
        'Price ($)': Number(totals.price.toFixed(2)),
        Calories: Math.round(totals.nutrition.calories),
        'Protein (g)': Math.round(totals.nutrition.protein),
        'Fat (g)': Math.round(totals.nutrition.fat),
        Source: 'Chipotle Builder',
        'Menu URL': data.restaurant.menuUrl,
        'Cart Key': cartKey,
      },
      qty
    )

    onClose()
  }

  function renderQuestion() {
    switch (currentStep?.id) {
      case 'protein':
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {proteins.map(item => {
              const price = mealType.prices?.[item.id] || 0

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleProteinSelect(item.id)}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${itemButtonClass(
                    proteinId === item.id,
                    isLight
                  )}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-sm font-semibold">{formatPrice(price)}</span>
                  </div>
                  {item.includedPremium && (
                    <p className="mt-1 text-xs text-white">Includes guac</p>
                  )}
                </button>
              )
            })}
          </div>
        )

      case 'shell':
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {shells.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleShellSelect(item.id)}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${itemButtonClass(
                  shellId === item.id,
                  isLight
                )}`}
              >
                <span className="font-semibold">{item.name}</span>
              </button>
            ))}
          </div>
        )

      case 'rice':
        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleRiceSelect(NO_RICE_ID)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                riceId === NO_RICE_ID,
                isLight
              )}`}
            >
              No Rice
            </button>
            {rices.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleRiceSelect(item.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                  riceId === item.id,
                  isLight
                )}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )

      case 'beans':
        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleBeanSelect(NO_BEANS_ID)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                beanId === NO_BEANS_ID,
                isLight
              )}`}
            >
              No Beans
            </button>
            {beans.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleBeanSelect(item.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                  beanId === item.id,
                  isLight
                )}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )

      case 'toppings':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {toppings.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleTopping(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                    selectedToppingIds.includes(item.id),
                    isLight
                  )}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={goToNext}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                isLight ? 'bg-black text-white hover:bg-warmgray-dark' : 'bg-white text-black hover:bg-[#f1f1f1]'
              }`}
            >
              Continue
            </button>
          </div>
        )

      case 'premiums':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {premiums.map(item => {
                const isIncluded = item.id === selectedProtein?.includedPremium

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePremium(item.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                      selectedPremiumIds.includes(item.id),
                      isLight
                    )}`}
                  >
                    {item.name}
                    {isIncluded ? ' · Included' : item.price ? ` · ${formatPrice(item.price)}` : ''}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={goToNext}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                isLight ? 'bg-black text-white hover:bg-warmgray-dark' : 'bg-white text-black hover:bg-[#f1f1f1]'
              }`}
            >
              Continue
            </button>
          </div>
        )

      case 'extras':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedProtein?.extraPrice ? (
                <button
                  type="button"
                  onClick={() => toggleExtra('doubleProtein')}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                    selectedExtras.doubleProtein,
                    isLight
                  )}`}
                >
                  Double Protein
                </button>
              ) : null}
              {doubleWrap && mealType?.allows?.doubleWrap ? (
                <button
                  type="button"
                  onClick={() => toggleExtra('doubleWrap')}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                    selectedExtras.doubleWrap,
                    isLight
                  )}`}
                >
                  Double Wrap
                </button>
              ) : null}
              {chips && (
                <button
                  type="button"
                  onClick={() => toggleExtra('chips')}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${questionPillClass(
                    selectedExtras.chips,
                    isLight
                  )}`}
                >
                  Chips
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={goToNext}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                isLight ? 'bg-black text-white hover:bg-warmgray-dark' : 'bg-white text-black hover:bg-[#f1f1f1]'
              }`}
            >
              Finish
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        onClick={event => event.stopPropagation()}
        className={`max-h-[85vh] w-full overflow-y-auto rounded-t-3xl shadow-modal sm:max-h-[90vh] sm:w-[440px] sm:rounded-3xl ${
          isLight ? 'bg-white' : 'border border-white/10 bg-[#111317]'
        }`}
      >
        <div className={`relative aspect-[16/10] overflow-hidden ${
          isLight
            ? 'bg-gradient-to-br from-cream via-ivory to-cream'
            : 'bg-gradient-to-br from-[#16181d] via-[#101216] to-[#181b20]'
        }`}>
          <div className="flex h-full items-center justify-center text-center">
            <span className="text-7xl opacity-90">{MEAL_EMOJIS[mealType.id] || '🍽'}</span>
          </div>
          <button
            onClick={onClose}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${
              isLight ? 'bg-white/90 hover:bg-white' : 'bg-black/50 hover:bg-black/70'
            }`}
          >
            <svg className={`h-4 w-4 ${isLight ? 'text-gray-600' : 'text-white/85'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            isLight ? 'bg-white/90 text-warmgray' : 'bg-black/55 text-white/75'
          }`}>
            via Chipotle Builder
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-1 flex items-start justify-between gap-3">
            <h2 className={`font-display text-xl font-bold leading-tight sm:text-2xl ${isLight ? 'text-gray-900' : 'text-white'}`}>
              {displayItemName}
            </h2>
            {isComplete && (
              <span className="shrink-0 text-lg font-bold text-white">{formatPrice(totals.price)}</span>
            )}
          </div>

          <div className={`mb-3 flex items-center gap-2 text-sm ${isLight ? 'text-black' : 'text-white/80'}`}>
            <span className="font-medium">{data.restaurant.name}</span>
            <span className="h-1 w-1 rounded-full bg-warmgray-light" />
            <span>Build Your Own</span>
          </div>

          {selectionSummary.length > 0 && (
            <p className={`mb-4 text-sm leading-relaxed ${isLight ? 'text-warmgray' : 'text-white/60'}`}>
              {selectionSummary.join(', ')}
            </p>
          )}

          {isComplete ? (
            <>
              {nutrition.length > 0 && (
                <div className="mb-5 flex gap-3">
                  {nutrition.map(item => (
                    <div key={item.label} className="flex-1 rounded-xl bg-black px-3 py-2.5 text-center">
                      <div className="mb-0.5 flex items-center justify-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${item.color}`} />
                        <span className="text-[11px] font-medium uppercase tracking-wider text-white">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-base font-bold text-white">
                        {Math.round(item.value)}{item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={`mb-5 rounded-2xl border p-4 ${
              isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-white/4'
            }`}>
              <StepHeader
                title={currentStep?.title || 'Build'}
                isLight={isLight}
              />
              {renderQuestion()}
            </div>
          )}

          {data.restaurant.address && (
            <div className={`mb-5 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
              isLight ? 'bg-warmgray-light text-white' : 'bg-white/8 text-white/85'
            }`}>
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
              </svg>
              <span>{data.restaurant.address}</span>
            </div>
          )}

          {isComplete ? (
            <div className="flex items-center gap-3">
              <div className={`flex items-center overflow-hidden rounded-xl border ${
                isLight ? 'border-black bg-white' : 'border-white/10 bg-black/35'
              }`}>
                <button
                  onClick={() => setQty(current => Math.max(1, current - 1))}
                  className={`flex h-10 w-10 items-center justify-center transition-colors ${
                    isLight
                      ? 'text-warmgray-dark hover:bg-cream hover:text-gray-900'
                      : 'text-white/70 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className={`w-8 text-center text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>{qty}</span>
                <button
                  onClick={() => setQty(current => current + 1)}
                  className={`flex h-10 w-10 items-center justify-center transition-colors ${
                    isLight
                      ? 'text-warmgray hover:bg-cream hover:text-gray-900'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-terra text-sm font-semibold text-white shadow-sm transition-all hover:bg-warmgray-dark active:scale-[0.98]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
                <span className="font-normal text-white/80">&middot; {(totals.price * qty).toFixed(2)}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={stepIndex === 0 ? onClose : goToPrevious}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  isLight
                    ? 'border-black/10 text-gray-900 hover:bg-cream'
                    : 'border-white/10 text-white hover:bg-white/8'
                }`}
              >
                {stepIndex === 0 ? 'Close' : 'Back'}
              </button>
              <button
                type="button"
                onClick={resetBuilder}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  isLight
                    ? 'border-black/10 text-gray-900 hover:bg-cream'
                    : 'border-white/10 text-white hover:bg-white/8'
                }`}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ChipotleBuilder({ data, onAdd, isLoading = false, theme }) {
  const [activeMealTypeId, setActiveMealTypeId] = useState(null)
  const isLight = theme === 'light'
  const mealTypes = data?.mealTypes || []

  const activeMealType = useMemo(
    () => mealTypes.find(item => item.id === activeMealTypeId) || null,
    [activeMealTypeId, mealTypes]
  )

  return (
    <section className="mb-10 mt-6">
      <div className={`mb-4 flex items-center justify-between gap-3 border-b pb-2 ${isLight ? 'border-black/10' : 'border-cream'}`}>
        <h2 className={`font-display text-xl font-bold sm:text-2xl ${isLight ? 'text-gray-900' : 'text-white'}`}>
          Chipotle
        </h2>
        {isLoading && (
          <span className={`text-xs ${isLight ? 'text-warmgray-dark' : 'text-white/70'}`}>
            Refreshing...
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mealTypes.map(mealType => (
          <ChipotleItemCard
            key={mealType.id}
            mealType={mealType}
            theme={theme}
            onOpen={() => setActiveMealTypeId(mealType.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeMealType && (
          <ChipotleBuilderModal
            key={activeMealType.id}
            mealType={activeMealType}
            data={data}
            onAdd={onAdd}
            onClose={() => setActiveMealTypeId(null)}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
