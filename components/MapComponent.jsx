import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

// Haversine formula to calculate the distance between two lat/lng points
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Group nearby locations into a single hotspot (within a 2 km radius)
function createHotspots(locations) {
  const hotspots = [];

  locations.forEach((loc) => {
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return; // Add check here
    let found = false;

    // Check if the location can be added to an existing hotspot
    for (let i = 0; i < hotspots.length; i++) {
      const hotspot = hotspots[i];
      const distance = getDistance(hotspot.lat, hotspot.lng, loc.lat, loc.lng);

      if (distance <= 2) {
        // Merge this location into the hotspot
        hotspot.points.push(loc);
        found = true;
        break;
      }
    }

    if (!found) {
      // Create a new hotspot
      hotspots.push({
        lat: loc.lat,
        lng: loc.lng,
        points: [loc], // Each hotspot has a list of locations within it
      });
    }
  });

  // Return only the locations where there are 5 or more points
  return hotspots.filter(hotspot => hotspot.points.length >= 5);
}

// MapEvents component to allow for setting the location on click
function MapEvents({ setLocation }) {
  useMapEvents({
    click(e) {
      if (setLocation) {
        setLocation(e.latlng);
      }
    },
  });
  return null;
}

// ChangeView component to center the map on a specific location
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapComponent({ locations, location, setLocation, isModal = false }) {
  const [hotspots, setHotspots] = useState([]);
  const center = location || (locations && locations.length > 0 ? locations[0] : { lat: 20.5937, lng: 78.9629 });
  const zoom = isModal ? 13 : 5;

  useEffect(() => {
    if (locations && locations.length > 0) {
      setHotspots(createHotspots(locations));
    }
  }, [locations]);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 1 }} >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Display all individual reported case locations as markers */}
      {locations && locations.map((loc, index) => (
        loc && typeof loc.lat === 'number' && typeof loc.lng === 'number' && ( // Add check here
          <Marker key={index} position={loc} />
        )
      ))}

      {/* Display a circle for each hotspot */}
      {hotspots.map((hotspot, index) => (
        <Circle
          key={index}
          center={{ lat: hotspot.lat, lng: hotspot.lng }}
          pathOptions={{ fillColor: 'red', color: 'red' }}
          radius={2000} // 2 km radius for the cluster
        />
      ))}

      {/* Display a marker for the current location (if applicable) */}
      {location && <Marker position={location} />}

      {/* Map events to set location on click */}
      {setLocation && <MapEvents setLocation={setLocation} />}
    </MapContainer>
  );
}
