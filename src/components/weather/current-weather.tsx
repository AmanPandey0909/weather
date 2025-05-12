// src/components/weather/current-weather.tsx
"use client";

import type * as React from 'react';
import { Thermometer, Wind, Sunrise, Sunset, Droplets, Sun as SunIcon } from 'lucide-react';
import type { GetWeatherForecastOutput } from '@/ai/flows/get-weather-forecast-flow';
import { getWeatherIcon } from '@/lib/weather-utils';

interface CurrentWeatherProps {
  currentWeather: GetWeatherForecastOutput['current'];
  locationName: string; // To display current location context if needed, though header has it
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string; className?: string }> = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-center text-sm ${className}`}>
    <Icon className="w-4 h-4 mr-2 text-primary/80" />
    <span className="text-muted-foreground mr-1">{label}:</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);


export function CurrentWeather({
  currentWeather,
}: CurrentWeatherProps) {
  const {
    temperature,
    condition,
    maxTemp,
    minTemp,
    windSpeed,
    windDirection,
    sunriseTime,
    sunsetTime,
    humidity,
    uvIndex,
  } = currentWeather;

  const WeatherIcon = getWeatherIcon(condition.text);

  return (
    <div className="bg-card/30 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-xl mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left Side: Main Weather Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <WeatherIcon className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-foreground" data-ai-hint={condition.text || "weather icon"} />
        <div>
          <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground">{temperature.toFixed(1)}°C</p>
          <p className="text-lg sm:text-xl text-muted-foreground capitalize">{condition.text}</p>
        </div>
      </div>

      {/* Right Side: Additional Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3 text-sm w-full md:w-auto">
        <DetailItem icon={Thermometer} label="Max" value={`${maxTemp.toFixed(1)}°C`} />
        <DetailItem icon={Wind} label="Wind" value={`${windDirection} ${windSpeed.toFixed(1)} km/h`} />
        <DetailItem icon={Sunrise} label="Sunrise" value={sunriseTime} />
        
        <DetailItem icon={Thermometer} label="Min" value={`${minTemp.toFixed(1)}°C`} />
        <DetailItem icon={Sunset} label="Sunset" value={sunsetTime} />
        <DetailItem icon={Droplets} label="Humidity" value={`${humidity}%`} />
        
        <DetailItem icon={SunIcon} label="UV Index" value={uvIndex} className="sm:col-start-2" />
      </div>
    </div>
  );
}
