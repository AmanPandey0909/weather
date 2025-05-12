// src/components/weather/temperature-variation-chart.tsx
"use client";

import type * as React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { DailyForecastItemSchema as DailyForecastItemZodSchema } from '@/ai/schemas/weather-forecast-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Thermometer } from 'lucide-react';
import type { z } from 'genkit/zod';

// Infer the type from the Zod schema
type DailyForecastItem = z.infer<typeof DailyForecastItemZodSchema>;

interface TemperatureVariationChartProps {
  dailyData: readonly DailyForecastItem[];
}

const chartConfig = {
  maxTemp: {
    label: "Max Temp (°C)",
    color: "hsl(var(--chart-1))", // Reddish color for max temp
  },
  minTemp: {
    label: "Min Temp (°C)",
    color: "hsl(var(--chart-2))", // Bluish color for min temp
  },
} satisfies ChartConfig;

export function TemperatureVariationChart({ dailyData }: TemperatureVariationChartProps) {
  if (!dailyData || dailyData.length === 0) {
    return (
      <Card className="bg-card/30 backdrop-blur-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
            <Thermometer className="w-5 h-5 mr-2 text-primary" />
            Temperature Variation
          </CardTitle>
          <CardDescription>7-Day Temperature Trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No temperature data available for the chart.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = dailyData.map(day => {
    // The date from AI is YYYY-MM-DD. parseISO can handle this directly.
    // Or ensure it's treated as local if that's the intent. For consistency with display, using parseISO is robust.
    const dateObj = parseISO(day.date); 
    return {
      name: `${day.dayName.substring(0,3)}, ${format(dateObj, "MMM d")}`,
      maxTemp: parseFloat(day.maxTemp.toFixed(1)),
      minTemp: parseFloat(day.minTemp.toFixed(1)),
    };
  });

  return (
    <Card className="bg-card/30 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
            <Thermometer className="w-5 h-5 mr-2 text-primary" />
            Temperature Variation
        </CardTitle>
        <CardDescription>7-Day Temperature Trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: -15, 
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}°`} // Shorten to just degree symbol
                className="text-xs fill-muted-foreground"
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" labelClassName="font-semibold" className="bg-card/80 backdrop-blur-sm shadow-lg" />}
              />
              <ChartLegend content={<ChartLegendContent iconClassName="mr-1.5" className="text-sm"/>} />
              <Line
                dataKey="maxTemp"
                type="monotone"
                stroke="var(--color-maxTemp)"
                strokeWidth={2.5}
                dot={{
                  fill: "var(--color-maxTemp)",
                  r: 3,
                  strokeWidth: 1,
                  stroke: "hsl(var(--background))"
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                }}
                 name="Max Temp"
              />
              <Line
                dataKey="minTemp"
                type="monotone"
                stroke="var(--color-minTemp)"
                strokeWidth={2.5}
                dot={{
                  fill: "var(--color-minTemp)",
                  r: 3,
                  strokeWidth: 1,
                  stroke: "hsl(var(--background))"
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                }}
                name="Min Temp"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
