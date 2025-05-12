
// src/components/weather/location-map.tsx
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MapPin, Wind, Cloud } from 'lucide-react';

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export function LocationMap({ latitude, longitude, locationName }: LocationMapProps) {
  const [showWind, setShowWind] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [iframeSrc, setIframeSrc] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';

  useEffect(() => {
    if (hasCoordinates) {
      const lat = latitude as number;
      const lon = longitude as number;
      let layers = [];
      if (showWind) layers.push('wind');
      if (showClouds) layers.push('clouds');
      
      // Windy.com embed allows multiple layers by comma separation, but typically one primary visual layer is best.
      // Let's prioritize wind if both, then clouds, then a base map.
      let layerParam = 'wind'; // Default to wind
      if (showWind && showClouds) {
        // Showing both might be too cluttered on embed; Windy might default to one.
        // For clarity, let's allow one active layer to be prominent or let Windy decide default.
        // To explicitly show wind and then clouds, you might need `layer=wind&activate=clouds` but this is advanced.
        // Simple approach: pick one or let embed default.
        layerParam = 'wind'; // Or 'clouds', or 'radar' etc.
      } else if (showClouds) {
        layerParam = 'clouds';
      } else if (!showWind && !showClouds) {
        layerParam = 'radar'; // Show radar or satellite as a base if nothing is selected.
      }
      
      const baseWindyUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=7&menu=&message=true&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km/h&metricTemp=%C2%B0C&radarRange=-1`;
      
      setIframeSrc(`${baseWindyUrl}&layer=${layerParam}`);
      setMapReady(true);
    } else {
      setMapReady(false);
      setIframeSrc('');
    }
  }, [latitude, longitude, showWind, showClouds, hasCoordinates]);

  return (
    <Card className="bg-card/50 backdrop-blur-md shadow-xl border border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Location &amp; Weather Map
        </CardTitle>
        {locationName && <p className="text-sm text-muted-foreground mt-1">Map data for: <span className="font-medium text-foreground">{locationName}</span></p>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 p-3 bg-background/20 rounded-md border border-border/30">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-wind"
              checked={showWind}
              onCheckedChange={setShowWind}
              aria-label="Toggle wind layer"
            />
            <Label htmlFor="show-wind" className="flex items-center text-sm text-foreground">
              <Wind className="w-4 h-4 mr-1.5 text-primary/80" />
              Show Wind Animation
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-clouds"
              checked={showClouds}
              onCheckedChange={setShowClouds}
              aria-label="Toggle cloud layer"
            />
            <Label htmlFor="show-clouds" className="flex items-center text-sm text-foreground">
              <Cloud className="w-4 h-4 mr-1.5 text-primary/80" />
              Show Cloud Coverage
            </Label>
          </div>
        </div>
        
        {mapReady && iframeSrc ? (
          <iframe
            key={iframeSrc} 
            width="100%"
            height="350"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={iframeSrc}
            title={`Weather Map of ${locationName || 'selected location'}`}
            className="rounded-md border border-border shadow-sm"
            aria-label={`Weather map showing ${locationName || 'selected location'}`}
          >
          </iframe>
        ) : (
          <div className="bg-muted/30 h-[350px] rounded-md flex items-center justify-center border border-dashed border-border/70">
            <div className="text-center p-4 bg-background/50 rounded-md backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {hasCoordinates ? "Generating map..." : (locationName ? "Coordinates not available to display map for this view." : "Enter a location to see map data.")}
              </p>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">Map provided by Windy.com. Selected layers will attempt to display.</p>
      </CardContent>
    </Card>
  );
}
