// src/components/weather/daily-forecast.tsx
"use client";

import type * as React from 'react';
import { DailyForecastItem } from './daily-forecast-item';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CloudSun, Cloud, Sun, CloudRain, CloudDrizzle } from 'lucide-react'; // Example icons

const dailyData = [
  { dayName: "Friday", date: "14th July", WeatherIcon: Cloud, maxTemp: "28", minTemp: "16" },
  { dayName: "Saturday", date: "15th July", WeatherIcon: CloudSun, maxTemp: "29", minTemp: "17" },
  { dayName: "Sunday", date: "16th July", WeatherIcon: Sun, maxTemp: "30", minTemp: "18" },
  { dayName: "Monday", date: "17th July", WeatherIcon: CloudRain, maxTemp: "27", minTemp: "19" },
  { dayName: "Tuesday", date: "18th July", WeatherIcon: CloudDrizzle, maxTemp: "26", minTemp: "17" },
  { dayName: "Wednesday", date: "19th July", WeatherIcon: Cloud, maxTemp: "28", minTemp: "18" },
  { dayName: "Thursday", date: "20th July", WeatherIcon: CloudSun, maxTemp: "31", minTemp: "20" },
];

export function DailyForecast() {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">6+ Days Forecast</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 sm:space-x-3 pb-4">
          {dailyData.map((data, index) => (
            <DailyForecastItem key={index} {...data} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
