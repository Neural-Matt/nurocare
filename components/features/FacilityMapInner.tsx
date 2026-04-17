'use client';

// This component is loaded dynamically (no SSR) because Leaflet requires window.
// Usage: const FacilityMap = dynamic(() => import('./FacilityMapInner'), { ssr: false });

import { useEffect, useRef, useState } from 'react';
import { Facility, FacilityType } from '@/types';
import { FacilityCard } from './FacilityCard';
import { X } from 'lucide-react';

// Type colours to match FacilityCard
const PIN_COLORS: Record<FacilityType, string> = {
  hospital: '#0A2540',  // navy
  clinic:   '#14B8A6',  // teal
  pharmacy: '#F97316',  // orange
};

interface FacilityMapProps {
  facilities: Facility[];
}

export default function FacilityMapInner({ facilities }: FacilityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<import('leaflet').Marker[]>([]);
  const [selected, setSelected] = useState<Facility | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet (client-only)
    import('leaflet').then((L) => {
      if (!mapRef.current || leafletMapRef.current) return;

      // Fix default icon path issues with Next.js bundling
      // @ts-expect-error — Leaflet internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Centre on Lusaka
      const map = L.map(mapRef.current, {
        center: [-15.4166, 28.2833],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      leafletMapRef.current = map;

      // OpenStreetMap tile layer — free, no API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add facility markers
      const newMarkers: import('leaflet').Marker[] = [];
      facilities.forEach((facility) => {
        const color = PIN_COLORS[facility.type];

        // Custom SVG pin
        const svgIcon = L.divIcon({
          html: `
            <div style="
              width: 32px; height: 40px;
              display: flex; flex-direction: column; align-items: center;
            ">
              <div style="
                width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                background: ${color};
                border: 2.5px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25);
                display: flex; align-items: center; justify-content: center;
              ">
                <span style="
                  transform: rotate(45deg);
                  color: white; font-size: 13px; font-weight: 700; line-height: 1;
                ">${facility.type === 'hospital' ? '🏥' : facility.type === 'clinic' ? '🩺' : '💊'}</span>
              </div>
              <div style="
                width: 2px; height: 8px; background: ${color}; opacity: 0.6;
              "></div>
            </div>
          `,
          className: '',
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -42],
        });

        const marker = L.marker([facility.lat, facility.lng], { icon: svgIcon })
          .addTo(map)
          .on('click', () => setSelected(facility));

        // Accessible title on hover
        marker.bindTooltip(facility.name, {
          permanent: false,
          direction: 'top',
          className: 'leaflet-tooltip-nurocare',
          offset: [0, -38],
        });

        newMarkers.push(marker);
      });
      markersRef.current = newMarkers;
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render markers when facility list (filter) changes
  useEffect(() => {
    import('leaflet').then((L) => {
      const map = leafletMapRef.current;
      if (!map) return;

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const color_map = PIN_COLORS;
      const newMarkers: import('leaflet').Marker[] = [];

      facilities.forEach((facility) => {
        const color = color_map[facility.type];
        const svgIcon = L.divIcon({
          html: `
            <div style="width:32px;height:40px;display:flex;flex-direction:column;align-items:center;">
              <div style="
                width:32px;height:32px;border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);background:${color};
                border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);
                display:flex;align-items:center;justify-content:center;
              ">
                <span style="transform:rotate(45deg);color:white;font-size:13px;font-weight:700;">
                  ${facility.type === 'hospital' ? '🏥' : facility.type === 'clinic' ? '🩺' : '💊'}
                </span>
              </div>
              <div style="width:2px;height:8px;background:${color};opacity:0.6;"></div>
            </div>
          `,
          className: '',
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -42],
        });

        const marker = L.marker([facility.lat, facility.lng], { icon: svgIcon })
          .addTo(map)
          .on('click', () => setSelected(facility));

        marker.bindTooltip(facility.name, {
          permanent: false,
          direction: 'top',
          className: 'leaflet-tooltip-nurocare',
          offset: [0, -38],
        });

        newMarkers.push(marker);
      });
      markersRef.current = newMarkers;
    });
  }, [facilities]);

  return (
    <div className="relative w-full h-full">
      {/* Map tile */}
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden z-0" />

      {/* Legend */}
      <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-100 flex flex-col gap-1.5">
        {(['hospital', 'clinic', 'pharmacy'] as const).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ background: PIN_COLORS[type] }}
            />
            <span className="text-[11px] font-semibold text-slate-600 capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Selected facility card — bottom sheet */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] animate-slide-up">
          <div className="relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-white border border-slate-200 rounded-full shadow flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <FacilityCard facility={selected} compact />
          </div>
        </div>
      )}
    </div>
  );
}
