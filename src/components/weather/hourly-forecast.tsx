// src/components/weather/hourly-forecast.tsx
"use client";

import type * as React from 'react';
import { ForecastCard } from './forecast-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { GetWeatherForecastOutput } from '@/ai/flows/get-weather-forecast-flow';

interface HourlyForecastProps {
  hourlyData: GetWeatherForecastOutput['hourly'];
}

export function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Hourly Forecast</h2>
        <p className="text-muted-foreground">No hourly forecast data available.</p>
      </div>
    );
  }
  
  // Extracting the time from the first entry to display "as of" time, assuming it's relevant
  const asOfTime = hourlyData[0]?.time;

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
        Hourly Forecast 
        {asOfTime && <span className="text-sm text-muted-foreground"> (as of {asOfTime})</span>}
      </h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-3 sm:space-x-4 pb-4">
          {hourlyData.map((data, index) => (
            <ForecastCard 
              key={index} 
              time={data.time}
              temperature={data.temperature.toFixed(1)}
              conditionText={data.condition.text}
              uvIndex={data.uvIndex}
              windSpeed={data.windSpeed.toFixed(1)}
              windDirection={data.windDirection}
              rainChance={data.rainChance.toString()}
              humidity={data.humidity.toString()}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
