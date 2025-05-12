// src/components/weather/location-map.tsx
"use client";

import type * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export function LocationMap({ latitude, longitude, locationName }: LocationMapProps) {
  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';
  let iframeSrc = '';

  if (hasCoordinates) {
    const lat = latitude as number;
    const lon = longitude as number;
    // Define a small bounding box around the location for the map view
    const delta = 0.05; // Adjust for zoom level, smaller is more zoomed in
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  }

  return (
    <Card className="bg-card/30 backdrop-blur-md shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Location Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locationName && <p className="text-sm text-muted-foreground mb-3">Showing map data for: <span className="font-medium text-foreground">{locationName}</span></p>}
        
        {hasCoordinates ? (
          <iframe
            width="100%"
            height="250" // You can adjust height as needed, sm:h-64 was roughly 256px
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={iframeSrc}
            title={`Map of ${locationName || 'selected location'}`}
            className="rounded-md border border-border shadow-sm"
            aria-label={`Map showing ${locationName || 'selected location'}`}
          >
          </iframe>
        ) : (
          <div className="bg-muted/50 h-48 sm:h-64 rounded-md flex items-center justify-center border border-dashed border-border">
            <div className="text-center p-4 bg-background/70 rounded-md backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {locationName ? "Coordinates not available to display map for this view." : "Enter a location to see map data."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
