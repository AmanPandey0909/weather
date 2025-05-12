
'use server';
/**
 * @fileOverview A weather forecast AI agent.
 *
 * - getWeatherForecast - A function that handles fetching or generating weather forecast.
 * Input and Output types/schemas for this flow are defined in '@/ai/schemas/weather-forecast-schemas.ts'.
 */

import {ai} from '@/ai/genkit';
import { format, addDays, setHours, startOfDay } from 'date-fns';
import type { GetWeatherForecastInput, GetWeatherForecastOutput } from '@/ai/schemas/weather-forecast-schemas';
import { GetWeatherForecastInputSchema, GetWeatherForecastOutputSchema } from '@/ai/schemas/weather-forecast-schemas';

// Helper function to generate mock data (replace with actual LLM call for production)
function generateMockWeatherData(input: GetWeatherForecastInput): GetWeatherForecastOutput {
  const baseDate = input.date ? new Date(input.date + 'T12:00:00Z') : new Date(); // Use specific time to avoid timezone issues with date part
  const locationName = input.location || "Mock City, MC";

  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Fog", "Snow"];
  const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  const getRandomCondition = () => ({ text: conditions[Math.floor(Math.random() * conditions.length)] });
  const getRandomElement = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomNumber = (min: number, max: number, decimals = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

  const dailyBaseTemp = getRandomNumber(5, 25);

  return {
    locationName: locationName,
    displayDate: format(baseDate, "EEEE, MMMM d"),
    current: {
      temperature: getRandomNumber(dailyBaseTemp - 2, dailyBaseTemp + 5),
      condition: getRandomCondition(),
      maxTemp: getRandomNumber(dailyBaseTemp + 3, dailyBaseTemp + 8),
      minTemp: getRandomNumber(dailyBaseTemp - 5, dailyBaseTemp),
      windSpeed: getRandomNumber(1, 20),
      windDirection: getRandomElement(windDirections),
      sunriseTime: "06:00 AM", // Static for mock
      sunsetTime: "08:00 PM",  // Static for mock
      humidity: getRandomNumber(30, 90, 0),
      uvIndex: `${getRandomNumber(0,11,0)} of 11`,
    },
    hourly: Array.from({ length: 24 }).map((_, i) => {
      const hourDate = setHours(startOfDay(baseDate), i);
      return {
        time: format(hourDate, "hh:00 a"),
        temperature: getRandomNumber(dailyBaseTemp - 5 + (i/2), dailyBaseTemp + 5 + (i/3)),
        condition: getRandomCondition(),
        uvIndex: `${getRandomNumber(0, Math.min(11, Math.max(0, i-6)),0)} of 11`, // Simple UV based on hour
        windSpeed: getRandomNumber(1, 25),
        windDirection: getRandomElement(windDirections),
        rainChance: getRandomNumber(0, 100, 0),
        humidity: getRandomNumber(30, 95, 0),
      };
    }),
    daily: Array.from({ length: 7 }).map((_, i) => {
      const dayDate = addDays(baseDate, i);
      const dayTemp = dailyBaseTemp + getRandomNumber(-3, 3);
      return {
        date: format(dayDate, "yyyy-MM-dd"),
        dayName: format(dayDate, "EEEE"),
        condition: getRandomCondition(),
        maxTemp: getRandomNumber(dayTemp + 2, dayTemp + 7),
        minTemp: getRandomNumber(dayTemp - 6, dayTemp -1),
      };
    }),
  };
}


const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    // In a real scenario, you might use a prompt here to generate data with an LLM.
    // For now, we'll use the mock data generator for predictable output.
    // If you want to use LLM:
    // const llmResponse = await prompt(input);
    // return llmResponse.output()!;

    return generateMockWeatherData(input);
  }
);

// Example prompt definition (currently unused due to mock data)
const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  input: { schema: GetWeatherForecastInputSchema },
  output: { schema: GetWeatherForecastOutputSchema },
  prompt: `You are a weather API. Provide a detailed weather forecast for {{location}} on {{#if date}}{{date}}{{else}}today{{/if}}.
Respond in the JSON format defined by the output schema.
Ensure temperatures are in Celsius. Generate realistic sunrise and sunset times based on the location and date.
Hourly forecast should cover 24 hours of the specified date. Daily forecast should cover 7 days starting from the specified date.
For weather conditions, provide a concise text description (e.g., 'Partly Cloudy', 'Light Rain', 'Sunny').
For the 'current' weather field, provide a summary or snapshot of the weather for the specified 'date' (e.g., midday conditions if it's a future/past date, or actual current conditions if 'date' is today).
Location name in output should be the normalized version of the input location.
Display date in output should be formatted nicely (e.g., "Friday, July 14").
`,
});


export async function getWeatherForecast(input: GetWeatherForecastInput): Promise<GetWeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}
