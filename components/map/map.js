import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '@/pages/cafeMap/cafeApi'

export default function Map({ position, zoom }) {
  useEffect(() => {
    const map = L.map('map').setView(position, zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const fetchCafes = async () => {
      try {
        const cafes = await api.getCafesData()

        cafes.forEach((cafe) => {
          const { latitude, longitude, name, address } = cafe

          const lat = parseFloat(latitude)
          const lng = parseFloat(longitude)

          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(`<b>${name}</b><br>${address}`)
          } else {
            console.warn(`Invalid coordinates for cafe: ${name}`)
          }
        })
      } catch (error) {
        console.error('Error fetching cafes data:', error)
      }
    }

    fetchCafes()

    return () => {
      map.remove()
    }
  }, [position, zoom])

  return <div id="map" style={{ height: '500px', width: '100%' }} />
}
