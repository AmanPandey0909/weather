import { Sun, Cloud, CloudSun, CloudRain, CloudFog, Zap, Snowflake, Wind as WindIcon, CloudDrizzle, Cloudy, Thermometer, Droplets, Sunrise, Sunset, MapPin, CalendarDays, Clock, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function getWeatherIcon(conditionText?: string): LucideIcon {
  if (!conditionText) return Cloud; // Default icon
  const lowerCondition = conditionText.toLowerCase();

  if (lowerCondition.includes("sun") && (lowerCondition.includes("cloud") || lowerCondition.includes("partly"))) return CloudSun;
  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) return Sun;
  if (lowerCondition.includes("fog") || lowerCondition.includes("mist") || lowerCondition.includes("haze")) return CloudFog;
  if (lowerCondition.includes("rain")) {
     if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) return Zap; // More specific for thunderstorms
     if (lowerCondition.includes("heavy")) return CloudRain; // Heavy rain
     return CloudDrizzle; // Light rain / drizzle
  }
  if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) return Zap;
  if (lowerCondition.includes("snow") || lowerCondition.includes("sleet")) return Snowflake;
  if (lowerCondition.includes("wind")) return WindIcon; 
  if (lowerCondition.includes("overcast")) return Cloudy;
  if (lowerCondition.includes("cloud")) return Cloud; // General cloud

  // Fallback for common icons by name if no keywords match
  switch(lowerCondition) {
    case "thermometer": return Thermometer;
    case "droplets": return Droplets;
    case "sunrise": return Sunrise;
    case "sunset": return Sunset;
    case "mappin": return MapPin;
    case "calendardays": return CalendarDays;
    case "clock": return Clock;
    case "search": return Search;
    default: return Cloud; // Default fallback
  }
}
