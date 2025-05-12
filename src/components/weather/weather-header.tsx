// src/components/weather/weather-header.tsx
"use client";

import type * as React from 'react';
import { MapPin, CalendarDays, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WeatherHeaderProps {
  location: string;
  date: string;
  currentTime: string;
}

export function WeatherHeader({ location, date, currentTime }: WeatherHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
      <div className="flex flex-col items-center sm:items-start">
        <div className="flex items-center text-xl sm:text-2xl font-semibold text-foreground mb-1">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-primary/80" />
          <span>{date}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-64 md:w-72">
          <Input
            type="text"
            placeholder="Search City or ZIP Code"
            className="bg-card/50 border-border/70 placeholder-muted-foreground text-sm pr-10"
            aria-label="Search City or ZIP Code"
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary">
             <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center text-lg sm:text-xl font-medium text-foreground bg-card/30 backdrop-blur-sm px-3 py-1.5 rounded-md">
          <Clock className="w-5 h-5 mr-2 text-primary/90" />
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  );
}
