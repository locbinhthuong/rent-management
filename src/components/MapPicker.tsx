'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface MapPickerProps {
  position: [number, number] | null;
  onPositionChange: (pos: [number, number]) => void;
  city?: string;
  district?: string;
}

const defaultCenter: [number, number] = [10.762622, 106.660172]; // HCM Center

function LocationMarker({ position, onPositionChange }: { position: [number, number] | null, onPositionChange: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function MapPicker({ position, onPositionChange, city, district }: MapPickerProps) {
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  
  // Geocode address when city/district changes
  useEffect(() => {
    if (city && !position) {
      const address = `${district ? district + ', ' : ''}${city}, Vietnam`;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setCenter([lat, lon]);
          }
        })
        .catch(console.error);
    }
  }, [city, district, position]);

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden border border-slate-300 relative z-0">
      <MapContainer 
        center={position || center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#e5e7eb' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker position={position} onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  );
}
