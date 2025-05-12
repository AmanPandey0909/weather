import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure environment variables are loaded. This is especially important
// when running genkit commands or in environments where .env might not be auto-loaded.
// For Next.js app itself, .env.local or other .env files are usually handled by Next.js.
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
}

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV !== 'production') {
  console.warn(
    `
    ****************************************************************************************
    GOOGLE_API_KEY or GEMINI_API_KEY is not set in your environment variables.
    Genkit's Google AI plugin requires this key to function.

    Please create a .env file in the root of your project and add your API key:
    GOOGLE_API_KEY="YOUR_ACTUAL_API_KEY"
    
    You can obtain an API key from Google AI Studio: https://aistudio.google.com/app/apikey
    For more details, see: https://firebase.google.com/docs/genkit/plugins/google-genai
    ****************************************************************************************
    `
  );
}


export const ai = genkit({
  plugins: [
    googleAI({
      // The API key will be automatically picked up from GOOGLE_API_KEY or GEMINI_API_KEY 
      // environment variables if not explicitly provided here.
      // apiKey: apiKey 
    }),
  ],
  // It's generally recommended to set the model per-prompt or per-generate call
  // rather than globally, to allow for flexibility.
  // model: 'googleai/gemini-1.5-flash-latest', // Example model
});