// src/components/weather/daily-forecast-item.tsx
"use client";

import type * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherIcon } from '@/lib/weather-utils';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DailyForecastItemProps {
  dayName: string;
  dateString: string; // Formatted date for display e.g., "Jul 14"
  conditionText: string;
  maxTemp: string;
  minTemp: string;
  fullDate: Date; // The actual Date object this item represents
  onDateSelect?: (date: Date) => void;
  isSelected: boolean;
}

export function DailyForecastItem({
  dayName,
  dateString,
  conditionText,
  maxTemp,
  minTemp,
  fullDate,
  onDateSelect,
  isSelected,
}: DailyForecastItemProps) {
  const WeatherIcon = getWeatherIcon(conditionText);

  const handleSelect = () => {
    onDateSelect?.(fullDate);
  };

  return (
    <Card
      className={cn(
        "bg-primary/20 hover:bg-primary/30 transition-colors duration-200 border-primary/30 shadow-md flex-1 min-w-[120px] sm:min-w-[140px] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
        isSelected && "ring-2 ring-primary-foreground ring-offset-1 ring-offset-background/80"
      )}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`View weather forecast for ${dayName}, ${dateString}. ${isSelected ? "Currently selected." : "Select to view details for this day."}`}
    >
      <CardContent className="p-3 sm:p-4 text-center flex flex-col items-center justify-between h-full">
        <div>
          <p className="text-sm sm:text-base font-medium text-primary-foreground">{dayName}</p>
          <p className="text-xs text-primary-foreground/80 mb-2">{dateString}</p>
        </div>
        <WeatherIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground my-2 sm:my-3" data-ai-hint={conditionText || "weather condition"} />
        <div>
          <p className="text-sm sm:text-base font-semibold text-primary-foreground">{maxTemp}°C / {minTemp}°C</p>
        </div>
      </CardContent>
    </Card>
  );
}
