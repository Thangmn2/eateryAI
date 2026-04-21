export function mapRestaurantDocument(doc) {
  const nestedCoords = Array.isArray(doc?._id?.coords) ? doc._id.coords : null
  const geoJsonCoords = Array.isArray(doc?.location?.coordinates) ? doc.location.coordinates : null
  const fallbackCoords = nestedCoords || geoJsonCoords
  const longitude = fallbackCoords?.[0] ?? doc.longitude_coordinates
  const latitude = fallbackCoords?.[1] ?? doc.latitude_coordinates

  return {
    restaurant_name: doc.restaurant || doc?._id?.restaurant_name || '',
    restaurant_url: doc.restaurant_url || '',
    address: doc.address || doc?._id?.address || '',
    city: doc.city || '',
    state: doc.state || '',
    latitude: Number(latitude),
    longitude: Number(longitude),
    logo_url: doc.logo_img || '',
    phone: doc.phone_number || '',
    hours: doc.restaurant_hours || '',
  }
}
