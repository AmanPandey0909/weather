
// src/lib/theme-utils.ts
"use client";

export interface ThemeVariables {
  background: string; // HSL string like "220 30% 97%"
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  // Chart colors can also be themed if desired
  // chart1: string;
  // chart2: string;
}

export interface WeatherStyle {
  name: string;
  backgroundImageUrl: string;
  aiHint: string;
  mode: "light" | "dark";
  theme: ThemeVariables;
}

const defaultDarkTheme: ThemeVariables = {
  background: "220 30% 10%",
  foreground: "220 15% 85%",
  card: "220 25% 16%",
  cardForeground: "220 15% 85%",
  popover: "220 25% 16%",
  popoverForeground: "220 15% 85%",
  primary: "225 70% 60%",
  primaryForeground: "210 40% 98%",
  secondary: "220 20% 22%",
  secondaryForeground: "225 70% 60%",
  muted: "220 20% 18%",
  mutedForeground: "220 10% 50%",
  accent: "220 25% 22%",
  accentForeground: "225 70% 65%",
  destructive: "0 70% 50%",
  destructiveForeground: "0 0% 98%",
  border: "220 20% 28%",
  input: "220 25% 12%",
  ring: "225 70% 55%",
};

const defaultLightTheme: ThemeVariables = {
  background: "0 0% 100%", // Was 220 30% 97%
  foreground: "220 25% 15%",
  card: "0 0% 100%",
  cardForeground: "220 25% 15%",
  popover: "0 0% 100%",
  popoverForeground: "220 25% 15%",
  primary: "225 70% 55%",
  primaryForeground: "210 40% 98%",
  secondary: "220 20% 94%",
  secondaryForeground: "225 70% 55%",
  muted: "220 20% 90%",
  mutedForeground: "220 10% 45%",
  accent: "220 20% 96%",
  accentForeground: "225 70% 55%",
  destructive: "0 84% 60%",
  destructiveForeground: "0 0% 98%",
  border: "220 15% 88%",
  input: "220 20% 96%",
  ring: "225 70% 60%",
};


const weatherThemeMap: Record<string, WeatherStyle> = {
  sunny: {
    name: "Sunny",
    backgroundImageUrl: "https://picsum.photos/seed/sunnyday/1920/1080",
    aiHint: "sunny landscape",
    mode: "light",
    theme: {
      ...defaultLightTheme,
      background: "45 100% 95%", // Light yellow
      primary: "40 100% 50%", // Orange
      accent: "50 100% 90%",
    },
  },
  clear: { // Alias for sunny
    name: "Clear",
    backgroundImageUrl: "https://picsum.photos/seed/clearsky/1920/1080",
    aiHint: "clear sky",
    mode: "light",
    theme: {
      ...defaultLightTheme,
      background: "200 100% 95%", // Light blue
      primary: "210 100% 55%", // Bright blue
      accent: "200 100% 90%",
    },
  },
  rainy: {
    name: "Rainy",
    backgroundImageUrl: "https://picsum.photos/seed/rainycity/1920/1080",
    aiHint: "rainy city street",
    mode: "dark",
    theme: {
      ...defaultDarkTheme,
      background: "220 40% 20%", // Darker blue-gray
      primary: "210 70% 50%", // Muted blue
      accent: "220 30% 30%",
    },
  },
  cloudy: {
    name: "Cloudy",
    backgroundImageUrl: "https://picsum.photos/seed/cloudysky/1920/1080",
    aiHint: "overcast sky clouds",
    mode: "dark", // Can be light too, making it neutral dark
    theme: {
      ...defaultDarkTheme,
      background: "220 20% 25%", // Neutral gray-blue
      primary: "220 40% 60%", // Lighter gray-blue
      accent: "220 20% 35%",
    },
  },
   partly_cloudy: {
    name: "Partly Cloudy",
    backgroundImageUrl: "https://picsum.photos/seed/partlycloudy/1920/1080",
    aiHint: "partly cloudy sky",
    mode: "light",
    theme: {
      ...defaultLightTheme,
      background: "210 60% 92%", // Soft blueish white
      primary: "220 70% 60%",
      accent: "210 50% 85%",
    },
  },
  snowy: {
    name: "Snowy",
    backgroundImageUrl: "https://picsum.photos/seed/snowylandscape/1920/1080",
    aiHint: "snowy forest winter",
    mode: "light",
    theme: {
      ...defaultLightTheme,
      background: "200 50% 96%", // Very light cool gray
      primary: "190 80% 60%", // Ice blue
      foreground: "200 20% 30%",
      accent: "200 40% 90%",
    },
  },
  stormy: {
    name: "Stormy",
    backgroundImageUrl: "https://picsum.photos/seed/stormysky/1920/1080",
    aiHint: "storm clouds lightning",
    mode: "dark",
    theme: {
      ...defaultDarkTheme,
      background: "240 50% 5%", // Very dark blue/purple
      primary: "260 70% 65%", // Electric purple for accents
      accent: "240 40% 15%",
      destructive: "30 100% 50%", // Fiery orange for destructive
    },
  },
  foggy: {
    name: "Foggy",
    backgroundImageUrl: "https://picsum.photos/seed/foggymorning/1920/1080",
    aiHint: "foggy forest mist",
    mode: "light",
    theme: {
      ...defaultLightTheme,
      background: "210 20% 85%", // Muted light gray
      foreground: "210 15% 35%",
      primary: "210 30% 55%", // Muted blue
      accent: "210 20% 75%",
    },
  },
  default: {
    name: "Default",
    backgroundImageUrl: "https://picsum.photos/seed/defaultweather/1920/1080",
    aiHint: "moody sky landscape",
    mode: "dark",
    theme: defaultDarkTheme,
  },
};

export function getThemeForWeather(conditionText?: string): WeatherStyle {
  if (!conditionText) return weatherThemeMap.default;

  const lowerCondition = conditionText.toLowerCase();

  if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) return weatherThemeMap.stormy;
  if (lowerCondition.includes("snow") || lowerCondition.includes("sleet") || lowerCondition.includes("blizzard")) return weatherThemeMap.snowy;
  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle") || lowerCondition.includes("shower")) return weatherThemeMap.rainy;
  if (lowerCondition.includes("fog") || lowerCondition.includes("mist") || lowerCondition.includes("haze")) return weatherThemeMap.foggy;
  if (lowerCondition.includes("sun") && (lowerCondition.includes("cloud") || lowerCondition.includes("partly"))) return weatherThemeMap.partly_cloudy;
  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) return weatherThemeMap.sunny;
  if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) return weatherThemeMap.cloudy;
  
  return weatherThemeMap.default;
}

export function updateRootCSSVariables(theme: ThemeVariables) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
}
