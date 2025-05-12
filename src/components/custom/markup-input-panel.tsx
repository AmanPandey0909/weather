"use client";

import type * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface MarkupInputPanelProps {
  markupCode: string;
  setMarkupCode: (code: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  analysisResult: string;
  onGenerateMarkup: () => Promise<void>;
  onAnalyzeCode: () => Promise<void>;
  isLoadingMarkup: boolean;
  isLoadingAnalysis: boolean;
}

export function MarkupInputPanel({
  markupCode,
  setMarkupCode,
  description,
  setDescription,
  analysisResult,
  onGenerateMarkup,
  onAnalyzeCode,
  isLoadingMarkup,
  isLoadingAnalysis,
}: MarkupInputPanelProps) {
  return (
    <ScrollArea className="h-full bg-card">
      <div className="p-4 md:p-6 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Generate UI from Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description-input" className="mb-2 block text-sm font-medium text-foreground">
                Describe the UI you want to create:
              </Label>
              <Textarea
                id="description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A login form with email and password fields, and a submit button."
                rows={4}
                className="bg-background border-border focus:ring-primary"
              />
            </div>
            <Button onClick={onGenerateMarkup} disabled={isLoadingMarkup} className="w-full sm:w-auto">
              {isLoadingMarkup && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Markup
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Edit Markup (HTML/CSS)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={markupCode}
              onChange={(e) => setMarkupCode(e.target.value)}
              placeholder="Paste or type your HTML/CSS here..."
              className="h-64 min-h-[10rem] font-mono text-sm bg-background border-border focus:ring-primary"
              aria-label="Markup Code Input"
            />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Code Quality Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={onAnalyzeCode} disabled={isLoadingAnalysis || !markupCode} className="w-full sm:w-auto">
              {isLoadingAnalysis && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Code
            </Button>
            {analysisResult && (
              <div className="mt-4 p-4 bg-muted rounded-md border border-border">
                <h4 className="font-semibold mb-2 text-foreground">Analysis Feedback:</h4>
                <ScrollArea className="h-48">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono p-1">
                    {analysisResult}
                  </pre>
                </ScrollArea>
              </div>
            )}
            {!analysisResult && !isLoadingAnalysis && markupCode && (
                 <p className="mt-4 text-sm text-muted-foreground">Click "Analyze Code" to get feedback on your markup.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
