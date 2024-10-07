import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

function MapEvents({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation && setLocation(e.latlng)
    },
  })
  return null
}

function ChangeView({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

function createHotspots(locations) {
  const hotspots = {}
  locations.forEach(loc => {
    const key = `${Math.round(loc.lat * 100) / 100},${Math.round(loc.lng * 100) / 100}`
    if (!hotspots[key]) {
      hotspots[key] = []
    }
    hotspots[key].push(loc)
  })

  return Object.entries(hotspots)
    .filter(([_, points]) => points.length >= 5)
    .map(([key, _]) => {
      const [lat, lng] = key.split(',').map(Number)
      return { lat, lng }
    })
}

export default function MapComponent({ locations, location, setLocation, isModal = false }) {
  const [hotspots, setHotspots] = useState([])
  const center = location || (locations && locations.length > 0 ? locations[0] : { lat: 20.5937, lng: 78.9629 })
  const zoom = isModal ? 13 : 5

  useEffect(() => {
    if (locations && locations.length > 0) {
      setHotspots(createHotspots(locations))
    }
  }, [locations])

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <ChangeView center={center} zoom={zoom} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations && locations.map((loc, index) => (
        <Marker key={index} position={loc} />
      ))}
      {hotspots.map((hotspot, index) => (
        <Circle
          key={index}
          center={hotspot}
          pathOptions={{ fillColor: 'red', color: 'red' }}
          radius={1000}
        />
      ))}
      {location && <Marker position={location} />}
      {setLocation && <MapEvents setLocation={setLocation} />}
    </MapContainer>
  )
}