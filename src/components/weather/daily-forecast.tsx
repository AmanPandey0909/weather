// src/components/weather/daily-forecast.tsx
"use client";

import type * as React from 'react';
import { DailyForecastItem } from './daily-forecast-item';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { GetWeatherForecastOutput } from '@/ai/flows/get-weather-forecast-flow';
import { format, isEqual, startOfDay } from 'date-fns';


interface DailyForecastProps {
  dailyData: GetWeatherForecastOutput['daily'];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DailyForecast({ dailyData, selectedDate, onDateSelect }: DailyForecastProps) {
   if (!dailyData || dailyData.length === 0) {
    return (
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">7 Days Forecast</h2>
        <p className="text-muted-foreground">No daily forecast data available.</p>
      </div>
    );
  }

  const normalizedSelectedDate = startOfDay(selectedDate);

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">7 Days Forecast</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 sm:space-x-3 pb-4">
          {dailyData.map((data, index) => {
            const dateObj = new Date(data.date + 'T00:00:00Z'); // Parse as UTC midnight
            const normalizedItemDate = startOfDay(dateObj);
            const isSelected = isEqual(normalizedSelectedDate, normalizedItemDate);
            
            return (
              <DailyForecastItem 
                key={index} 
                dayName={data.dayName}
                dateString={format(dateObj, "MMM d")} 
                conditionText={data.condition.text}
                maxTemp={data.maxTemp.toFixed(1)}
                minTemp={data.minTemp.toFixed(1)}
                fullDate={dateObj}
                onDateSelect={onDateSelect}
                isSelected={isSelected}
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
