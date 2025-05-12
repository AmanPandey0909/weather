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
  return (
    <Card className="bg-card/30 backdrop-blur-md shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Location Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locationName && <p className="text-sm text-muted-foreground mb-2">Showing map data for: <span className="font-medium text-foreground">{locationName}</span></p>}
        
        <div 
          className="bg-muted/50 h-48 sm:h-64 rounded-md flex items-center justify-center border border-dashed border-border"
          data-ai-hint="world map"
          style={{
            backgroundImage: `url('https://picsum.photos/seed/mapgraphic/600/400')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-label="Map placeholder"
        >
          <div className="text-center p-4 bg-background/70 rounded-md backdrop-blur-sm">
            {typeof latitude === 'number' && typeof longitude === 'number' ? (
              <>
                <p className="text-sm font-medium text-foreground">Coordinates:</p>
                <p className="text-xs text-muted-foreground">Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</p>
                <p className="text-xs mt-2 text-muted-foreground">(Actual map integration pending)</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {locationName ? "Coordinates not available for this view." : "Enter a location to see map data."}
                <br/>(Actual map integration pending)
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
