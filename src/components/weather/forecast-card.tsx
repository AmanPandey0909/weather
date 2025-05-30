
// src/components/weather/forecast-card.tsx
"use client";

import type * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Wind, Umbrella, Droplets, Sun as SunIcon } from 'lucide-react';
import { getWeatherIcon } from '@/lib/weather-utils';

interface ForecastCardProps {
  time: string;
  temperature: string;
  conditionText: string; 
  uvIndex: string;
  windSpeed: string;
  windDirection: string;
  rainChance: string;
  humidity: string;
}

const DetailItem: React.FC<{ icon: React.ElementType; value: string; label?: string }> = ({ icon: Icon, value, label }) => (
  <div className="flex items-center text-xs text-muted-foreground">
    <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/80" />
    {label && <span className="mr-1">{label}:</span>}
    <span className="text-foreground/90">{value}</span>
  </div>
);

export function ForecastCard({
  time,
  temperature,
  conditionText,
  uvIndex,
  windSpeed,
  windDirection,
  rainChance,
  humidity,
}: ForecastCardProps) {
  const WeatherIcon = getWeatherIcon(conditionText);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/60 shadow-lg min-w-[160px] sm:min-w-[180px] flex-shrink-0">
      <CardHeader className="p-3 sm:p-4 text-center">
        <CardTitle className="text-sm sm:text-base font-medium text-card-foreground">{time}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="flex flex-col items-center mb-2">
          <WeatherIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-1" data-ai-hint={conditionText || "weather icon"} />
          <p className="text-xl sm:text-2xl font-semibold text-card-foreground">{temperature}°C</p>
        </div>
        <div className="space-y-1.5">
          <DetailItem icon={SunIcon} value={uvIndex} label="UV" />
          <DetailItem icon={Wind} value={`${windDirection} ${windSpeed} km/h`} />
          <DetailItem icon={Umbrella} value={`${rainChance}%`} label="Rain" />
          <DetailItem icon={Droplets} value={`${humidity}%`} label="Humidity" />
        </div>
      </CardContent>
    </Card>
  );
}
