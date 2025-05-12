"use client";

import { useState, useEffect } from 'react';
import { MarkupInputPanel } from '@/components/custom/markup-input-panel';
import { UIRenderPanel } from '@/components/custom/ui-render-panel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useToast } from "@/hooks/use-toast";
import { generateMarkup } from '@/ai/flows/markup-generator';
import type { GenerateMarkupInput, GenerateMarkupOutput } from '@/ai/flows/markup-generator';
import { analyzeCodeQuality } from '@/ai/flows/code-quality-analyzer';
import type { AnalyzeCodeQualityInput, AnalyzeCodeQualityOutput } from '@/ai/flows/code-quality-analyzer';
import { Loader2 } from "lucide-react";

const initialMarkup = `
<style>
  body { 
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100%; /* Fill iframe */
    background-color: #f8f9fa; /* Light neutral gray */
    margin: 0; 
    color: #212529; /* Standard dark gray text */
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto; /* Allow scroll if content overflows */
  }
  .container { 
    padding: 2rem; 
    background-color: #ffffff; /* White background for container */
    border-radius: 8px; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.1); 
    max-width: 450px;
    width: 100%;
  }
  h1 { 
    color: #343a40; /* Darker gray for heading */
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
  p { 
    color: #495057; /* Medium gray for paragraph */
    font-size: 1rem;
    line-height: 1.6;
  }
  .emoji {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 1rem;
  }
</style>
<div class="container">
  <span class="emoji">🖼️</span>
  <h1>UI Mirror</h1>
  <p>Describe your UI or paste HTML/CSS code on the left. Your creation will appear here!</p>
</div>
`;

export default function Home() {
  const [markupCode, setMarkupCode] = useState<string>(initialMarkup);
  const [description, setDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoadingMarkup, setIsLoadingMarkup] = useState<boolean>(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleGenerateMarkup = async () => {
    if (!description.trim()) {
      toast({ 
        title: "Description Required", 
        description: "Please enter a description for the UI you want to generate.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingMarkup(true);
    setAnalysisResult(''); 
    try {
      const input: GenerateMarkupInput = { description };
      const result: GenerateMarkupOutput = await generateMarkup(input);
      setMarkupCode(result.markup);
      toast({ 
        title: "Markup Generated", 
        description: "UI markup has been successfully generated from your description." 
      });
    } catch (error) {
      console.error("Error generating markup:", error);
      toast({ 
        title: "Generation Failed", 
        description: "Could not generate markup. Please try again or check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMarkup(false);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!markupCode.trim()) {
      toast({ 
        title: "Markup Required", 
        description: "Please enter or generate markup code to analyze.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingAnalysis(true);
    setAnalysisResult('');
    try {
      const input: AnalyzeCodeQualityInput = { code: markupCode };
      const result: AnalyzeCodeQualityOutput = await analyzeCodeQuality(input);
      setAnalysisResult(result.feedback);
      toast({ 
        title: "Analysis Complete", 
        description: "Code quality analysis has been successfully completed." 
      });
    } catch (error) {
      console.error("Error analyzing code:", error);
      toast({ 
        title: "Analysis Failed", 
        description: "Could not analyze code. Please try again or check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="flex-grow min-h-0"
      >
        <ResizablePanel defaultSize={40} minSize={25} className="min-w-[300px]">
          <MarkupInputPanel
            markupCode={markupCode}
            setMarkupCode={setMarkupCode}
            description={description}
            setDescription={setDescription}
            analysisResult={analysisResult}
            onGenerateMarkup={handleGenerateMarkup}
            onAnalyzeCode={handleAnalyzeCode}
            isLoadingMarkup={isLoadingMarkup}
            isLoadingAnalysis={isLoadingAnalysis}
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors duration-200" />
        <ResizablePanel defaultSize={60} minSize={30} className="min-w-[300px]">
          <UIRenderPanel markupCode={markupCode} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
