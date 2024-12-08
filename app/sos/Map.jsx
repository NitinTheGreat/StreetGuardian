import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ userLocation }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([userLocation.lat, userLocation.lng], 15);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add marker
      const customIcon = L.icon({
        iconUrl: '/marker-icon.png', // Replace with your marker icon path
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: '/marker-shadow.png',
        shadowSize: [41, 41],
      });

      markerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup('Your Location')
        .openPopup();
    } else if (markerRef.current) {
      // Update marker position if map already initialized
      markerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      mapRef.current.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-2xl overflow-hidden" />;
};

export default Map;
