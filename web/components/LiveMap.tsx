'use client';

import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { useMemo } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

type LiveMapProps = {
  latitude: number;
  longitude: number;
};

export function LiveMap({ latitude, longitude }: LiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-brand-border bg-brand-card p-6 text-center text-sm text-brand-muted">
        <p>
          Add <code className="text-brand-red-glow">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to
          enable the map.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-brand-red/40 bg-brand-card p-6 text-center text-sm text-brand-red-glow">
        Failed to load Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[280px] animate-pulse items-center justify-center rounded-xl bg-brand-card">
        <span className="text-sm text-brand-muted">Loading map…</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={16}
      options={{
        styles: darkMapStyles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      <OverlayView
        position={center}
        mapPaneName={OverlayView.OVERLAY_LAYER}
        getPixelPositionOffset={() => ({ x: 0, y: 0 })}
      >
        <div className="pulse-marker" title="SOS location" />
      </OverlayView>
    </GoogleMap>
  );
}
