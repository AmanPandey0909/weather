
// src/components/weather/weather-header.tsx
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MapPin, CalendarDays, Clock, Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';

interface WeatherHeaderProps {
  currentLocation: string;
  onSearchLocation: (location: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  currentTime: string;
  displayDate: string;
  isDateDisabled: (date: Date) => boolean;
}

export function WeatherHeader({ 
  currentLocation, 
  onSearchLocation, 
  selectedDate, 
  onDateChange,
  onPreviousDay,
  onNextDay,
  currentTime,
  displayDate,
  isDateDisabled
}: WeatherHeaderProps) {
  const [searchInput, setSearchInput] = useState(currentLocation);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (searchInput.trim()) {
      onSearchLocation(searchInput.trim());
    }
  };

  useEffect(() => {
    setSearchInput(currentLocation);
  }, [currentLocation]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center text-xl sm:text-2xl font-semibold text-foreground mb-1">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
          <span>{currentLocation}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-primary/80" />
          <span>{displayDate}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full md:w-auto">
        <form onSubmit={handleSearch} className="relative w-full sm:w-auto md:w-56">
          <Input
            type="text"
            placeholder="Search City or ZIP"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-input/70 border-border/70 placeholder-muted-foreground text-sm pr-10 backdrop-blur-sm"
            aria-label="Search City or ZIP Code"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary">
             <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="flex items-center gap-1 bg-card/50 backdrop-blur-sm px-2 py-1.5 rounded-md border border-border/50">
          <Button variant="ghost" size="icon" onClick={onPreviousDay} className="h-7 w-7 hover:bg-accent/70" disabled={isDateDisabled(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="h-7 w-auto px-2 text-xs bg-background/50 hover:bg-accent/70 border-border/70 text-foreground"
              >
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {format(selectedDate, "MMM d")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border shadow-xl backdrop-blur-md" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                initialFocus
                disabled={isDateDisabled}
              />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={onNextDay} className="h-7 w-7 hover:bg-accent/70" disabled={isDateDisabled(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center text-base sm:text-lg font-medium text-foreground bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-md border border-border/50">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary/90" />
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  );
}
