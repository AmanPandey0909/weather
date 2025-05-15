
// src/app/page.tsx
"use client";

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { GetWeatherForecastOutput, GetWeatherForecastInput } from '@/ai/schemas/weather-forecast-schemas';
import { getWeatherForecast } from '@/ai/flows/get-weather-forecast-flow';
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
      
      // Call Genkit flow directly
      const input: GetWeatherForecastInput = { location: loc, date: formattedDate };
      const data: GetWeatherForecastOutput = await getWeatherForecast(input);

      setWeatherData(data);
      setLocation(data.locationName); // Update location from API response for consistency

      const theme = getThemeForWeather(data.current.condition.text);
      setCurrentTheme(theme);
      updateRootCSSVariables(theme.theme);
      document.documentElement.className = theme.mode;

    } catch (e: any) {
      console.error("Fetch weather data error:", e);
      let errorMessage = "Failed to load weather data using the AI service.";
      
      if (e.name === 'GenkitError' && e.status === 'UNAVAILABLE') {
        errorMessage = "The AI weather service is currently unavailable. Please try again later.";
      } else if (e.name === 'GenkitError' && e.status === 'INVALID_ARGUMENT') {
        errorMessage = `There was an issue with the request to the AI service: ${e.message}. Please check the location or date.`;
      } else if (e instanceof Error) {
        const lowerErrorMessage = e.message.toLowerCase();
        if (lowerErrorMessage.includes("api key not valid") || lowerErrorMessage.includes("gemini_api_key") || lowerErrorMessage.includes("google_api_key")) {
          errorMessage = "API Key for the AI service is invalid or missing. Please check your .env configuration for GOOGLE_API_KEY or GEMINI_API_KEY.";
        } else if (lowerErrorMessage.includes("failed_precondition") && (lowerErrorMessage.includes("api key") || lowerErrorMessage.includes("enable the api"))) {
          errorMessage = "AI Service API Key precondition failed. Ensure GOOGLE_API_KEY (or GEMINI_API_KEY) is correctly set and the Generative Language API is enabled in your Google Cloud project.";
        } else if (lowerErrorMessage.includes("llm did not return an output")) {
          errorMessage = "The AI model did not return a valid weather forecast. This might be a temporary issue with the AI service or the input parameters.";
        } else if (lowerErrorMessage.includes("model not found") || (e.status && e.status.toString().startsWith('NOT_FOUND'))){
            errorMessage = "The specified AI model for weather forecast is not found or not accessible. Please check the Genkit configuration."
        } else if (e.message) { 
          errorMessage = e.message;
        }
      }
      
      if (e.message && (e.message.toLowerCase().includes('quota exceeded') || e.message.toLowerCase().includes('resource has been exhausted'))) {
        errorMessage = "The AI service quota has been exceeded. Please check your usage limits or try again later.";
      }

      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Fetching Weather",
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
    const minDate = startOfDay(subDays(today, MAX_PAST_DAYS));
    const maxDate = endOfDay(addDays(today, MAX_FUTURE_DAYS)); 
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
    const newSelectedDate = startOfDay(parseISO(dateStr)); 
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
          fill
          style={{objectFit: "cover"}}
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

