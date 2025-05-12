
// src/app/page.tsx
"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import { WeatherHeader } from '@/components/weather/weather-header';
import { CurrentWeather } from '@/components/weather/current-weather';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { DailyForecast } from '@/components/weather/daily-forecast';
import { getWeatherForecast } from '@/ai/flows/get-weather-forecast-flow';
import type { GetWeatherForecastOutput, GetWeatherForecastInput } from '@/ai/schemas/weather-forecast-schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { format, subDays, addDays, isFuture, isPast } from 'date-fns';

export default function WeatherPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [location, setLocation] = useState<string>("New York, US"); // Default location
  const [weatherData, setWeatherData] = useState<GetWeatherForecastOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  const fetchWeatherData = async (currentLocation: string, date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const input: GetWeatherForecastInput = {
        location: currentLocation,
        date: format(date, "yyyy-MM-dd"),
      };
      const data = await getWeatherForecast(input);
      setWeatherData(data);
    } catch (e) {
      console.error("Failed to fetch weather data:", e);
      setError("Failed to load weather data. Please try again.");
      setWeatherData(null); // Clear old data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(location, selectedDate);
  }, [location, selectedDate]);

  const handleLocationSearch = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleDateChange = (newDate: Date) => {
    // Prevent selecting dates too far in the future or past if necessary
    // This logic is already in the Calendar component's disabled prop,
    // but good to have a safeguard here if direct date manipulation was possible.
    setSelectedDate(newDate);
  };

  const handlePreviousDay = () => {
    const newDate = subDays(selectedDate, 1);
    // Add any hard limits if needed, e.g., not before 5 years ago
    if (!isPast(addDays(newDate, - (365*5)))) { // Example: Check if newDate is not more than 5 years ago
       setSelectedDate(newDate);
    }
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    // Add any hard limits if needed, e.g., not more than 30 days in future
    if (!isFuture(subDays(newDate, 31))) { // Example: Check if newDate is not more than 30 days ahead
        setSelectedDate(newDate);
    }
  };
  
  const backgroundImageUrl = "https://picsum.photos/seed/weather/1920/1080";

  return (
    <div 
      className="bg-cover bg-center min-h-screen text-foreground relative font-sans selection:bg-primary/70 selection:text-primary-foreground"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      data-ai-hint="cloudy sky"
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div> {/* Overlay */}
      
      <main className="relative z-10 p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
        <WeatherHeader 
          currentLocation={weatherData?.locationName || location}
          onSearchLocation={handleLocationSearch}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          currentTime={currentTime || "Loading..."}
          displayDate={weatherData?.displayDate || format(selectedDate, "EEEE, MMMM d")}
        />

        {isLoading && (
          <div className="space-y-6 md:space-y-8">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[250px] w-full rounded-lg" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="bg-card/50 backdrop-blur-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && weatherData && (
          <>
            <CurrentWeather 
              currentWeather={weatherData.current}
              locationName={weatherData.locationName}
            />
            <HourlyForecast hourlyData={weatherData.hourly} />
            <DailyForecast dailyData={weatherData.daily} />
          </>
        )}
      </main>
      <footer className="relative z-10 text-center p-4 text-xs text-muted-foreground">
        Weather data is illustrative and may be generated by AI. UI concept.
      </footer>
    </div>
  );
}
