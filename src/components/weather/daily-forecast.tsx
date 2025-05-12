// src/components/weather/daily-forecast.tsx
"use client";

import type * as React from 'react';
import { DailyForecastItem } from './daily-forecast-item';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { GetWeatherForecastOutput } from '@/ai/flows/get-weather-forecast-flow';
import { format } from 'date-fns';


interface DailyForecastProps {
  dailyData: GetWeatherForecastOutput['daily'];
}

export function DailyForecast({ dailyData }: DailyForecastProps) {
   if (!dailyData || dailyData.length === 0) {
    return (
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">7 Days Forecast</h2>
        <p className="text-muted-foreground">No daily forecast data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">7 Days Forecast</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 sm:space-x-3 pb-4">
          {dailyData.map((data, index) => {
            // The date from API is YYYY-MM-DD. We need to parse it correctly.
            // Adding 'T00:00:00Z' to treat it as UTC to avoid timezone issues when formatting.
            const dateObj = new Date(data.date + 'T00:00:00Z'); 
            return (
              <DailyForecastItem 
                key={index} 
                dayName={data.dayName}
                // Format date as "14th July" (example) or "Jul 14"
                date={format(dateObj, "MMM d")} 
                conditionText={data.condition.text}
                maxTemp={data.maxTemp.toFixed(1)}
                minTemp={data.minTemp.toFixed(1)}
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

