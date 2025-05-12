
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

type DailyForecastItem = z.infer<typeof DailyForecastItemZodSchema>;

interface TemperatureVariationChartProps {
  dailyData: readonly DailyForecastItem[];
}

const chartConfig = {
  maxTemp: {
    label: "Max Temp (°C)",
    color: "hsl(var(--chart-1))", 
  },
  minTemp: {
    label: "Min Temp (°C)",
    color: "hsl(var(--chart-2))", 
  },
} satisfies ChartConfig;

export function TemperatureVariationChart({ dailyData }: TemperatureVariationChartProps) {
  if (!dailyData || dailyData.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-md shadow-xl border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
            <Thermometer className="w-5 h-5 mr-2 text-primary" />
            Temperature Variation
          </CardTitle>
          <CardDescription>7-Day Temperature Trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/30 rounded-md">
            No temperature data available for the chart.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = dailyData.map(day => {
    const dateObj = parseISO(day.date); 
    return {
      name: `${day.dayName.substring(0,3)}, ${format(dateObj, "MMM d")}`,
      maxTemp: parseFloat(day.maxTemp.toFixed(1)),
      minTemp: parseFloat(day.minTemp.toFixed(1)),
    };
  });

  return (
    <Card className="bg-card/50 backdrop-blur-md shadow-xl border border-border/50">
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border)/0.5)" }}
                tickMargin={8}
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border)/0.5)" }}
                tickMargin={8}
                tickFormatter={(value) => `${value}°`} 
                className="text-xs fill-muted-foreground"
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" labelClassName="font-semibold" className="bg-popover/80 backdrop-blur-sm shadow-lg border-border/70" />}
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
                  stroke: "hsl(var(--background))",
                  fill: "var(--color-maxTemp)",
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
                   stroke: "hsl(var(--background))",
                  fill: "var(--color-minTemp)",
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
