'use server';
/**
 * @fileOverview A weather forecast AI agent.
 *
 * - getWeatherForecast - A function that handles fetching or generating weather forecast.
 * Input and Output types/schemas for this flow are defined in '@/ai/schemas/weather-forecast-schemas.ts'.
 */

import {ai} from '@/ai/genkit';
import type { GetWeatherForecastInput, GetWeatherForecastOutput } from '@/ai/schemas/weather-forecast-schemas';
import { GetWeatherForecastInputSchema, GetWeatherForecastOutputSchema } from '@/ai/schemas/weather-forecast-schemas';

const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    
    if (!llmResponse.output) {
      console.error("LLM did not return an output for weather forecast.", llmResponse);
      // Consider the case where the response might have safety ratings or finish reasons indicating an issue.
      const finishReason = llmResponse.candidates[0]?.finishReason;
      const safetyRatings = llmResponse.candidates[0]?.safetyRatings;
      let errorMessage = "Failed to generate weather forecast from AI. No output received.";
      if (finishReason && finishReason !== "STOP") {
        errorMessage += ` Finish Reason: ${finishReason}.`;
      }
      if (safetyRatings && safetyRatings.some(r => r.category !== "HARM_CATEGORY_UNSPECIFIED" && r.blocked)) {
        errorMessage += ` Content may have been blocked by safety filters.`;
      }
      throw new Error(errorMessage);
    }
    
    return llmResponse.output;
  }
);

const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Added model here
  input: { schema: GetWeatherForecastInputSchema },
  output: { schema: GetWeatherForecastOutputSchema },
  prompt: `You are a sophisticated weather API. Provide a detailed and realistic weather forecast for the location "{{location}}" on {{#if date}}the date "{{date}}"{{else}}today{{/if}}.
Respond strictly in the JSON format defined by the output schema. Do not add any explanatory text outside the JSON structure.

Key instructions for your response:
- Temperatures: All temperatures must be in Celsius.
- Location Name: The 'locationName' field in your output JSON should be exactly "{{location}}". Do not abbreviate or expand it. If the user enters "NYC", output "NYC". If they enter "New York City", output "New York City".
- Display Date: The 'displayDate' field should be a human-readable format of the target date (e.g., "Friday, July 14").
- Current Weather ('current' field):
    - If the target date is today, provide realistic current weather conditions for "{{location}}".
    - If the target date is in the past, provide plausible historical weather conditions for that day.
    - If the target date is in the future, provide a general forecast snapshot for that day (e.g., midday conditions).
- Sunrise/Sunset: Generate realistic sunrise and sunset times based on "{{location}}" and the target date.
- Hourly Forecast: Provide a 24-hour forecast for the specified target date. Each hour should have realistic data.
- Daily Forecast: Provide a 7-day forecast starting from the specified target date.
- Weather Conditions: Use concise and common weather condition descriptions (e.g., 'Sunny', 'Partly Cloudy', 'Light Rain', 'Heavy Thunderstorms', 'Foggy', 'Snow Showers').
- UV Index: Provide realistic UV index values appropriate for the time of day/year and location.
- Wind: Provide wind speed in km/h and a standard wind direction (e.g., N, NE, SW).
- Humidity & Rain Chance: Provide realistic percentages (0-100).

Generate a complete and valid JSON object according to the schema.
`,
});


export async function getWeatherForecast(input: GetWeatherForecastInput): Promise<GetWeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}

