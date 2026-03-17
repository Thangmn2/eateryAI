import { useEffect, useRef } from 'react'
import restaurantData from '../data/restaurantData.json'
import slugify from '../utils/slugify'

const DEFAULT_CENTER = [33.7419795, -117.8231586]
const DEFAULT_ZOOM = 13

export default function RestaurantMap({ theme, sidebar = false }) {
  const isLight = theme === 'light'
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

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

    const markers = restaurantData
      .filter(r => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
      .map(r => {
        const sectionId = `restaurant-${slugify(r.restaurant_name)}`
        const marker = window.L.marker([r.latitude, r.longitude]).addTo(map)

        marker.bindPopup(`
          <div style="min-width: 160px;">
            <strong>${r.restaurant_name}</strong><br/>
            <a href="#${sectionId}">Visit Restaurant</a>
          </div>
        `)

        return marker
      })

    if (markers.length > 1) {
      const group = window.L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.2))
    } else if (markers.length === 1) {
      map.setView(markers[0].getLatLng(), 15)
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <section className={`relative z-0 ${sidebar ? '' : 'mt-8'}`}>
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
      </div>
    </section>
  )
}
