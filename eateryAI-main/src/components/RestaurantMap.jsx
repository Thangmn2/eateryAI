import { useEffect, useRef, useState } from 'react'
import slugify from '../utils/slugify'

const DEFAULT_CENTER = [33.7419795, -117.8231586]
const DEFAULT_ZOOM = 13
const MAX_MARKERS = 300
const APPLE_MAPS_CDN = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
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

async function fetchRestaurants() {
  const response = await fetch('/api/restaurants')
  if (!response.ok) {
    throw new Error('Failed to load restaurants.')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
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

export default function RestaurantMap({ theme, sidebar = false, onRestaurantClick }) {
  const isLight = theme === 'light'
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersLayerRef = useRef(null)
  const userMarkerRef = useRef(null)
  const userLocationRef = useRef(null)
  const restaurantsRef = useRef([])
  const didAutoZoomRef = useRef(false)
  const iconCacheRef = useRef(new Map())
  const appleAnnotationsRef = useRef([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [totalInView, setTotalInView] = useState(0)
  const [status, setStatus] = useState('loading')
  const [noNearby, setNoNearby] = useState(false)
  const [locationStatus, setLocationStatus] = useState('locating')
  const [mapProvider, setMapProvider] = useState(APPLE_MAPS_TOKEN ? 'apple' : 'leaflet')
  const [appleMapsIssue, setAppleMapsIssue] = useState(() => getAppleMapsTokenIssue(APPLE_MAPS_TOKEN))

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}

    async function initializeAppleMap() {
      const mapkit = await loadMapKit(APPLE_MAPS_TOKEN)
      if (cancelled || !mapContainerRef.current) return

      setMapProvider('apple')

      const map = new mapkit.Map(mapContainerRef.current, {
        center: new mapkit.Coordinate(DEFAULT_CENTER[0], DEFAULT_CENTER[1]),
        isRotationEnabled: false,
        isScrollEnabled: true,
        isZoomEnabled: true,
        showsZoomControl: true,
        showsUserLocationControl: true,
      })

      if (mapkit.ColorSchemes) {
        map.colorScheme = isLight ? mapkit.ColorSchemes.Light : mapkit.ColorSchemes.Dark
      }

      map.showsPointsOfInterest = true
      map.showsUserLocation = true
      mapRef.current = map

      function refreshAppleAnnotations() {
        const region = map.region
        const bounds = getRegionBounds(region)
        const center = region?.center
          ? [region.center.latitude, region.center.longitude]
          : userLocationRef.current || DEFAULT_CENTER

        const { candidates, visible } = selectRestaurantsForRegion(
          restaurantsRef.current,
          bounds,
          center,
          MAX_MARKERS
        )

        setTotalInView(candidates.length)
        setVisibleCount(visible.length)

        if (appleAnnotationsRef.current.length > 0) {
          map.removeAnnotations(appleAnnotationsRef.current)
        }

        appleAnnotationsRef.current = visible.map(restaurant => {
          const annotation = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(restaurant.latitude, restaurant.longitude),
            {
              title: restaurant.restaurant_name,
              subtitle: restaurant.address || restaurant.phone || restaurant.hours || '',
              color: isLight ? '#111827' : '#f59e0b',
              glyphText: createMarkerGlyph(restaurant.restaurant_name),
            }
          )

          annotation.addEventListener('select', () => {
            openRestaurantTarget(restaurant.restaurant_name, onRestaurantClick)
          })

          return annotation
        })

        if (appleAnnotationsRef.current.length > 0) {
          map.addAnnotations(appleAnnotationsRef.current)
          setNoNearby(false)
          return
        }

        if (restaurantsRef.current.length > 0) {
          setNoNearby(true)
        }
      }

      async function loadRestaurantsIntoAppleMap() {
        try {
          restaurantsRef.current = await fetchRestaurants()
          if (cancelled) return
          setStatus('ready')
          refreshAppleAnnotations()
        } catch {
          if (!cancelled) {
            setStatus('error')
          }
        }
      }

      function handleAppleRegionChange() {
        refreshAppleAnnotations()
      }

      map.addEventListener('region-change-end', handleAppleRegionChange)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            if (cancelled) return

            const { latitude, longitude } = position.coords
            userLocationRef.current = [latitude, longitude]
            setLocationStatus('ready')
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

      function getIcon(logoUrl) {
        if (!logoUrl) return null
        if (iconCacheRef.current.has(logoUrl)) return iconCacheRef.current.get(logoUrl)
        const icon = window.L.icon({
          iconUrl: logoUrl,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -28],
          className: 'restaurant-logo-marker',
        })
        iconCacheRef.current.set(logoUrl, icon)
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

        const { candidates, visible } = selectRestaurantsForRegion(
          restaurantsRef.current,
          regionBounds,
          [center.lat, center.lng],
          MAX_MARKERS
        )

        setTotalInView(candidates.length)

        if (candidates.length === 0 && restaurantsRef.current.length > 0) {
          setNoNearby(true)
        }

        visible.forEach(restaurant => {
          const icon = getIcon(restaurant.logo_url)
          const marker = window.L.marker(
            [restaurant.latitude, restaurant.longitude],
            icon ? { icon } : undefined
          )

          marker.bindPopup(createPopupMarkup(restaurant))
          marker.on('mouseover', () => marker.openPopup())
          marker.on('mouseout', () => marker.closePopup())
          marker.on('click', () => openRestaurantTarget(restaurant.restaurant_name, onRestaurantClick))
          marker.addTo(markersLayerRef.current)
        })

        setVisibleCount(visible.length)
        if (visible.length > 0) {
          setNoNearby(false)
        }
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
          restaurantsRef.current = await fetchRestaurants()
          if (cancelled) return
          setStatus('ready')
          updateLeafletMarkers()
        } catch {
          if (!cancelled) {
            setStatus('error')
          }
        }
      }

      map.on('moveend zoomend', updateLeafletMarkers)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            if (cancelled) return

            const { latitude, longitude } = position.coords
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
        map.off('moveend zoomend', updateLeafletMarkers)
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
      didAutoZoomRef.current = false
      userLocationRef.current = null
      userMarkerRef.current = null
      appleAnnotationsRef.current = []

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
  }, [isLight, onRestaurantClick])

  function handleRecenter() {
    const map = mapRef.current
    if (!map) return

    if (mapProvider === 'apple') {
      if (userLocationRef.current && window.mapkit) {
        setMapKitRegion(
          window.mapkit,
          map,
          userLocationRef.current[0],
          userLocationRef.current[1],
          0.055
        )
        return
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            userLocationRef.current = [latitude, longitude]
            setLocationStatus('ready')
            if (window.mapkit) {
              setMapKitRegion(window.mapkit, map, latitude, longitude, 0.055)
            }
          },
          () => {
            setLocationStatus('unavailable')
            if (window.mapkit) {
              setMapKitRegion(window.mapkit, map, DEFAULT_CENTER[0], DEFAULT_CENTER[1], 0.11)
            }
          },
          { enableHighAccuracy: true, timeout: 8000 }
        )
      }

      return
    }

    if (userLocationRef.current) {
      map.setView(userLocationRef.current, Math.max(map.getZoom(), 14))
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup()
      }
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          map.setView([latitude, longitude], 14)

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
          } else {
            userMarkerRef.current = window.L.marker([latitude, longitude], {
              icon: userIcon,
              zIndexOffset: 2000,
            })
              .addTo(map)
              .bindPopup('You are here')
          }

          userLocationRef.current = [latitude, longitude]
          setLocationStatus('ready')
          if (userMarkerRef.current) userMarkerRef.current.openPopup()
        },
        () => {
          setLocationStatus('unavailable')
          map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }
  }

  return (
    <section className={`relative z-0 ${sidebar ? '' : 'h-full'}`}>
      {!sidebar && (
        <div className={`absolute left-4 bottom-4 z-[2000] flex items-center gap-3 rounded-full px-4 py-2 text-xs font-medium shadow-sm backdrop-blur ${
          isLight ? 'bg-white/85' : 'bg-black/45'
        }`}>
          <div className={isLight ? 'text-gray-800' : 'text-white'}>
            Showing {visibleCount} restaurants near this area
          </div>
          <div className={isLight ? 'text-gray-600' : 'text-white/75'}>
            In view: {totalInView}
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className={`absolute left-4 top-4 z-[2000] text-xs ${isLight ? 'text-red-600' : 'text-red-400'}`}>
          Could not load restaurants from the server.
        </div>
      )}
      {status !== 'error' && !APPLE_MAPS_TOKEN && (
        <div className={`absolute left-4 top-4 z-[2000] text-xs ${isLight ? 'text-warmgray-dark' : 'text-white/70'}`}>
          Apple Maps is ready once `VITE_APPLE_MAPS_TOKEN` is added. Using OpenStreetMap for now.
        </div>
      )}
      {status !== 'error' && APPLE_MAPS_TOKEN && mapProvider === 'leaflet-fallback' && (
        <div className={`absolute left-4 top-4 z-[2000] max-w-[28rem] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          {appleMapsIssue || 'Apple Maps could not initialize, so the map fell back to OpenStreetMap.'}
        </div>
      )}
      {locationStatus === 'unavailable' && (
        <div className={`absolute left-4 ${(!APPLE_MAPS_TOKEN || mapProvider === 'leaflet-fallback') ? 'top-10' : 'top-4'} z-[2000] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          Location access is off, so your pin could not be shown.
        </div>
      )}
      {locationStatus === 'unsupported' && (
        <div className={`absolute left-4 ${(!APPLE_MAPS_TOKEN || mapProvider === 'leaflet-fallback') ? 'top-10' : 'top-4'} z-[2000] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          This browser does not support location detection.
        </div>
      )}
      {noNearby && (
        <div className={`absolute left-4 ${
          locationStatus === 'ready' || locationStatus === 'locating'
            ? ((!APPLE_MAPS_TOKEN || mapProvider === 'leaflet-fallback') ? 'top-10' : 'top-4')
            : ((!APPLE_MAPS_TOKEN || mapProvider === 'leaflet-fallback') ? 'top-16' : 'top-10')
        } z-[2000] text-xs ${isLight ? 'text-warmgray-dark' : 'text-white/70'}`}>
          No restaurants were found in this area from the current dataset.
        </div>
      )}
      <div
        className={`relative isolate z-0 overflow-hidden ${sidebar ? 'shadow-card' : 'h-full'} ${
          sidebar
            ? isLight
              ? 'rounded-2xl border border-black/10 bg-white lg:rounded-r-none lg:border-r-0'
              : 'rounded-2xl border border-white/10 bg-[#111317] lg:rounded-r-none lg:border-r-0'
            : isLight
              ? 'rounded-2xl border border-black/10 bg-white'
              : 'rounded-2xl border border-white/10 bg-[#111317]'
        }`}
      >
        <div
          ref={mapContainerRef}
          className={`relative z-0 w-full transition-[height] duration-300 ease-out ${
            sidebar
              ? 'h-[420px] lg:h-[calc(100vh-8.5rem)]'
              : 'h-full'
          }`}
        />
        <button
          type="button"
          onClick={handleRecenter}
          className={`absolute right-4 top-4 z-10 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition ${
            isLight
              ? 'bg-white/90 text-gray-800 hover:bg-white'
              : 'bg-[#1f232b]/90 text-white hover:bg-[#1f232b]'
          }`}
        >
          Back to my location
        </button>
      </div>
    </section>
  )
}
