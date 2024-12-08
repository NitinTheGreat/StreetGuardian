'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ setUserLocation }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [0, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapRef.current.setView([latitude, longitude], 13);

            const customIcon = L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              shadowSize: [41, 41],
            });

            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else {
              markerRef.current = L.marker([latitude, longitude], { icon: customIcon })
                .addTo(mapRef.current)
                .bindPopup('Your location')
                .openPopup();
            }

            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location. Please check your browser settings and try again.');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser');
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [setUserLocation]);

  return <div id="map" className="w-full h-full rounded-2xl overflow-hidden" />;
};

export default Map;

