// src/components/weather/current-weather.tsx
"use client";

import type * as React from 'react';
import { Cloud, Thermometer, Wind, Sunrise, Sunset, Droplets, Sun } from 'lucide-react'; // Assuming Cloud as default icon

interface CurrentWeatherProps {
  temperature: string;
  condition: string;
  WeatherIcon?: React.ElementType;
  maxTemp: string;
  minTemp: string;
  windSpeed: string;
  windDirection: string;
  sunriseTime: string;
  sunsetTime: string;
  humidity: string;
  uvIndex: string;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string; className?: string }> = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-center text-sm ${className}`}>
    <Icon className="w-4 h-4 mr-2 text-primary/80" />
    <span className="text-muted-foreground mr-1">{label}:</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);


export function CurrentWeather({
  temperature,
  condition,
  WeatherIcon = Cloud,
  maxTemp,
  minTemp,
  windSpeed,
  windDirection,
  sunriseTime,
  sunsetTime,
  humidity,
  uvIndex,
}: CurrentWeatherProps) {
  return (
    <div className="bg-card/30 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-xl mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left Side: Main Weather Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <WeatherIcon className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-foreground" data-ai-hint="weather cloud" />
        <div>
          <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground">{temperature}°C</p>
          <p className="text-lg sm:text-xl text-muted-foreground capitalize">{condition}</p>
        </div>
      </div>

      {/* Right Side: Additional Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3 text-sm w-full md:w-auto">
        <DetailItem icon={Thermometer} label="Max" value={`${maxTemp}°C`} />
        <DetailItem icon={Wind} label="Wind" value={`${windDirection} ${windSpeed} km/h`} />
        <DetailItem icon={Sunrise} label="Sunrise" value={sunriseTime} />
        
        <DetailItem icon={Thermometer} label="Min" value={`${minTemp}°C`} />
        <DetailItem icon={Sunset} label="Sunset" value={sunsetTime} />
        <DetailItem icon={Droplets} label="Humidity" value={`${humidity}%`} />
        
        <DetailItem icon={Sun} label="UV Index" value={uvIndex} className="sm:col-start-2" />
      </div>
    </div>
  );
}
