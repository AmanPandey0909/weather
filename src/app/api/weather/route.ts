
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
    return NextResponse.json({ message: 'Backend API URL is not configured. Please set ASPNET_API_BASE_URL in your .env file.' }, { status: 500 });
  }

  const apiUrl = `${aspnetApiBaseUrl}/api/WeatherForecast?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
        errorMessage = errorBody || `Error fetching weather data from backend: ${apiResponse.statusText}`;
      }
      return NextResponse.json({ message: errorMessage }, { status: apiResponse.status });
    }

    const data: GetWeatherForecastOutput = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error calling ASP.NET API:', error);
    let detailedMessage = 'An unexpected error occurred while trying to contact the backend weather service.';
    if (error instanceof Error) {
      // Check for common fetch failure messages or TypeError which can indicate network issues
      if (error.message.toLowerCase().includes('fetch failed') || error.name === 'TypeError') {
        detailedMessage = `Failed to connect to the ASP.NET weather backend at ${aspnetApiBaseUrl}. Please ensure the service is running and the ASPNET_API_BASE_URL environment variable is correctly configured. Original error: ${error.message}`;
      } else {
        detailedMessage = `Error communicating with the ASP.NET weather backend: ${error.message}`;
      }
    }
    return NextResponse.json({ message: detailedMessage }, { status: 500 });
  }
}
