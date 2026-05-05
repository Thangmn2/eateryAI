import { useEffect, useRef, useState } from 'react'
import slugify from '../utils/slugify'

const DEFAULT_CENTER = [33.7419795, -117.8231586]
const DEFAULT_ZOOM = 13
const MAX_MARKERS = 50
const APPLE_MAPS_CDN = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
const SHOW_APPLE_POINTS_OF_INTEREST = false
const SHOW_APPLE_USER_LOCATION = true
const LIGHT_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
}
const DARK_TILE_LAYER = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
}
const APPLE_MAPS_TOKEN =
  import.meta.env.VITE_APPLE_MAPS_TOKEN?.trim() ||
  import.meta.env.VITE_APPLE_MAPKIT_TOKEN?.trim() ||
  ''

function decodeJwtPayload(token) {
  try {
    return JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

function hostnameMatchesTokenOrigin(hostname, originPattern) {
  if (!originPattern || originPattern === '*') return true

  const normalizedHostname = hostname.toLowerCase()
  return originPattern
    .split(',')
    .map(part => part.trim().toLowerCase())
    .filter(Boolean)
    .some(pattern => {
      if (pattern.startsWith('*.')) {
        const suffix = pattern.slice(1)
        return normalizedHostname.endsWith(suffix)
      }

      return normalizedHostname === pattern
    })
}

function getAppleMapsTokenIssue(token) {
  if (typeof window === 'undefined' || !token) return ''

  const payload = decodeJwtPayload(token)
  if (!payload?.origin) return ''

  if (hostnameMatchesTokenOrigin(window.location.hostname, payload.origin)) {
    return ''
  }

  return `This Apple Maps token only allows ${payload.origin}, so it will not initialize on ${window.location.hostname}.`
}

function distanceSq(a, b) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  return dx * dx + dy * dy
}

function getRestaurantHashTarget(restaurantName) {
  const slug = slugify(restaurantName)
  return {
    mainId: `restaurant-${slug}`,
    menufyId: `menufy-restaurant-${slug}`,
  }
}

function openRestaurantTarget(restaurantName, onRestaurantClick) {
  if (onRestaurantClick) {
    onRestaurantClick(restaurantName)
    return
  }

  const { mainId, menufyId } = getRestaurantHashTarget(restaurantName)
  if (document.getElementById(menufyId)) {
    window.location.hash = `#${menufyId}`
  } else if (document.getElementById(mainId)) {
    window.location.hash = `#${mainId}`
  } else {
    window.location.hash = `#${menufyId}`
  }
}

function createAppleMapsLink(restaurant) {
  const parts = [restaurant.restaurant_name, restaurant.address, restaurant.city, restaurant.state]
    .filter(Boolean)
    .join(', ')

  return `https://maps.apple.com/?q=${encodeURIComponent(parts || restaurant.restaurant_name)}`
}

function createPopupMarkup(restaurant) {
  const phone = restaurant.phone ? `<div><strong>Phone:</strong> ${restaurant.phone}</div>` : ''
  const hours = restaurant.hours ? `<div><strong>Hours:</strong> ${restaurant.hours}</div>` : ''
  const address = restaurant.address ? `<div><strong>Address:</strong> ${restaurant.address}</div>` : ''

  return `
    <div style="min-width: 200px;">
      <div style="font-weight: 700; margin-bottom: 4px;">${restaurant.restaurant_name}</div>
      ${phone}
      ${hours}
      ${address}
      <div style="margin-top: 8px;">
        <a
          href="${createAppleMapsLink(restaurant)}"
          target="_blank"
          rel="noreferrer"
          style="font-weight: 600; color: #2563eb; text-decoration: none;"
        >
          Open in Apple Maps
        </a>
      </div>
    </div>
  `
}

function createMarkerGlyph(name) {
  return name
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 3)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image could not be loaded.'))
    image.src = url
  })
}

async function createApplePinImageUrl(logoUrl) {
  if (typeof window === 'undefined' || typeof logoUrl !== 'string' || !logoUrl.startsWith('http')) {
    return ''
  }

  const image = await loadImageElement(logoUrl)
  const canvas = document.createElement('canvas')
  canvas.width = 76
  canvas.height = 96
  const context = canvas.getContext('2d')

  if (!context) {
    return ''
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  context.save()
  context.translate(canvas.width / 2, 72)
  context.rotate(Math.PI / 4)
  context.fillStyle = '#ffffff'
  context.fillRect(-10, -10, 20, 20)
  context.restore()

  context.beginPath()
  context.arc(canvas.width / 2, 34, 26, 0, Math.PI * 2)
  context.fillStyle = '#ffffff'
  context.shadowColor = 'rgba(15, 23, 42, 0.28)'
  context.shadowBlur = 18
  context.shadowOffsetY = 8
  context.fill()
  context.shadowColor = 'transparent'

  context.save()
  context.beginPath()
  context.arc(canvas.width / 2, 34, 21.5, 0, Math.PI * 2)
  context.closePath()
  context.clip()
  context.drawImage(image, 16.5, 12.5, 43, 43)
  context.restore()

  context.beginPath()
  context.arc(canvas.width / 2, 34, 23, 0, Math.PI * 2)
  context.lineWidth = 4
  context.strokeStyle = '#ffffff'
  context.stroke()

  return canvas.toDataURL('image/png')
}

function isValidRestaurantCoordinate(restaurant) {
  return Number.isFinite(restaurant.latitude) && Number.isFinite(restaurant.longitude)
}

function getRegionBounds(region) {
  if (!region?.center || !region?.span) {
    return null
  }

  const halfLat = (region.span.latitudeDelta || 0) / 2
  const halfLng = (region.span.longitudeDelta || 0) / 2

  return {
    north: region.center.latitude + halfLat,
    south: region.center.latitude - halfLat,
    east: region.center.longitude + halfLng,
    west: region.center.longitude - halfLng,
  }
}

function isCoordinateInBounds(latitude, longitude, bounds) {
  if (!bounds) return true

  const withinLat = latitude >= bounds.south && latitude <= bounds.north
  if (!withinLat) return false

  if (bounds.west <= bounds.east) {
    return longitude >= bounds.west && longitude <= bounds.east
  }

  return longitude >= bounds.west || longitude <= bounds.east
}

function selectRestaurantsForRegion(restaurants, bounds, center, maxMarkers = MAX_MARKERS) {
  const candidates = restaurants.filter(restaurant => {
    if (!isValidRestaurantCoordinate(restaurant)) return false
    return isCoordinateInBounds(restaurant.latitude, restaurant.longitude, bounds)
  })

  const origin = center || DEFAULT_CENTER
  const visible = candidates
    .map(restaurant => ({
      restaurant,
      distance: distanceSq([restaurant.latitude, restaurant.longitude], origin),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxMarkers)
    .map(entry => entry.restaurant)

  return {
    candidates,
    visible,
  }
}

function normalizeSearchValue(value) {
  return String(value || '').trim().toLowerCase()
}

function restaurantMatchesSearch(restaurant, query) {
  if (!query) return true

  const haystack = [
    restaurant.restaurant_name,
    restaurant.address,
    restaurant.city,
    restaurant.state,
    ...(restaurant.cuisine_tags || []),
    ...(restaurant.attribute_tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

function restaurantMatchesTagFilters(restaurant, selectedCuisineTags, selectedAttributeTags) {
  const cuisineTags = restaurant.cuisine_tags || []
  const attributeTags = restaurant.attribute_tags || []

  const matchesCuisine = selectedCuisineTags.length === 0 ||
    selectedCuisineTags.some(tag => cuisineTags.includes(tag))
  const matchesAttributes = selectedAttributeTags.length === 0 ||
    selectedAttributeTags.some(tag => attributeTags.includes(tag))

  return matchesCuisine && matchesAttributes
}

function filterRestaurants(restaurants, query, selectedCuisineTags, selectedAttributeTags) {
  return restaurants.filter(restaurant =>
    restaurantMatchesSearch(restaurant, query) &&
    restaurantMatchesTagFilters(restaurant, selectedCuisineTags, selectedAttributeTags)
  )
}

function buildSearchSuggestions(restaurants, query, maxSuggestions = 6) {
  if (!query) return []

  const normalizedQuery = normalizeSearchValue(query)
  const seen = new Set()

  return restaurants
    .filter(restaurant => restaurantMatchesSearch(restaurant, normalizedQuery))
    .filter(restaurant => {
      const key = restaurant.restaurant_name
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, maxSuggestions)
}

function collectTagOptions(restaurants, key) {
  return [...new Set(
    restaurants.flatMap(restaurant => Array.isArray(restaurant[key]) ? restaurant[key] : [])
  )].sort((a, b) => a.localeCompare(b))
}

async function fetchRestaurants({ latitude, longitude, bounds, query } = {}) {
  const searchParams = new URLSearchParams({
    limit: String(MAX_MARKERS),
  })

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    searchParams.set('user_latitude', String(latitude))
    searchParams.set('user_longitude', String(longitude))
  }

  if (bounds) {
    searchParams.set('north', String(bounds.north))
    searchParams.set('south', String(bounds.south))
    searchParams.set('east', String(bounds.east))
    searchParams.set('west', String(bounds.west))
  }

  if (query) {
    searchParams.set('query', query)
  }

  const response = await fetch(`/api/restaurants?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to load restaurants.')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

async function fetchRestaurantsForViewport({ latitude, longitude, bounds, query } = {}) {
  const primaryResults = await fetchRestaurants({ latitude, longitude, bounds, query })

  if (query) {
    return primaryResults
  }

  if (
    primaryResults.length > 0 ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return primaryResults
  }

  return fetchRestaurants({ latitude, longitude, query })
}

function setMapKitRegion(mapkit, map, latitude, longitude, span = 0.075) {
  const coordinate = new mapkit.Coordinate(latitude, longitude)

  try {
    map.setRegionAnimated(
      new mapkit.CoordinateRegion(
        coordinate,
        new mapkit.CoordinateSpan(span, span)
      ),
      true
    )
  } catch {
    map.setCenterAnimated(coordinate, true)
  }
}

function loadMapKit(token) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('MapKit JS is only available in the browser.'))
  }

  if (!token) {
    return Promise.reject(new Error('Missing Apple Maps token.'))
  }

  if (window.__eateryMapKitPromise) {
    return window.__eateryMapKitPromise
  }

  window.__eateryMapKitPromise = new Promise((resolve, reject) => {
    function finalizeInitialization() {
      if (!window.mapkit) {
        reject(new Error('MapKit JS did not load correctly.'))
        return
      }

      if (window.__eateryMapKitInitialized) {
        resolve(window.mapkit)
        return
      }

      const handleConfiguration = () => {
        window.__eateryMapKitInitialized = true
        resolve(window.mapkit)
      }

      const handleError = () => {
        window.__eateryMapKitPromise = null
        reject(new Error('Apple Maps could not be initialized.'))
      }

      window.mapkit.addEventListener('configuration-change', handleConfiguration, { once: true })
      window.mapkit.addEventListener('error', handleError, { once: true })
      window.mapkit.init({
        authorizationCallback(done) {
          done(token)
        },
        language: 'en-US',
        libraries: ['full-map', 'annotations', 'user-location'],
      })
    }

    if (window.mapkit) {
      finalizeInitialization()
      return
    }

    const existingScript = document.getElementById('apple-mapkit-script')
    if (existingScript) {
      existingScript.addEventListener('load', finalizeInitialization, { once: true })
      existingScript.addEventListener('error', () => reject(new Error('MapKit JS failed to load.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'apple-mapkit-script'
    script.src = APPLE_MAPS_CDN
    script.async = true
    script.crossOrigin = 'anonymous'
    script.addEventListener('load', finalizeInitialization, { once: true })
    script.addEventListener('error', () => reject(new Error('MapKit JS failed to load.')), { once: true })
    document.head.appendChild(script)
  })

  return window.__eateryMapKitPromise
}

export default function RestaurantMap({ theme, sidebar = false, onRestaurantClick, onOpenMenu }) {
  const isLight = theme === 'light'
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersLayerRef = useRef(null)
  const userMarkerRef = useRef(null)
  const userLocationRef = useRef(null)
  const restaurantsRef = useRef([])
  const iconCacheRef = useRef(new Map())
  const applePinImageCacheRef = useRef(new Map())
  const appleAnnotationsRef = useRef([])
  const refreshViewportRef = useRef(() => {})
  const reloadRestaurantsRef = useRef(() => {})
  const onRestaurantClickRef = useRef(onRestaurantClick)
  const suppressViewportRefreshRef = useRef(false)
  const searchQueryRef = useRef('')
  const selectedCuisineTagsRef = useRef([])
  const selectedAttributeTagsRef = useRef([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [totalInView, setTotalInView] = useState(0)
  const [status, setStatus] = useState('loading')
  const [noNearby, setNoNearby] = useState(false)
  const [locationStatus, setLocationStatus] = useState('locating')
  const [mapProvider, setMapProvider] = useState(APPLE_MAPS_TOKEN ? 'apple' : 'leaflet')
  const [appleMapsIssue, setAppleMapsIssue] = useState(() => getAppleMapsTokenIssue(APPLE_MAPS_TOKEN))
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false)
  const [searchAreaPending, setSearchAreaPending] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [cuisineDropdownOpen, setCuisineDropdownOpen] = useState(false)
  const [attributeDropdownOpen, setAttributeDropdownOpen] = useState(false)
  const [availableCuisineTags, setAvailableCuisineTags] = useState([])
  const [availableAttributeTags, setAvailableAttributeTags] = useState([])
  const [selectedCuisineTags, setSelectedCuisineTags] = useState([])
  const [selectedAttributeTags, setSelectedAttributeTags] = useState([])

  function syncTagOptions(restaurants) {
    setAvailableCuisineTags(collectTagOptions(restaurants, 'cuisine_tags'))
    setAvailableAttributeTags(collectTagOptions(restaurants, 'attribute_tags'))
  }

  function getFilteredRestaurants(restaurants) {
    return filterRestaurants(
      restaurants,
      searchQueryRef.current,
      selectedCuisineTagsRef.current,
      selectedAttributeTagsRef.current
    )
  }

  useEffect(() => {
    onRestaurantClickRef.current = onRestaurantClick
  }, [onRestaurantClick])

  useEffect(() => {
    searchQueryRef.current = normalizeSearchValue(searchQuery)
    selectedCuisineTagsRef.current = selectedCuisineTags
    selectedAttributeTagsRef.current = selectedAttributeTags
    refreshViewportRef.current()
  }, [searchQuery, selectedCuisineTags, selectedAttributeTags])

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}

    async function initializeAppleMap() {
      const mapkit = await loadMapKit(APPLE_MAPS_TOKEN)
      if (cancelled || !mapContainerRef.current) return

      setMapProvider('apple')

      const map = new mapkit.Map(mapContainerRef.current, {
        center: new mapkit.Coordinate(DEFAULT_CENTER[0], DEFAULT_CENTER[1]),
        colorScheme: isLight ? mapkit.Map.ColorSchemes.Light : mapkit.Map.ColorSchemes.Dark,
        isRotationEnabled: false,
        isScrollEnabled: true,
        isZoomEnabled: true,
        showsZoomControl: true,
        showsUserLocationControl: true,
      })

      // MapKit JS only exposes POIs as a broad all-or-nothing layer.
      // Keep this false if you want only MongoDB restaurant pins on the map.
      map.showsPointsOfInterest = SHOW_APPLE_POINTS_OF_INTEREST
      map.showsUserLocation = SHOW_APPLE_USER_LOCATION
      mapRef.current = map

      async function loadRestaurantsIntoAppleMap() {
        try {
          const region = map.region
          const nextLocation = userLocationRef.current
          const activeQuery = searchQueryRef.current
          restaurantsRef.current = await fetchRestaurantsForViewport({
            latitude: nextLocation?.[0] ?? region?.center?.latitude,
            longitude: nextLocation?.[1] ?? region?.center?.longitude,
            bounds: getRegionBounds(region),
            query: activeQuery || undefined,
          })
          if (cancelled) return
          syncTagOptions(restaurantsRef.current)
          setStatus('ready')
          setSearchAreaPending(false)
          refreshAppleAnnotations()
        } catch {
          if (!cancelled) {
            setStatus('error')
          }
        }
      }

      async function refreshAppleAnnotations() {
        const region = map.region
        const bounds = getRegionBounds(region)
        const center = region?.center
          ? [region.center.latitude, region.center.longitude]
          : userLocationRef.current || DEFAULT_CENTER
        const filteredRestaurants = getFilteredRestaurants(restaurantsRef.current)

        const { candidates, visible } = selectRestaurantsForRegion(
          filteredRestaurants,
          bounds,
          center,
          MAX_MARKERS
        )

        setTotalInView(candidates.length)
        setVisibleCount(visible.length)

        if (appleAnnotationsRef.current.length > 0) {
          map.removeAnnotations(appleAnnotationsRef.current)
        }

        const nextAnnotations = await Promise.all(visible.map(async restaurant => {
          let pinImageUrl = ''

          if (typeof restaurant.logo_url === 'string' && restaurant.logo_url.startsWith('http')) {
            if (applePinImageCacheRef.current.has(restaurant.logo_url)) {
              pinImageUrl = applePinImageCacheRef.current.get(restaurant.logo_url)
            } else {
              try {
                pinImageUrl = await createApplePinImageUrl(restaurant.logo_url)
                applePinImageCacheRef.current.set(restaurant.logo_url, pinImageUrl)
              } catch {
                pinImageUrl = ''
              }
            }
          }

          const annotation = pinImageUrl
            ? new mapkit.ImageAnnotation(
                new mapkit.Coordinate(restaurant.latitude, restaurant.longitude),
                {
                  url: {
                    1: pinImageUrl,
                  },
                  size: { width: 38, height: 48 },
                  title: restaurant.restaurant_name,
                  subtitle: restaurant.address || restaurant.phone || restaurant.hours || '',
                  clusteringIdentifier: 'restaurants',
                }
              )
            : new mapkit.MarkerAnnotation(
                new mapkit.Coordinate(restaurant.latitude, restaurant.longitude),
                {
                  title: restaurant.restaurant_name,
                  subtitle: restaurant.address || restaurant.phone || restaurant.hours || '',
                  color: isLight ? '#111827' : '#f59e0b',
                  glyphText: createMarkerGlyph(restaurant.restaurant_name),
                  clusteringIdentifier: 'restaurants',
                }
              )

          annotation.addEventListener('select', () => {
            openRestaurantTarget(restaurant.restaurant_name, onRestaurantClickRef.current)
          })

          return annotation
        }))

        if (cancelled) return
        appleAnnotationsRef.current = nextAnnotations

        if (appleAnnotationsRef.current.length > 0) {
          map.addAnnotations(appleAnnotationsRef.current)
          setNoNearby(false)
          return
        }

        if (filteredRestaurants.length > 0) {
          setNoNearby(true)
        }
      }

      refreshViewportRef.current = () => {
        void refreshAppleAnnotations()
      }
      reloadRestaurantsRef.current = () => {
        void loadRestaurantsIntoAppleMap()
      }

      function handleAppleRegionChange() {
        if (suppressViewportRefreshRef.current) {
          suppressViewportRefreshRef.current = false
          return
        }

        refreshViewportRef.current()
        setSearchAreaPending(true)
      }

      map.addEventListener('region-change-end', handleAppleRegionChange)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            if (cancelled) return

            const { latitude, longitude } = position.coords
            userLocationRef.current = [latitude, longitude]
            setLocationStatus('ready')
            suppressViewportRefreshRef.current = true
            setMapKitRegion(mapkit, map, latitude, longitude, 0.055)
            void loadRestaurantsIntoAppleMap()
          },
          () => {
            if (cancelled) return

            setLocationStatus('unavailable')
            void loadRestaurantsIntoAppleMap()
          },
          { enableHighAccuracy: true, timeout: 8000 }
        )
      } else {
        setLocationStatus('unsupported')
        void loadRestaurantsIntoAppleMap()
      }

      cleanup = () => {
        map.removeEventListener('region-change-end', handleAppleRegionChange)
        if (appleAnnotationsRef.current.length > 0) {
          map.removeAnnotations(appleAnnotationsRef.current)
          appleAnnotationsRef.current = []
        }
        map.destroy()
        mapRef.current = null
      }
    }

    async function initializeLeafletMap() {
      if (!mapContainerRef.current || mapRef.current || !window.L) return

      if (APPLE_MAPS_TOKEN) {
        setMapProvider('leaflet-fallback')
      } else {
        setMapProvider('leaflet')
      }

      const map = window.L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      const tileConfig = isLight ? LIGHT_TILE_LAYER : DARK_TILE_LAYER
      window.L.tileLayer(tileConfig.url, {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: tileConfig.attribution,
      }).addTo(map)

      const markersLayer = window.L.layerGroup().addTo(map)
      markersLayerRef.current = markersLayer

      function getIcon(logoUrl, restaurantName) {
        const cacheKey = logoUrl || `__fallback__:${restaurantName || ''}`
        if (iconCacheRef.current.has(cacheKey)) return iconCacheRef.current.get(cacheKey)
        const fallbackLabel = createMarkerGlyph(restaurantName || '?')
        const safeLogoUrl = typeof logoUrl === 'string' && logoUrl.startsWith('http')
          ? escapeHtml(logoUrl)
          : ''
        const icon = window.L.divIcon({
          className: 'restaurant-logo-marker',
          html: `
            <span class="restaurant-logo-marker__pin">
              <span class="restaurant-logo-marker__shell">
                ${safeLogoUrl
                  ? `<img src="${safeLogoUrl}" alt="" class="restaurant-logo-marker__image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />`
                  : ''}
                <span class="restaurant-logo-marker__fallback" style="display:${safeLogoUrl ? 'none' : 'flex'};">${escapeHtml(fallbackLabel)}</span>
              </span>
              <span class="restaurant-logo-marker__tail"></span>
            </span>
          `,
          iconSize: [38, 48],
          iconAnchor: [19, 46],
          popupAnchor: [0, -42],
        })
        iconCacheRef.current.set(cacheKey, icon)
        return icon
      }

      function updateLeafletMarkers() {
        if (!markersLayerRef.current) return

        markersLayerRef.current.clearLayers()
        const bounds = map.getBounds()
        const center = map.getCenter()
        const regionBounds = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        }
        const filteredRestaurants = getFilteredRestaurants(restaurantsRef.current)

        const { candidates, visible } = selectRestaurantsForRegion(
          filteredRestaurants,
          regionBounds,
          [center.lat, center.lng],
          MAX_MARKERS
        )

        setTotalInView(candidates.length)

        if (candidates.length === 0 && filteredRestaurants.length > 0) {
          setNoNearby(true)
        }

        visible.forEach(restaurant => {
          const icon = getIcon(restaurant.logo_url, restaurant.restaurant_name)
          const marker = window.L.marker(
            [restaurant.latitude, restaurant.longitude],
            icon ? { icon } : undefined
          )

          marker.bindPopup(createPopupMarkup(restaurant))
          marker.on('mouseover', () => marker.openPopup())
          marker.on('mouseout', () => marker.closePopup())
          marker.on('click', () => openRestaurantTarget(restaurant.restaurant_name, onRestaurantClickRef.current))
          marker.addTo(markersLayerRef.current)
        })

        setVisibleCount(visible.length)
        if (visible.length > 0) {
          setNoNearby(false)
        }
      }

      refreshViewportRef.current = updateLeafletMarkers
      reloadRestaurantsRef.current = () => {
        void loadRestaurantsIntoLeafletMap()
      }

      function setLeafletUserLocation(latitude, longitude) {
        userLocationRef.current = [latitude, longitude]
        setLocationStatus('ready')

        const userIcon = window.L.divIcon({
          className: 'user-location-marker',
          html: '<span class="user-location-pulse"></span><span class="user-location-dot"></span>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        })

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude])
          userMarkerRef.current.setIcon(userIcon)
          return
        }

        userMarkerRef.current = window.L.marker([latitude, longitude], {
          icon: userIcon,
          zIndexOffset: 2000,
        })
          .addTo(map)
          .bindPopup('You are here')
      }

      async function loadRestaurantsIntoLeafletMap() {
        try {
          const mapBounds = map.getBounds()
          const nextLocation = userLocationRef.current
          const activeQuery = searchQueryRef.current
          restaurantsRef.current = await fetchRestaurantsForViewport({
            latitude: nextLocation?.[0] ?? map.getCenter().lat,
            longitude: nextLocation?.[1] ?? map.getCenter().lng,
            bounds: {
              north: mapBounds.getNorth(),
              south: mapBounds.getSouth(),
              east: mapBounds.getEast(),
              west: mapBounds.getWest(),
            },
            query: activeQuery || undefined,
          })
          if (cancelled) return
          syncTagOptions(restaurantsRef.current)
          setStatus('ready')
          setSearchAreaPending(false)
          updateLeafletMarkers()
        } catch {
          if (!cancelled) {
            setStatus('error')
          }
        }
      }

      function handleLeafletViewportChange() {
        if (suppressViewportRefreshRef.current) {
          suppressViewportRefreshRef.current = false
          return
        }

        refreshViewportRef.current()
        setSearchAreaPending(true)
      }

      map.on('moveend zoomend', handleLeafletViewportChange)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            if (cancelled) return

            const { latitude, longitude } = position.coords
            suppressViewportRefreshRef.current = true
            map.setView([latitude, longitude], 14)
            setLeafletUserLocation(latitude, longitude)
            void loadRestaurantsIntoLeafletMap()
          },
          () => {
            if (cancelled) return

            setLocationStatus('unavailable')
            void loadRestaurantsIntoLeafletMap()
          },
          { enableHighAccuracy: true, timeout: 8000 }
        )
      } else {
        setLocationStatus('unsupported')
        void loadRestaurantsIntoLeafletMap()
      }

      mapRef.current = map

      cleanup = () => {
        map.off('moveend zoomend', handleLeafletViewportChange)
        map.remove()
        mapRef.current = null
      }
    }

    async function initializeMap() {
      setStatus('loading')
      setNoNearby(false)
      setVisibleCount(0)
      setTotalInView(0)
      setLocationStatus('locating')
      restaurantsRef.current = []
      userLocationRef.current = null
      userMarkerRef.current = null
      appleAnnotationsRef.current = []
      syncTagOptions([])

      if (APPLE_MAPS_TOKEN) {
        const tokenIssue = getAppleMapsTokenIssue(APPLE_MAPS_TOKEN)
        setAppleMapsIssue(tokenIssue)

        if (tokenIssue) {
          await initializeLeafletMap()
          return
        }

        try {
          await initializeAppleMap()
          return
        } catch {
          if (cancelled) return
          setAppleMapsIssue('Apple Maps could not be initialized with the current token.')
        }
      }

      await initializeLeafletMap()
    }

    void initializeMap()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [isLight])

  function toggleTag(tag, selectedTags, setSelectedTags) {
    setSelectedTags(current =>
      current.includes(tag)
        ? current.filter(value => value !== tag)
        : [...current, tag]
    )
  }

  function clearFilters() {
    setSearchQuery('')
    setSearchSuggestionsOpen(false)
    setSelectedCuisineTags([])
    setSelectedAttributeTags([])
    setCuisineDropdownOpen(false)
    setAttributeDropdownOpen(false)
    reloadRestaurantsRef.current()
  }

  function focusSuggestedRestaurant(restaurant) {
    setSearchQuery(restaurant.restaurant_name || '')
    setSearchSuggestionsOpen(false)
    setSearchAreaPending(false)

    if (!mapRef.current) return

    if (mapProvider === 'apple' && window.mapkit) {
      suppressViewportRefreshRef.current = true
      setMapKitRegion(window.mapkit, mapRef.current, restaurant.latitude, restaurant.longitude, 0.04)
      return
    }

    if (typeof mapRef.current?.setView === 'function') {
      suppressViewportRefreshRef.current = true
      mapRef.current.setView([restaurant.latitude, restaurant.longitude], 15)
    }
  }

  function executeSearchInCurrentArea(nextQuery = searchQuery) {
    setSearchQuery(nextQuery)
    setSearchSuggestionsOpen(false)
    setSearchAreaPending(false)
    reloadRestaurantsRef.current()
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCuisineTags.length > 0 ||
    selectedAttributeTags.length > 0

  const statusOffsetClass = filtersOpen ? 'top-[13rem]' : 'top-24'
  const searchSuggestions = buildSearchSuggestions(restaurantsRef.current, searchQuery)

  return (
    <section className={`relative z-0 ${sidebar ? '' : 'mx-auto w-full max-w-[1760px] px-6 pb-8 pt-10'}`}>
      {!sidebar && (
        <div className={`absolute left-10 bottom-12 z-[2000] flex items-center gap-3 rounded-full px-4 py-2 text-xs font-medium shadow-sm backdrop-blur ${
          isLight ? 'bg-white/85 text-gray-900' : 'bg-black/55 text-white'
        }`}>
          <div>
            Showing {visibleCount} restaurants
          </div>
          <div className={isLight ? 'text-gray-600' : 'text-white/75'}>
            In view: {totalInView}
          </div>
        </div>
      )}
      {!sidebar && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMenu}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                isLight
                  ? 'bg-black text-white hover:bg-black/85'
                  : 'bg-white text-black hover:bg-white/85'
              }`}
            >
              Hide Map
            </button>
            <button
              type="button"
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                isLight
                  ? 'border border-black/10 bg-white text-black hover:bg-black/5'
                  : 'border border-white/10 bg-[#12151b] text-white hover:bg-white/10'
              }`}
            >
              All Restaurants
            </button>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className={`absolute left-10 ${statusOffsetClass} z-[2000] text-xs ${isLight ? 'text-red-600' : 'text-red-400'}`}>
          Could not load restaurants from the server.
        </div>
      )}
      {status !== 'error' && !APPLE_MAPS_TOKEN && (
        <div className={`absolute left-10 ${statusOffsetClass} z-[2000] text-xs ${isLight ? 'text-warmgray-dark' : 'text-white/70'}`}>
          Apple Maps is ready once `VITE_APPLE_MAPS_TOKEN` is added. Using OpenStreetMap for now.
        </div>
      )}
      {status !== 'error' && APPLE_MAPS_TOKEN && mapProvider === 'leaflet-fallback' && (
        <div className={`absolute left-10 ${statusOffsetClass} z-[2000] max-w-[28rem] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          {appleMapsIssue || 'Apple Maps could not initialize, so the map fell back to OpenStreetMap.'}
        </div>
      )}
      {locationStatus === 'unavailable' && (
        <div className={`absolute left-10 ${status === 'error' ? 'top-[14.75rem]' : 'top-[14.25rem]'} z-[2000] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          Location access is off, so your pin could not be shown.
        </div>
      )}
      {locationStatus === 'unsupported' && (
        <div className={`absolute left-10 ${status === 'error' ? 'top-[14.75rem]' : 'top-[14.25rem]'} z-[2000] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          This browser does not support location detection.
        </div>
      )}
      {noNearby && (
        <div className={`absolute left-10 top-[15.75rem] z-[2000] text-xs ${isLight ? 'text-warmgray-dark' : 'text-white/70'}`}>
          No restaurants were found in this area from the current dataset.
        </div>
      )}
      {searchAreaPending && (
        <div className="absolute left-1/2 top-[10.5rem] z-[2200] -translate-x-1/2">
          <button
            type="button"
            onClick={() => executeSearchInCurrentArea(searchQuery)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition ${
              isLight
                ? 'bg-black text-white hover:bg-black/85'
                : 'bg-white text-black hover:bg-white/85'
            }`}
          >
            Search this area
          </button>
        </div>
      )}
      <div
        className={`relative isolate z-0 overflow-hidden ${sidebar ? 'shadow-card' : 'min-h-[72vh] shadow-card'} ${
          sidebar
            ? isLight
              ? 'rounded-2xl border border-black/10 bg-white lg:rounded-r-none lg:border-r-0'
              : 'rounded-2xl border border-white/10 bg-[#111317] lg:rounded-r-none lg:border-r-0'
            : isLight
              ? 'rounded-[32px] border border-black/10 bg-white'
              : 'rounded-[32px] border border-white/10 bg-[#111317]'
        }`}
      >
        <div className={`absolute left-5 top-5 z-[2100] w-[min(52rem,calc(100%-5rem))] rounded-[24px] border px-4 py-3 shadow-2xl backdrop-blur-xl ${
          isLight
            ? 'border-black/10 bg-white/90'
            : 'border-white/10 bg-[#171a21]/92'
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`relative flex min-w-[17rem] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 ${
              isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0f1218]'
            }`}>
              <span className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/55'}`}>
                Search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={event => {
                  setSearchQuery(event.target.value)
                  setSearchSuggestionsOpen(true)
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    executeSearchInCurrentArea(event.currentTarget.value)
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setSearchSuggestionsOpen(true)
                  }
                }}
                onBlur={() => {
                  window.setTimeout(() => setSearchSuggestionsOpen(false), 120)
                }}
                placeholder="Restaurant, cuisine, address..."
                className={`w-full bg-transparent text-sm outline-none ${
                  isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-white/35'
                }`}
              />
              {searchSuggestionsOpen && searchQuery.trim().length > 0 && (
                <div className={`absolute left-0 right-0 top-[calc(100%+0.65rem)] z-[2300] overflow-hidden rounded-2xl border shadow-2xl ${
                  isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0f1218]'
                }`}>
                  <button
                    type="button"
                    onMouseDown={() => executeSearchInCurrentArea(searchQuery)}
                    className={`flex w-full flex-col items-start gap-0.5 border-b px-4 py-3 text-left transition ${
                      isLight
                        ? 'border-black/5 hover:bg-black/5'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      Search for "{searchQuery}"
                    </span>
                    <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/55'}`}>
                      Search within the area shown on the map right now
                    </span>
                  </button>
                  {searchSuggestions.map(restaurant => (
                    <button
                      key={`${restaurant.restaurant_name}-${restaurant.address}`}
                      type="button"
                      onMouseDown={() => focusSuggestedRestaurant(restaurant)}
                      className={`flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition ${
                        isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {restaurant.restaurant_name}
                      </span>
                      <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/55'}`}>
                        {[restaurant.address, restaurant.city, restaurant.state].filter(Boolean).join(', ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(current => !current)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                isLight
                  ? 'border-black/10 bg-white text-black hover:bg-black/5'
                  : 'border-white/10 bg-[#0f1218] text-white hover:bg-white/10'
              }`}
            >
              {filtersOpen ? 'Hide filters' : 'Show filters'}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                hasActiveFilters
                  ? isLight
                    ? 'border-black/10 bg-black text-white hover:bg-black/85'
                    : 'border-white/10 bg-white text-black hover:bg-white/85'
                  : isLight
                    ? 'border-black/10 bg-white text-gray-400'
                    : 'border-white/10 bg-[#0f1218] text-white/35'
              }`}
            >
              Clear filters
            </button>
          </div>
          {filtersOpen && (
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCuisineDropdownOpen(current => !current)
                    setAttributeDropdownOpen(false)
                  }}
                  className={`flex min-w-[13rem] items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    isLight
                      ? 'border-black/10 bg-white text-black hover:bg-black/5'
                      : 'border-white/10 bg-[#0f1218] text-white hover:bg-white/10'
                  }`}
                >
                  <span>
                    Cuisine
                    {selectedCuisineTags.length > 0 ? ` (${selectedCuisineTags.length})` : ''}
                  </span>
                  <span className="text-xs">{cuisineDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {cuisineDropdownOpen && (
                  <div className={`absolute left-0 top-[calc(100%+0.5rem)] z-[2200] w-[20rem] rounded-2xl border p-3 shadow-2xl ${
                    isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0f1218]'
                  }`}>
                    <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                      {availableCuisineTags.length === 0 ? (
                        <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/45'}`}>
                          No cuisine tags available in this area yet.
                        </div>
                      ) : availableCuisineTags.map(tag => (
                        <label
                          key={tag}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm ${
                            isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCuisineTags.includes(tag)}
                            onChange={() => toggleTag(tag, selectedCuisineTags, setSelectedCuisineTags)}
                            className="h-4 w-4 rounded border-white/20"
                          />
                          <span className={isLight ? 'text-gray-800' : 'text-white/90'}>{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setAttributeDropdownOpen(current => !current)
                    setCuisineDropdownOpen(false)
                  }}
                  className={`flex min-w-[13rem] items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    isLight
                      ? 'border-black/10 bg-white text-black hover:bg-black/5'
                      : 'border-white/10 bg-[#0f1218] text-white hover:bg-white/10'
                  }`}
                >
                  <span>
                    Attributes
                    {selectedAttributeTags.length > 0 ? ` (${selectedAttributeTags.length})` : ''}
                  </span>
                  <span className="text-xs">{attributeDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {attributeDropdownOpen && (
                  <div className={`absolute left-0 top-[calc(100%+0.5rem)] z-[2200] w-[20rem] rounded-2xl border p-3 shadow-2xl ${
                    isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0f1218]'
                  }`}>
                    <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                      {availableAttributeTags.length === 0 ? (
                        <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/45'}`}>
                          No attribute tags available in this area yet.
                        </div>
                      ) : availableAttributeTags.map(tag => (
                        <label
                          key={tag}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm ${
                            isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAttributeTags.includes(tag)}
                            onChange={() => toggleTag(tag, selectedAttributeTags, setSelectedAttributeTags)}
                            className="h-4 w-4 rounded border-white/20"
                          />
                          <span className={isLight ? 'text-gray-800' : 'text-white/90'}>{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          ref={mapContainerRef}
          className={`relative z-0 w-full transition-[height] duration-300 ease-out ${
            sidebar
              ? 'h-[420px] lg:h-[calc(100vh-8.5rem)]'
              : 'h-[72vh]'
          }`}
        />
      </div>
    </section>
  )
}
