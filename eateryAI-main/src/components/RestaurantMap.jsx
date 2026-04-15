import { useEffect, useRef, useState } from 'react'
import slugify from '../utils/slugify'

const DEFAULT_CENTER = [33.7419795, -117.8231586]
const DEFAULT_ZOOM = 13
const MAX_MARKERS = 300

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
  const [visibleCount, setVisibleCount] = useState(0)
  const [totalInView, setTotalInView] = useState(0)
  const [status, setStatus] = useState('loading')
  const [noNearby, setNoNearby] = useState(false)
  const [locationStatus, setLocationStatus] = useState('locating')

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    if (!window.L) return

    const map = window.L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
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

    function buildPopup(r) {
      const phone = r.phone ? `<div><strong>Phone:</strong> ${r.phone}</div>` : ''
      const hours = r.hours ? `<div><strong>Hours:</strong> ${r.hours}</div>` : ''
      const address = r.address ? `<div><strong>Address:</strong> ${r.address}</div>` : ''
      return `
        <div style="min-width: 200px;">
          <div style="font-weight: 700; margin-bottom: 4px;">${r.restaurant_name}</div>
          ${phone}
          ${hours}
          ${address}
        </div>
      `
    }

    function distanceSq(a, b) {
      const dx = a[0] - b[0]
      const dy = a[1] - b[1]
      return dx * dx + dy * dy
    }

    function updateMarkers() {
      if (!markersLayerRef.current) return
      markersLayerRef.current.clearLayers()
      const bounds = map.getBounds()
      const center = map.getCenter()
      const candidates = restaurantsRef.current.filter(r => {
        if (!Number.isFinite(r.latitude) || !Number.isFinite(r.longitude)) return false
        return bounds.contains([r.latitude, r.longitude])
      })

      setTotalInView(candidates.length)

      if (candidates.length === 0 && restaurantsRef.current.length > 0 && !didAutoZoomRef.current) {
        const nearest = restaurantsRef.current
          .filter(r => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
          .map(r => ({ r, d: distanceSq([r.latitude, r.longitude], [center.lat, center.lng]) }))
          .sort((a, b) => a.d - b.d)[0]

        if (nearest?.r) {
          didAutoZoomRef.current = true
          setNoNearby(true)
          map.setView([nearest.r.latitude, nearest.r.longitude], 12)
          return
        }
      }

      const centered = candidates
        .map(r => ({ r, d: distanceSq([r.latitude, r.longitude], [center.lat, center.lng]) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, MAX_MARKERS)

      centered.forEach(({ r }) => {
        const icon = getIcon(r.logo_url)
        const marker = window.L.marker([r.latitude, r.longitude], icon ? { icon } : undefined)
        marker.bindPopup(buildPopup(r))
        marker.on('mouseover', () => marker.openPopup())
        marker.on('mouseout', () => marker.closePopup())
        marker.on('click', () => {
          if (onRestaurantClick) {
            onRestaurantClick(r.restaurant_name)
          } else {
            const slug = slugify(r.restaurant_name)
            const mainId = `restaurant-${slug}`
            const menufyId = `menufy-restaurant-${slug}`
            if (document.getElementById(menufyId)) {
              window.location.hash = `#${menufyId}`
            } else if (document.getElementById(mainId)) {
              window.location.hash = `#${mainId}`
            } else {
              window.location.hash = `#${menufyId}`
            }
          }
        })
        marker.addTo(markersLayerRef.current)
      })

      setVisibleCount(centered.length)
      if (centered.length > 0) {
        setNoNearby(false)
      }
    }

    map.on('moveend zoomend', updateMarkers)

    function setUserLocation(lat, lng) {
      userLocationRef.current = [lat, lng]
      setLocationStatus('ready')

      const userIcon = window.L.divIcon({
        className: 'user-location-marker',
        html: '<span class="user-location-pulse"></span><span class="user-location-dot"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      })

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([lat, lng])
        userMarkerRef.current.setIcon(userIcon)
        return
      }

      userMarkerRef.current = window.L.marker([lat, lng], {
        icon: userIcon,
        zIndexOffset: 2000,
      })
        .addTo(map)
        .bindPopup('You are here')
    }

    async function loadRestaurants() {
      try {
        const response = await fetch('/api/restaurants')
        if (!response.ok) {
          throw new Error('Failed to load restaurants.')
        }
        const data = await response.json()
        restaurantsRef.current = Array.isArray(data) ? data : []
        setStatus('ready')
        updateMarkers()
      } catch {
        setStatus('error')
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords
          map.setView([latitude, longitude], 14)
          setUserLocation(latitude, longitude)
          void loadRestaurants()
        },
        () => {
          setLocationStatus('unavailable')
          void loadRestaurants()
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    } else {
      setLocationStatus('unsupported')
      void loadRestaurants()
    }

    mapRef.current = map

    return () => {
      map.off('moveend zoomend', updateMarkers)
      map.remove()
      mapRef.current = null
    }
  }, [onRestaurantClick])

  function handleRecenter() {
    const map = mapRef.current
    if (!map) return
    if (userLocationRef.current) {
      map.setView(userLocationRef.current, Math.max(map.getZoom(), 14))
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup()
      }
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords
          map.setView([latitude, longitude], 14)
          setUserLocation(latitude, longitude)
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
      {locationStatus === 'unavailable' && (
        <div className={`absolute left-4 top-4 z-[2000] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          Location access is off, so your pin could not be shown.
        </div>
      )}
      {locationStatus === 'unsupported' && (
        <div className={`absolute left-4 top-4 z-[2000] text-xs ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          This browser does not support location detection.
        </div>
      )}
      {noNearby && (
        <div className={`absolute left-4 ${locationStatus === 'ready' || locationStatus === 'locating' ? 'top-4' : 'top-10'} z-[2000] text-xs ${isLight ? 'text-warmgray-dark' : 'text-white/70'}`}>
          No restaurants found near your location. Zoomed to the nearest available area.
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
