import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as LucideIcons from 'lucide-react';
import { MapPin, ExternalLink, Navigation as NavigationIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/app/lib/constants';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { renderToString } from 'react-dom/server';

// Fix for default marker icons in Leaflet when used with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom premium marker icon
const createCustomIcon = (color: string = '#3b82f6', iconName: string = 'MapPin', isSelected: boolean = false) => {
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.MapPin;
  // Convert the React component to an HTML string
  const iconHtml = renderToString(<IconComponent color={isSelected ? 'white' : 'white'} size={16} strokeWidth={2.5} />);

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${isSelected ? '#000000' : color};
        width: ${isSelected ? '44px' : '36px'};
        height: ${isSelected ? '44px' : '36px'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
        border: 3px solid white;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: ${isSelected ? '999' : '1'};
      ">
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          ${iconHtml}
        </div>
      </div>
    `,
    iconSize: isSelected ? [44, 44] : [36, 36],
    iconAnchor: isSelected ? [22, 44] : [18, 36],
    popupAnchor: [0, -40],
  });
};

// Custom cluster icon
const createClusterCustomIcon = function (cluster: any) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `
      <div class="cluster-inner">
        <span>${count}</span>
      </div>
    `,
    className: 'custom-cluster-wrapper',
    iconSize: L.point(48, 48, true),
  });
};

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  listings: any[];
  selectedListingId: string | null;
  onSelectListing: (id: string | null) => void;
  getDirectionsUrl: (lat: number, lng: number) => string;
  showCenterMarker?: boolean;
  centerMarkerName?: string;
}

// A helper component to programmatically move the map to a selected marker
const MapController = ({ center, zoom, selectedListingId, listings }: any) => {
  const map = useMap();

  useEffect(() => {
    // Ensure map updates if the center prop changes (e.g., navigating between cities)
    if (!selectedListingId) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom, map, selectedListingId]);
  
  useEffect(() => {
    if (selectedListingId) {
      const selected = listings.find((l: any) => l.id === selectedListingId);
      if (selected) {
        const lat = typeof selected.latitude === 'string' ? parseFloat(selected.latitude) : selected.latitude;
        const lng = typeof selected.longitude === 'string' ? parseFloat(selected.longitude) : selected.longitude;
        if (!isNaN(lat) && !isNaN(lng)) {
          const currentZoom = map.getZoom();
          const targetZoom = Math.max(currentZoom, 16); // Zoom in to at least 16, or keep current if higher
          map.flyTo([lat, lng], targetZoom, { animate: true, duration: 0.8 });
        }
      }
    }
  }, [selectedListingId, map, listings]);

  return null;
};

export default function DynamicMap({ center, zoom, listings, selectedListingId, onSelectListing, getDirectionsUrl, showCenterMarker, centerMarkerName }: MapProps) {
  return (
    <>
      <style>{`
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 1.25rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 4px;
        }
        .leaflet-popup-content {
          margin: 12px;
          line-height: inherit;
        }
        .leaflet-popup-tip-container {
          margin-top: -2px;
        }
        .custom-leaflet-marker:hover > div {
          transform: rotate(-45deg) scale(1.1) !important;
        }
        .custom-cluster-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cluster-inner {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #FF3131 0%, #3090FF 100%);
          color: white;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 10px 20px rgba(255, 49, 49, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-family: inherit;
        }
        .custom-cluster-wrapper:hover .cluster-inner {
          transform: scale(1.2);
          box-shadow: 0 15px 30px rgba(48, 144, 255, 0.4);
        }
      `}</style>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={center} zoom={zoom} selectedListingId={selectedListingId} listings={listings} />

        {showCenterMarker && (
          <Marker position={[center.lat, center.lng]} icon={createCustomIcon('#FF3131', 'MapPin', false)} zIndexOffset={-100}>
            <Popup className="custom-popup">
              <div className="p-2 text-center">
                <h4 className="font-black text-sm m-0 text-slate-900">{centerMarkerName || 'Centar'}</h4>
              </div>
            </Popup>
          </Marker>
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          iconCreateFunction={createClusterCustomIcon}
        >
          {listings.map((listing) => {
            const lat = typeof listing.latitude === 'string' ? parseFloat(listing.latitude) : listing.latitude;
            const lng = typeof listing.longitude === 'string' ? parseFloat(listing.longitude) : listing.longitude;
            
            if (isNaN(lat) || isNaN(lng)) return null;
            
            const isSelected = selectedListingId === listing.id;
            const categoryId = listing.locationCategoryId || listing.categoryId;
            const category = CATEGORIES.find(c => c.id === categoryId);
            
            const markerColor = category?.color || '#3b82f6';
            const iconName = category?.icon || 'MapPin';

            return (
              <Marker
                key={listing.id}
                position={[lat, lng]}
                icon={createCustomIcon(markerColor, iconName, isSelected)}
                eventHandlers={{
                  click: () => onSelectListing(listing.id),
                }}
              >
                <Popup 
                  autoPan={false}
                  onClose={() => onSelectListing(null)}
                  className="custom-popup"
                >
                  <div className="p-1 min-w-[200px] max-w-[240px] space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-black text-base leading-tight m-0 text-slate-900">{listing.name || listing.objectName}</h4>
                      <p className="text-xs text-slate-500 italic line-clamp-2 m-0 mt-1 leading-snug">{listing.description}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-2 m-0 font-medium">
                        <MapPin className="w-3 h-3" /> {listing.address}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-3 border-t mt-3">
                      <a href={`/listing/${listing.id}`} className="w-full block" style={{textDecoration: 'none'}}>
                        <Button size="sm" className="w-full h-9 text-[10px] font-black rounded-lg bg-black hover:bg-slate-800 text-white flex items-center justify-center">
                          <ExternalLink className="w-3 h-3 mr-2" /> DETALJI OBJEKTA
                        </Button>
                      </a>
                      <a 
                        href={getDirectionsUrl(lat, lng)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full block"
                        style={{textDecoration: 'none'}}
                      >
                        <Button size="sm" variant="outline" className="w-full h-9 text-[10px] font-black rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">
                          <NavigationIcon className="w-3 h-3 mr-2" /> UPUTE ZA VOŽNJU
                        </Button>
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}
