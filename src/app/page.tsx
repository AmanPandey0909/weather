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

const initialMarkup = `
<style>
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    background-color: #E0E7FF; /* Light Lavender */
    margin: 0; 
    color: #374151; /* Cool Gray */
    overflow: hidden; /* Prevents scrollbars from appearing from body margin */
  }
  .container { 
    padding: 30px; 
    background-color: white; 
    border-radius: 12px; 
    box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
    text-align: center; 
    max-width: 400px;
  }
  h1 { 
    color: #008080; /* Teal */
    font-size: 1.8rem;
    margin-bottom: 0.5em;
  }
  p { 
    color: #4B5563; /* Darker Cool Gray */
    font-size: 1rem;
    line-height: 1.6;
  }
  .emoji {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5em;
  }
</style>
<div class="container">
  <span class="emoji">✨</span>
  <h1>Welcome to UI Mirror!</h1>
  <p>Enter a description or HTML/CSS code on the left to see your UI magically appear here.</p>
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
    // Optional: Show a loading spinner or skeleton screen until client-side hydration is complete
    // This helps prevent layout shifts or issues with resizable panels before hydration
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
        className="flex-grow min-h-0" // flex-grow and min-h-0 are important for filling space
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

// Added Loader2 from lucide-react for the initial loading state
import { Loader2 } from "lucide-react";
