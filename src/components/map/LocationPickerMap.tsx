import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A custom black marker for picking location
const pickerIcon = L.divIcon({
  className: 'picker-marker',
  html: `
    <div style="
      background-color: #000000;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      border: 3px solid white;
      cursor: pointer;
    ">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface LocationPickerMapProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  cityCenter?: { lat: number; lng: number } | null;
}

// Map events handler to allow clicking on the map to set the marker
function LocationEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Controller to auto-fly to city center if the map has no marker
function CenterController({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 12, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

export default function LocationPickerMap({ lat, lng, onChange, cityCenter }: LocationPickerMapProps) {
  // Default to Croatia center if nothing is provided
  const centerPosition: [number, number] = lat && lng ? [lat, lng] : (cityCenter ? [cityCenter.lat, cityCenter.lng] : [44.81699, 15.98194]);
  const defaultZoom = lat && lng ? 15 : (cityCenter ? 12 : 7);

  const markerRef = useRef<L.Marker>(null);
  
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const position = marker.getLatLng();
          onChange(position.lat, position.lng);
        }
      },
    }),
    [onChange],
  );

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border">
      <MapContainer 
        center={centerPosition} 
        zoom={defaultZoom} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <LocationEvents onChange={onChange} />
        {(!lat || !lng) && cityCenter && <CenterController center={cityCenter} />}

        {lat && lng && (
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[lat, lng]}
            ref={markerRef}
            icon={pickerIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
