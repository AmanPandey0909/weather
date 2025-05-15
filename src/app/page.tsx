
// src/app/page.tsx
"use client";

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { GetWeatherForecastOutput } from '@/ai/schemas/weather-forecast-schemas';
import { WeatherHeader } from '@/components/weather/weather-header';
import { CurrentWeather } from '@/components/weather/current-weather';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { DailyForecast } from '@/components/weather/daily-forecast';
import { LocationMap } from '@/components/weather/location-map';
import { TemperatureVariationChart } from '@/components/weather/temperature-variation-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { format, addDays, subDays, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { getThemeForWeather, updateRootCSSVariables, WeatherStyle } from '@/lib/theme-utils';
import Image from 'next/image';

const MAX_PAST_DAYS = 7;
const MAX_FUTURE_DAYS = 7;

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<GetWeatherForecastOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('New York'); // Default location
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentTheme, setCurrentTheme] = useState<WeatherStyle | null>(null);
  const { toast } = useToast();

  const fetchWeatherData = useCallback(async (loc: string, date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/weather?location=${encodeURIComponent(loc)}&date=${formattedDate}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `API request failed with status ${response.status}. Please check if the backend service is running and accessible.` }));
        throw new Error(errorData.message || `API request failed with status ${response.status}. Ensure the backend service (ASP.NET) is operational and the API URL is correctly configured.`);
      }
      
      const data: GetWeatherForecastOutput = await response.json();

      // Ensure daily forecast dates are parsed correctly into Date objects for the state if needed elsewhere,
      // or handle directly in components. For selectedDate logic, it's already a Date.
      // If `data.daily` contains date strings, components like DailyForecast parse them.
      setWeatherData(data);
      setLocation(data.locationName); // Update location from API response for consistency

      const theme = getThemeForWeather(data.current.condition.text);
      setCurrentTheme(theme);
      updateRootCSSVariables(theme.theme);
      document.documentElement.className = theme.mode;

    } catch (e: any) {
      console.error("Fetch weather data error:", e);
      let errorMessage = "Failed to load weather data.";
      if (e instanceof Error) {
        const lowerErrorMessage = e.message.toLowerCase();
        if (lowerErrorMessage.includes("api key not valid") || lowerErrorMessage.includes("gemini_api_key")) {
          errorMessage = "API Key is invalid or missing. Please check your .env configuration.";
        } else if (lowerErrorMessage.includes("failed_precondition") && lowerErrorMessage.includes("api key")) {
           errorMessage = "Genkit API Key precondition failed. Ensure GOOGLE_API_KEY or GEMINI_API_KEY is correctly set in your environment variables.";
        } else if (lowerErrorMessage.includes("fetch failed")) {
           errorMessage = "The weather data service is currently unreachable. This could be due to the backend service (ASP.NET) not running, an incorrect API URL configuration (ASPNET_API_BASE_URL in .env), or a network issue between this application and the backend. Please verify the backend service status and configuration.";
        } else if (lowerErrorMessage.includes("llm did not return an output")) {
            errorMessage = "The AI model did not return a valid weather forecast. This might be a temporary issue with the AI service or the input parameters. Please try again later or with a different location/date.";
        } else if (e.message.includes("Backend API URL is not configured")) {
            errorMessage = "The backend weather API (ASP.NET) is not configured. Please set the ASPNET_API_BASE_URL environment variable in your .env file.";
        }
         else {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      const defaultThemeStyle = getThemeForWeather('default');
      setCurrentTheme(defaultThemeStyle);
      updateRootCSSVariables(defaultThemeStyle.theme);
      document.documentElement.className = defaultThemeStyle.mode;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWeatherData(location, selectedDate);
  }, [fetchWeatherData, location, selectedDate]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (!currentTheme && weatherData?.current?.condition?.text) {
      const initialTheme = getThemeForWeather(weatherData.current.condition.text);
      setCurrentTheme(initialTheme);
      updateRootCSSVariables(initialTheme.theme);
      document.documentElement.className = initialTheme.mode;
    } else if (!currentTheme) {
      const defaultThemeStyle = getThemeForWeather('default');
      setCurrentTheme(defaultThemeStyle);
      updateRootCSSVariables(defaultThemeStyle.theme);
      document.documentElement.className = defaultThemeStyle.mode;
    }
  }, [weatherData, currentTheme]);


  const handleSearchLocation = (newLocation: string) => {
    setLocation(newLocation);
  };

  const isDateDisabledCallback = useCallback((date: Date): boolean => {
    const today = startOfDay(new Date());
    // Ensure comparison is with start of day for min/max to avoid time-of-day issues
    const minDate = startOfDay(subDays(today, MAX_PAST_DAYS));
    const maxDate = endOfDay(addDays(today, MAX_FUTURE_DAYS)); // Use end of day for max to include the full last day
    return !isWithinInterval(startOfDay(date), { start: minDate, end: maxDate });
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    if (date && !isDateDisabledCallback(date)) {
      setSelectedDate(startOfDay(date));
    } else if (date) {
       toast({
        variant: "default",
        title: "Date out of range",
        description: `Please select a date within ${MAX_PAST_DAYS} days in the past and ${MAX_FUTURE_DAYS} days in the future.`,
      });
    }
  };
  
  const handlePreviousDay = () => {
    const prevDay = subDays(selectedDate, 1);
    if (!isDateDisabledCallback(prevDay)) {
      setSelectedDate(prevDay);
    }
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
     if (!isDateDisabledCallback(nextDay)) {
      setSelectedDate(nextDay);
    }
  };
  
  const handleDailyForecastSelect = (dateStr: string) => {
    // Assuming dateStr is 'YYYY-MM-DD' from daily forecast data
    const newSelectedDate = startOfDay(parseISO(dateStr)); // Use parseISO for YYYY-MM-DD
    if (!isDateDisabledCallback(newSelectedDate)) {
        setSelectedDate(newSelectedDate);
    } else {
        toast({
            variant: "default",
            title: "Date out of range",
            description: "Cannot select this date from the daily forecast as it's out of the allowed range.",
        });
    }
  };

  return (
    <div className="relative min-h-screen transition-colors duration-500">
      {currentTheme && currentTheme.backgroundImageUrl && (
        <Image
          src={currentTheme.backgroundImageUrl}
          alt={currentTheme.aiHint || "Weather background image"}
          fill // Changed from layout="fill"
          style={{objectFit: "cover"}} // Changed from objectFit="cover"
          quality={85}
          className="opacity-30 dark:opacity-20 transition-opacity duration-1000 z-0"
          data-ai-hint={currentTheme.aiHint}
          priority
        />
      )}
      <div className="relative z-10 container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {isLoading && !weatherData && (
          <>
            <Skeleton className="h-12 w-3/4 mb-6 md:mb-8" />
            <Skeleton className="h-48 w-full mb-6 md:mb-8" />
            <Skeleton className="h-64 w-full mb-6 md:mb-8" />
            <Skeleton className="h-40 w-full mb-6 md:mb-8" />
          </>
        )}

        {error && !isLoading && (
           <Alert variant="destructive" className="mb-6 bg-destructive/20 backdrop-blur-sm border-destructive/50">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Fetching Weather Data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {weatherData && (
          <>
            <WeatherHeader
              currentLocation={weatherData.locationName}
              onSearchLocation={handleSearchLocation}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
              currentTime={currentTime}
              displayDate={weatherData.displayDate}
              isDateDisabled={isDateDisabledCallback}
            />
            <CurrentWeather 
              currentWeather={weatherData.current} 
              locationName={weatherData.locationName} 
            />
            <HourlyForecast hourlyData={weatherData.hourly} />
            <DailyForecast 
              dailyData={weatherData.daily} 
              selectedDate={selectedDate}
              onDateSelect={handleDailyForecastSelect}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
              <TemperatureVariationChart dailyData={weatherData.daily} />
              <LocationMap 
                latitude={weatherData.latitude} 
                longitude={weatherData.longitude}
                locationName={weatherData.locationName}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

