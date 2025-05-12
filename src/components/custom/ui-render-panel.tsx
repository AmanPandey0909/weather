"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UIRenderPanelProps {
  markupCode: string;
}

export function UIRenderPanel({ markupCode }: UIRenderPanelProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [currentMarkup, setCurrentMarkup] = useState("");

  useEffect(() => {
    // This effect tries to create a smoother visual transition
    // by briefly showing an opacity change.
    setIsRendering(true);
    // Update currentMarkup after a very short delay to allow CSS transition to catch the opacity change.
    const renderTimeout = setTimeout(() => {
      setCurrentMarkup(markupCode);
      // Transition out of "rendering" state
      const visualClearTimeout = setTimeout(() => setIsRendering(false), 50); 
      return () => clearTimeout(visualClearTimeout);
    }, 50); // Small delay before updating srcDoc

    return () => {
      clearTimeout(renderTimeout);
    };
  }, [markupCode]);


  return (
    <Card className="h-full flex flex-col shadow-md bg-card">
      <CardHeader>
        <CardTitle>Rendered UI</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 md:p-1"> {/* Remove padding for iframe to touch edges or add minimal padding */}
        <iframe
          srcDoc={currentMarkup}
          title="UI Render"
          className="w-full h-full border-0 rounded-b-md md:rounded-md"
          style={{ 
            opacity: isRendering ? 0.3 : 1, 
            transition: 'opacity 0.2s ease-in-out',
            backgroundColor: 'white', // Explicit background for iframe content area
           }}
          sandbox="allow-scripts allow-same-origin" // allow-forms allow-popups allow-modals
          data-ai-hint="web browser"
        />
      </CardContent>
    </Card>
  );
}
