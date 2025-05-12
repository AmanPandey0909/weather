
// src/app/page.tsx
"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import { WeatherHeader } from '@/components/weather/weather-header';
import { CurrentWeather } from '@/components/weather/current-weather';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { DailyForecast } from '@/components/weather/daily-forecast';
import { LocationMap } from '@/components/weather/location-map';
import { getWeatherForecast } from '@/ai/flows/get-weather-forecast-flow';
import type { GetWeatherForecastOutput, GetWeatherForecastInput } from '@/ai/schemas/weather-forecast-schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { format, subDays, addDays, isBefore, isAfter, startOfDay } from 'date-fns';

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
      let errorMessage = "Failed to load weather data. Please try again.";
      if (e instanceof Error && e.message) {
        errorMessage = e.message.includes("API key not valid") 
          ? "Invalid API Key. Please check your .env configuration." 
          : `Failed to load weather data: ${e.message.substring(0, 100)}${e.message.length > 100 ? '...' : ''}`;
      }
      setError(errorMessage);
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

  const isDateDisabled = (dateToTest: Date): boolean => {
    const fiveYearsAgo = subDays(new Date(), 365 * 5);
    const thirtyDaysHence = addDays(new Date(), 30);
    // Normalize dates to midnight to compare calendar days correctly
    const normalizedDateToTest = startOfDay(dateToTest);
    const normalizedFiveYearsAgo = startOfDay(fiveYearsAgo);
    const normalizedThirtyDaysHence = startOfDay(thirtyDaysHence);

    return isAfter(normalizedDateToTest, normalizedThirtyDaysHence) || isBefore(normalizedDateToTest, normalizedFiveYearsAgo);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && !isDateDisabled(newDate)) {
      setSelectedDate(startOfDay(newDate));
    }
  };

  const handlePreviousDay = () => {
    const newDate = subDays(selectedDate, 1);
    if (!isDateDisabled(newDate)) {
       setSelectedDate(startOfDay(newDate));
    }
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    if (!isDateDisabled(newDate)) {
        setSelectedDate(startOfDay(newDate));
    }
  };
  
  const backgroundImageUrl = "https://picsum.photos/seed/sky/1920/1080";

  return (
    <div 
      className="bg-center min-h-screen text-foreground relative font-sans selection:bg-primary/70 selection:text-primary-foreground animate-bg-pan"
      style={{ 
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: '150% auto', 
        backgroundRepeat: 'no-repeat',
      }}
      data-ai-hint="cloudy sky landscape"
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div> 
      
      <main className="relative z-10 p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto space-y-6 md:space-y-8">
        <WeatherHeader 
          currentLocation={weatherData?.locationName || location}
          onSearchLocation={handleLocationSearch}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          currentTime={currentTime || "Loading..."}
          displayDate={weatherData?.displayDate || format(selectedDate, "EEEE, MMMM d")}
          isDateDisabled={isDateDisabled}
        />

        {isLoading && (
          <div className="space-y-6 md:space-y-8">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[250px] w-full rounded-lg" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[350px] w-full rounded-lg" /> 
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
            <DailyForecast 
              dailyData={weatherData.daily}
              selectedDate={selectedDate}
              onDateSelect={handleDateChange}
            />
            <LocationMap 
              latitude={weatherData.latitude}
              longitude={weatherData.longitude}
              locationName={weatherData.locationName}
            />
          </>
        )}
         {!isLoading && !error && !weatherData && ( 
          <Alert variant="default" className="bg-card/50 backdrop-blur-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Weather Data</AlertTitle>
            <AlertDescription>Could not load weather information. Please try searching for a location or refreshing.</AlertDescription>
          </Alert>
        )}
      </main>
      <footer className="relative z-10 text-center p-4 text-xs text-muted-foreground">
        Weather data is illustrative and may be generated by AI. UI concept.
      </footer>
    </div>
  );
}
