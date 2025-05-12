import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure environment variables are loaded. This is especially important
// when running genkit commands or in environments where .env might not be auto-loaded.
// For Next.js app itself, .env.local or other .env files are usually handled by Next.js.
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  // Using require for path and dotenv to ensure they are available in this context
  // and to avoid potential ESM/CJS issues in varied environments.
  const path = require('path');
  const dotenv = require('dotenv');
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const placeholderKey = "YOUR_ACTUAL_API_KEY_HERE";

if ((!apiKey || apiKey === placeholderKey) && process.env.NODE_ENV !== 'production') {
  console.warn(
    `
    ****************************************************************************************
    GOOGLE_API_KEY or GEMINI_API_KEY is not set or is still the placeholder value
    in your environment variables (.env file).
    Genkit's Google AI plugin requires a valid API key to function.

    Please create or update the .env file in the root of your project and add your API key:
    GOOGLE_API_KEY="YOUR_VALID_API_KEY"
    
    You can obtain an API key from Google AI Studio: https://aistudio.google.com/app/apikey
    For more details, see: https://firebase.google.com/docs/genkit/plugins/google-genai
    ****************************************************************************************
    `
  );
}

const effectiveApiKey = (apiKey && apiKey !== placeholderKey) ? apiKey : undefined;

export const ai = genkit({
  plugins: [
    googleAI(effectiveApiKey ? { apiKey: effectiveApiKey } : {}),
  ],
  // It's generally recommended to set the model per-prompt or per-generate call
  // rather than globally, to allow for flexibility.
  // model: 'googleai/gemini-1.5-flash-latest', // Example model
});
