
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { GetWeatherForecastOutput, GetWeatherForecastInput } from '@/ai/schemas/weather-forecast-schemas';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const date = searchParams.get('date');

  if (!location) {
    return NextResponse.json({ message: 'Location parameter is required' }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ message: 'Date parameter is required' }, { status: 400 });
  }

  const aspnetApiBaseUrl = process.env.ASPNET_API_BASE_URL;
  if (!aspnetApiBaseUrl) {
    console.error("ASPNET_API_BASE_URL environment variable is not set.");
    return NextResponse.json({ message: 'Backend API URL is not configured.' }, { status: 500 });
  }

  // Construct the URL for the ASP.NET Web API
  // Assuming the ASP.NET API endpoint is /api/WeatherForecast
  // And it accepts location and date as query parameters
  const apiUrl = `${aspnetApiBaseUrl}/api/WeatherForecast?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other necessary headers, like API keys for the ASP.NET API if required
      },
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error(`ASP.NET API request failed with status ${apiResponse.status}: ${errorBody}`);
      let errorMessage = `Error fetching weather data from backend: ${apiResponse.statusText}`;
      try {
        const parsedError = JSON.parse(errorBody);
        if (parsedError && parsedError.message) {
          errorMessage = parsedError.message;
        }
      } catch (e) {
        // If error body is not JSON or doesn't have message, use the text or statusText
        errorMessage = errorBody || `Error fetching weather data from backend: ${apiResponse.statusText}`;
      }
      return NextResponse.json({ message: errorMessage }, { status: apiResponse.status });
    }

    const data: GetWeatherForecastOutput = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error calling ASP.NET API:', error);
    let message = 'Failed to connect to the weather service.';
    if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
