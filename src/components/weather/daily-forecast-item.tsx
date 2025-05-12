// src/components/weather/daily-forecast-item.tsx
"use client";

import type * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherIcon } from '@/lib/weather-utils';

interface DailyForecastItemProps {
  dayName: string;
  date: string;
  conditionText: string; // Changed from WeatherIcon
  maxTemp: string;
  minTemp: string;
}

export function DailyForecastItem({
  dayName,
  date,
  conditionText,
  maxTemp,
  minTemp,
}: DailyForecastItemProps) {
  const WeatherIcon = getWeatherIcon(conditionText);

  return (
    <Card className="bg-primary/20 hover:bg-primary/30 transition-colors duration-200 border-primary/30 shadow-md flex-1 min-w-[120px] sm:min-w-[140px]">
      <CardContent className="p-3 sm:p-4 text-center flex flex-col items-center justify-between h-full">
        <div>
          <p className="text-sm sm:text-base font-medium text-primary-foreground">{dayName}</p>
          <p className="text-xs text-primary-foreground/80 mb-2">{date}</p>
        </div>
        <WeatherIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground my-2 sm:my-3" data-ai-hint={conditionText || "weather condition"} />
        <div>
          <p className="text-sm sm:text-base font-semibold text-primary-foreground">{maxTemp}°C / {minTemp}°C</p>
        </div>
      </CardContent>
    </Card>
  );
}
