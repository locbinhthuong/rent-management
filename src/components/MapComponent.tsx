'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { useSearchParams } from 'next/navigation';
import { Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import Image from 'next/image';

interface MapComponentProps {
  posts: any[];
  hoveredPostId: string | null;
}

const getCoordinates = (post: any): [number, number] | null => {
  try {
    if (post?.location?.coordinates && Array.isArray(post.location.coordinates) && post.location.coordinates.length >= 2) {
      const lng = Number(post.location.coordinates[0]);
      const lat = Number(post.location.coordinates[1]);
      
      // Check if they are valid finite numbers
      if (Number.isFinite(lat) && Number.isFinite(lng) && !isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
  } catch (e) {
    // Ignore and fallback
  }
  
  return null;
};

const MapAutoPanner = ({ hoveredPostId, posts }: { hoveredPostId: string | null, posts: any[] }) => {
  const map = useMap();
  useEffect(() => {
    if (hoveredPostId) {
      // Bỏ qua nếu map đang bị ẩn (display: none) trên mobile, dẫn đến size = 0 và gây lỗi NaN
      if (!map || map.getSize().x === 0 || map.getSize().y === 0) return;
      
      const post = posts.find(p => p._id.toString() === hoveredPostId);
      if (post) {
        const coords = getCoordinates(post);
        if (coords && Array.isArray(coords) && !isNaN(coords[0]) && !isNaN(coords[1])) {
          try {
            map.flyTo(coords, 14, { animate: true, duration: 1 });
          } catch (error) {
            console.error("Lỗi Leaflet flyTo:", error);
          }
        }
      }
    }
  }, [hoveredPostId, map, posts]);
  return null;
};

const MapBoundsFitter = ({ posts }: { posts: any[] }) => {
  const map = useMap();
  useEffect(() => {
    // Only fit bounds if there are posts and the map is visible
    if (!map || map.getSize().x === 0 || map.getSize().y === 0 || !posts || posts.length === 0) return;
    
    // Check if we are currently hovering, if so, let MapAutoPanner handle it
    // Wait, MapBoundsFitter only runs when posts change, which is correct.
    const validCoords = posts.map(getCoordinates).filter(c => c !== null) as [number, number][];
    
    if (validCoords.length > 0) {
      try {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true, duration: 1.5 });
      } catch (error) {
        console.error("Lỗi Leaflet fitBounds:", error);
      }
    }
  }, [posts, map]);
  return null;
};

const DeviceLocationPanner = () => {
  const map = useMap();
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!map || map.getSize().x === 0 || map.getSize().y === 0) return;
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (Number.isFinite(lat) && Number.isFinite(lng) && !isNaN(lat) && !isNaN(lng)) {
            try {
              map.setView([lat, lng], 13);
            } catch (error) {
              console.error("Lỗi Leaflet setView:", error);
            }
          }
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [map]);
  return null;
};

const createCustomIcon = (isActive: boolean) => {
  const html = `
    <div style="
      background-color: ${isActive ? '#06b6d4' : '#1e293b'};
      border: 2px solid ${isActive ? '#ffffff' : '#06b6d4'};
      width: ${isActive ? '36px' : '28px'};
      height: ${isActive ? '36px' : '28px'};
      border-radius: 50%;
      box-shadow: 0 0 15px ${isActive ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.4)'};
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${isActive ? '#ffffff' : '#22d3ee'};
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: isActive ? [36, 36] : [28, 28],
    iconAnchor: isActive ? [18, 36] : [14, 28],
    popupAnchor: [0, -36]
  });
};

export default function MapComponent({ posts, hoveredPostId }: MapComponentProps) {
  const searchParams = useSearchParams();
  const uni_lat = searchParams.get('uni_lat');
  const uni_lng = searchParams.get('uni_lng');
  // Find first valid coordinates for default center
  const firstValidCoords = posts.map(getCoordinates).find(c => c !== null);
  const defaultCenter: [number, number] = (uni_lat && uni_lng && !isNaN(Number(uni_lat)) && !isNaN(Number(uni_lng))) 
    ? [Number(uni_lat), Number(uni_lng)] 
    : (firstValidCoords || [14.0583, 108.2772]); // Vietnam center
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

  return (
    <div className="w-full h-full relative z-0">
      
      {/* Map Style Toggle */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col font-space">
        <button 
          onClick={() => setMapType('street')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors ${mapType === 'street' ? 'bg-cyan-50 text-cyan-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          Bản đồ
        </button>
        <div className="h-px w-full bg-slate-100"></div>
        <button 
          onClick={() => setMapType('satellite')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors ${mapType === 'satellite' ? 'bg-cyan-50 text-cyan-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          Vệ tinh
        </button>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#e5e7eb' }}
        zoomControl={false}
      >
        {mapType === 'street' ? (
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          />
        ) : (
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          />
        )}
        
        <DeviceLocationPanner />
        <MapAutoPanner hoveredPostId={hoveredPostId} posts={posts} />
        <MapBoundsFitter posts={posts} />

        {uni_lat && uni_lng && !isNaN(Number(uni_lat)) && !isNaN(Number(uni_lng)) && (
          <Circle 
            center={[Number(uni_lat), Number(uni_lng)]} 
            radius={3000} 
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 2 }}
          />
        )}

        {posts.map((post) => {
          const isActive = hoveredPostId === post._id.toString();
          const coords = getCoordinates(post);
          if (!coords) return null; // Do not render if no valid coordinates
          const price = post.price || 0;
          const imageUrl = post.images && post.images.length > 0 
            ? post.images[0] 
            : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaMawYSBjw7MgaMOsbmgg4bqjbmg8L3RleHQ+PC9zdmc+';

          return (
            <Marker 
              key={post._id.toString()} 
              position={coords}
              icon={createCustomIcon(isActive)}
              zIndexOffset={isActive ? 1000 : 0}
            >
              <Popup className="glass-popup" closeButton={false}>
                <div className="w-48 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-[0_0_20px_rgba(0,0,0,0.8)] p-0 m-[-14px]">
                  <div className="relative h-24 w-full">
                    <Image src={imageUrl} alt="Room" fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-slate-900 line-clamp-1 mb-1 font-space">{post.title}</div>
                    <div className="font-extrabold text-cyan-400 font-space glow-cyan-text">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}/tháng
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Custom styles for Leaflet Popup to make it fit Glassmorphism */}
      <style jsx global>{`
        .glass-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        }
        .glass-popup .leaflet-popup-tip {
          box-shadow: none;
        }
        .custom-leaflet-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
