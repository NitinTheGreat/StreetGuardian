'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const Map = ({ userLocation, nearestLocation }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && userLocation) {
      const map = L.map('map').setView([userLocation.lat, userLocation.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const serviceIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('Your Location')
        .openPopup();

      if (nearestLocation) {
        L.marker([nearestLocation.lat, nearestLocation.lng], { icon: serviceIcon })
          .addTo(map)
          .bindPopup(nearestLocation.name)
          .openPopup();

        L.Routing.control({
          waypoints: [
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(nearestLocation.lat, nearestLocation.lng)
          ],
          lineOptions: {
            styles: [{ color: 'red', opacity: 0.6, weight: 4 }]
          },
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          showAlternatives: false
        }).addTo(map);
      }

      return () => {
        map.remove();
      };
    }
  }, [userLocation, nearestLocation]);

  return  <div id="map" style={{ height: '100%', width: '100%' }}></div>;
};

export default Map;