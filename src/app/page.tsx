// src/app/page.tsx
"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import { WeatherHeader } from '@/components/weather/weather-header';
import { CurrentWeather } from '@/components/weather/current-weather';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { DailyForecast } from '@/components/weather/daily-forecast';
import { CloudFog, Cloud, MapPin } from 'lucide-react'; // CloudFog for main current condition, Cloud for default general

export default function WeatherPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  const weatherData = {
    location: "Los Angeles, US",
    temperature: "16.5",
    condition: "Fog",
    WeatherIcon: CloudFog, // Specific icon for current condition
    maxTemp: "33.2", // From image, seems high for LA fog, but matching image
    minTemp: "16",   // From image
    windSpeed: "2.8",
    windDirection: "NW",
    sunriseTime: "05:52 AM",
    sunsetTime: "08:05 PM",
    humidity: "95", // From hourly forecast for 05:00 AM
    uvIndex: "0 of 11" // From hourly forecast for 05:00 AM
  };
  
  // Placeholder background image. Replace with a more thematic one if available.
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
          location={weatherData.location}
          date={currentDate || "Friday, 14 July"} // Fallback to image date
          currentTime={currentTime || "05:05 AM"} // Fallback to image time
        />
        <CurrentWeather 
          temperature={weatherData.temperature}
          condition={weatherData.condition}
          WeatherIcon={weatherData.WeatherIcon}
          maxTemp={weatherData.maxTemp}
          minTemp={weatherData.minTemp}
          windSpeed={weatherData.windSpeed}
          windDirection={weatherData.windDirection}
          sunriseTime={weatherData.sunriseTime}
          sunsetTime={weatherData.sunsetTime}
          humidity={weatherData.humidity}
          uvIndex={weatherData.uvIndex}
        />
        <HourlyForecast />
        <DailyForecast />
      </main>
      <footer className="relative z-10 text-center p-4 text-xs text-muted-foreground">
        Weather data is illustrative. UI concept.
      </footer>
    </div>
  );
}
