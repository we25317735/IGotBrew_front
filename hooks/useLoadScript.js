import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const libraries = ['places']

function MyMapComponent() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  if (!isLoaded) return <div>Loading...</div>

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '640px' }}
      center={{ lat: 23.6978, lng: 120.9605 }}
      zoom={10}
    ></GoogleMap>
  )
}

export default MyMapComponent
