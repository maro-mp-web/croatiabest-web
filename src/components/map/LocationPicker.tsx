'use client';

import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-lg border bg-slate-100 flex items-center justify-center">
      <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
        Učitavanje karte...
      </div>
    </div>
  ),
});

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  cityCenter?: { lat: number; lng: number } | null;
}

export default function LocationPicker(props: LocationPickerProps) {
  return <LocationPickerMap {...props} />;
}
