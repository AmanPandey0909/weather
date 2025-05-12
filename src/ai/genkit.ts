
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Load .env for non-Next.js environments (e.g., genkit CLI) in development
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  const path = require('path');
  const dotenv = require('dotenv');
  // Attempt to load .env file from the project root.
  // In Next.js, environment variables are typically loaded by the framework itself from .env, .env.local, etc.
  // This explicit dotenv.config() is more for `genkit` CLI tool context.
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const apiKeyFromEnv = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const placeholderValue = "YOUR_ACTUAL_API_KEY_HERE"; // A common placeholder string
const validPlaceholderValue = "YOUR_VALID_API_KEY_HERE"; // Another common placeholder string

if (process.env.NODE_ENV !== 'production') {
  if (!apiKeyFromEnv) {
    console.warn(
      `
      ****************************************************************************************
      IMPORTANT: GOOGLE_API_KEY or GEMINI_API_KEY is not set in your environment.
      Genkit's Google AI plugin requires a valid API key for most operations.

      Please create or update the .env file in the root of your project (e.g., .env.local for Next.js)
      and add your API key:
      GOOGLE_API_KEY="YOUR_VALID_API_KEY"
      
      You can obtain an API key from Google AI Studio: https://aistudio.google.com/app/apikey
      For more details, see: https://firebase.google.com/docs/genkit/plugins/google-genai

      The application will attempt to initialize the Google AI plugin without an explicit key.
      This might work if Application Default Credentials (ADC) are configured in your environment
      (e.g., when running on Google Cloud). Otherwise, API calls will likely fail.
      ****************************************************************************************
      `
    );
  } else if (apiKeyFromEnv === placeholderValue || apiKeyFromEnv === validPlaceholderValue) {
    console.warn(
      `
      ****************************************************************************************
      WARNING: Your GOOGLE_API_KEY or GEMINI_API_KEY is set to a placeholder value
      ("${apiKeyFromEnv}"). This is not a valid API key.

      Please update your .env file (e.g., .env.local for Next.js) with your actual API key:
      GOOGLE_API_KEY="YOUR_VALID_API_KEY"
      
      You can obtain an API key from Google AI Studio: https://aistudio.google.com/app/apikey
      ****************************************************************************************
      `
    );
  }
}

// Configure the GoogleAI plugin.
// Pass the API key only if it's set and not a known placeholder.
// If apiKeyFromEnv is undefined, null, an empty string, or a placeholder,
// pass an empty object {} to googleAI(). This allows the SDK to try to find credentials
// through other means (e.g., Application Default Credentials if running in a Google Cloud environment).
const googleAIConfig = 
  (apiKeyFromEnv && apiKeyFromEnv !== placeholderValue && apiKeyFromEnv !== validPlaceholderValue)
  ? { apiKey: apiKeyFromEnv }
  : {};

export const ai = genkit({
  plugins: [
    googleAI(googleAIConfig),
  ],
  // It's generally recommended to set the model per-prompt or per-generate call
  // rather than globally, to allow for flexibility.
  // model: 'googleai/gemini-1.5-flash-latest', // Example model
});
