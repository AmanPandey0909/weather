// src/components/weather/hourly-forecast.tsx
"use client";

import type * as React from 'react';
import { ForecastCard } from './forecast-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CloudFog, CloudSun, Cloud, Zap, CloudRain } from 'lucide-react'; // Example icons

const hourlyData = [
  { time: "05:00 AM", temperature: "16.5", WeatherIcon: CloudFog, uvIndex: "0 of 11", windSpeed: "2.8", windDirection: "NW", rainChance: "0", humidity: "95" },
  { time: "06:00 AM", temperature: "16", WeatherIcon: Cloud, uvIndex: "1 of 11", windSpeed: "2.7", windDirection: "WNW", rainChance: "5", humidity: "100" },
  { time: "07:00 AM", temperature: "17.6", WeatherIcon: CloudSun, uvIndex: "2 of 11", windSpeed: "2.1", windDirection: "ENE", rainChance: "2", humidity: "80" },
  { time: "08:00 AM", temperature: "21.8", WeatherIcon: CloudSun, uvIndex: "4 of 11", windSpeed: "1.8", windDirection: "ENE", rainChance: "0", humidity: "70" },
  { time: "09:00 AM", temperature: "25", WeatherIcon: Cloud, uvIndex: "6 of 11", windSpeed: "4.2", windDirection: "E", rainChance: "0", humidity: "65" },
  { time: "10:00 AM", temperature: "27", WeatherIcon: CloudRain, uvIndex: "7 of 11", windSpeed: "5.0", windDirection: "SE", rainChance: "15", humidity: "60" },
  { time: "11:00 AM", temperature: "28", WeatherIcon: Zap, uvIndex: "8 of 11", windSpeed: "5.5", windDirection: "S", rainChance: "10", humidity: "58" },
];

export function HourlyForecast() {
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Hourly Forecast <span className="text-sm text-muted-foreground">(as of 05:00 AM)</span></h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-3 sm:space-x-4 pb-4">
          {hourlyData.map((data, index) => (
            <ForecastCard key={index} {...data} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
