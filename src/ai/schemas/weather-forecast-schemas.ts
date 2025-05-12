import { z } from 'genkit';

export const ConditionSchema = z.object({
  text: z.string().describe("e.g., 'Fog', 'Sunny', 'Light Rain', 'Partly Cloudy'"),
  // code: z.number().optional().describe("Optional weather condition code, if available"),
});

export const CurrentWeatherSchema = z.object({
  temperature: z.number().describe("Temperature in Celsius"),
  condition: ConditionSchema,
  maxTemp: z.number().describe("Maximum temperature for the day in Celsius"),
  minTemp: z.number().describe("Minimum temperature for the day in Celsius"),
  windSpeed: z.number().describe("Wind speed in km/h"),
  windDirection: z.string().describe("Wind direction, e.g., NW, E, S"),
  sunriseTime: z.string().describe("Sunrise time in HH:MM AM/PM format"),
  sunsetTime: z.string().describe("Sunset time in HH:MM AM/PM format"),
  humidity: z.number().min(0).max(100).describe("Humidity percentage (0-100)"),
  uvIndex: z.string().describe("UV index, e.g., '5 of 11' or a numerical value representing the max for the day"),
});

export const HourlyForecastItemSchema = z.object({
  time: z.string().describe("Time in HH:00 AM/PM format for the specific date"),
  temperature: z.number().describe("Temperature in Celsius"),
  condition: ConditionSchema,
  uvIndex: z.string().describe("UV index at this hour, e.g., '2 of 11'"),
  windSpeed: z.number().describe("Wind speed in km/h"),
  windDirection: z.string().describe("Wind direction"),
  rainChance: z.number().min(0).max(100).describe("Chance of rain percentage (0-100)"),
  humidity: z.number().min(0).max(100).describe("Humidity percentage (0-100)"),
});

export const DailyForecastItemSchema = z.object({
  date: z.string().describe("Date in YYYY-MM-DD format"),
  dayName: z.string().describe("Name of the day, e.g., 'Friday'"),
  condition: ConditionSchema,
  maxTemp: z.number().describe("Maximum temperature in Celsius"),
  minTemp: z.number().describe("Minimum temperature in Celsius"),
});

export const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe("City name, ZIP code, or coordinates (lat,lon)"),
  date: z.string().optional().describe("Date for the forecast in YYYY-MM-DD format. If not provided, use current date."),
});
export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

export const GetWeatherForecastOutputSchema = z.object({
  locationName: z.string().describe("The name of the location, reflecting the user's input closely (e.g., if input is 'nyc', output could be 'NYC' or 'New York City')."),
  displayDate: z.string().describe("Formatted date for display, e.g., 'Friday, July 14'"),
  current: CurrentWeatherSchema,
  hourly: z.array(HourlyForecastItemSchema).describe("24 hourly forecasts for the selected date"),
  daily: z.array(DailyForecastItemSchema).length(7).describe("7-day forecast starting from the selected date"),
});
export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;

