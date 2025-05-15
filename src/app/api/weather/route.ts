
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This API route is no longer the primary source for weather data.
// The frontend now calls the Genkit AI flow directly.
// This route is kept to avoid 404s if old clients try to access it,
// but it will return a message indicating its deprecated status.
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'This API endpoint is deprecated. Weather data is now fetched directly using Genkit AI flows from the client-side application.',
      details: 'Please update your application to use the appropriate client-side Genkit integration if you were relying on this endpoint.'
    }, 
    { status: 410 } // HTTP 410 Gone
  );
}
