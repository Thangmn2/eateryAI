import { useEffect, useRef, useState } from 'react'
import restaurantData from '../data/restaurantData.json'
import slugify from '../utils/slugify'

const DEFAULT_CENTER = [33.7419795, -117.8231586]
const DEFAULT_ZOOM = 13
const MAX_MARKERS = 300

export default function RestaurantMap({ theme, sidebar = false }) {
  const isLight = theme === 'light'
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersLayerRef = useRef(null)
  const userMarkerRef = useRef(null)
  const userLocationRef = useRef(null)
  const iconCacheRef = useRef(new Map())
  const [visibleCount, setVisibleCount] = useState(0)
  const [totalInView, setTotalInView] = useState(0)

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
      const candidates = restaurantData.filter(r => {
        if (!Number.isFinite(r.latitude) || !Number.isFinite(r.longitude)) return false
        return bounds.contains([r.latitude, r.longitude])
      })

      setTotalInView(candidates.length)

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
          const slug = slugify(r.restaurant_name)
          window.location.hash = `#restaurant-${slug}`
        })
        marker.addTo(markersLayerRef.current)
      })

      setVisibleCount(centered.length)
    }

    map.on('moveend zoomend', updateMarkers)

    function setUserLocation(lat, lng) {
      userLocationRef.current = [lat, lng]
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([lat, lng])
        return
      }
      userMarkerRef.current = window.L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: '#2563eb',
        color: '#1e3a8a',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .addTo(map)
        .bindPopup('You are here')
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords
          map.setView([latitude, longitude], 14)
          setUserLocation(latitude, longitude)
          updateMarkers()
        },
        () => {
          updateMarkers()
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    } else {
      updateMarkers()
    }

    mapRef.current = map

    return () => {
      map.off('moveend zoomend', updateMarkers)
      map.remove()
      mapRef.current = null
    }
  }, [])

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
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude])
          }
          userLocationRef.current = [latitude, longitude]
        },
        () => {
          map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }
  }

  return (
    <section className={`relative z-0 ${sidebar ? '' : 'mt-8'}`}>
      {!sidebar && (
        <div className="mb-3 flex items-center justify-between text-xs text-warmgray">
          <div>Showing {visibleCount} restaurants near this area</div>
          <div>In view: {totalInView}</div>
        </div>
      )}
      <div
        className={`relative isolate z-0 overflow-hidden shadow-card ${
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
              : 'h-[420px]'
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
