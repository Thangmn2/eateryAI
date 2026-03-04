import { useEffect, useRef } from 'react'
import restaurantData from '../data/restaurantData.json'

const DEFAULT_CENTER = [33.7419795, -117.8231586]
const DEFAULT_ZOOM = 13

export default function RestaurantMap() {
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
        const marker = window.L.marker([r.latitude, r.longitude]).addTo(map)
        marker.bindPopup(
          `<div style="min-width: 160px;">
            <strong>${r.restaurant_name}</strong><br/>
            <a href="${r.restaurant_url}" target="_blank" rel="noopener noreferrer">Visit Restaurant</a>
          </div>`
        )
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
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-2xl font-bold text-white">Restaurant Map</h2>
        <p className="text-xs text-warmgray">Use mouse wheel or +/- controls to zoom</p>
      </div>
      <div className="rounded-2xl overflow-hidden border border-cream shadow-card bg-white">
        <div ref={mapContainerRef} className="h-[420px] w-full" />
      </div>
    </section>
  )
}