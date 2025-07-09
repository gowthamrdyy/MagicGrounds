import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, Palette, Menu } from 'lucide-react';

import { AppSidebar } from '@/components/AppSidebar';
import { ColorPanel } from '@/components/ColorPanel';
import { FilterPanel } from '@/components/FilterPanel';
import { CanvasPanel } from '@/components/CanvasPanel';
import { ExportPanel } from '@/components/ExportPanel';

const Index = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [colors, setColors] = useState(['#667eea', '#764ba2', '#f093fb']);
  const [selectedPreset, setSelectedPreset] = useState('Ocean');
  const [activeTab, setActiveTab] = useState('colors');
  const [filters, setFilters] = useState({
    grain: 0,
    blur: 0,
    contrast: 100,
    brightness: 100,
    hue: 0
  });
  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
    scale: 0.8
  });

  // Generate gradient
  const generateGradient = () => {
    const colorStops = colors.map((color, index) => 
      `${color} ${(index / (colors.length - 1)) * 100}%`
    ).join(', ');
    return `linear-gradient(135deg, ${colorStops})`;
  };

  // Randomize colors
  const randomizeColors = () => {
    const newColors = [];
    for (let i = 0; i < 3; i++) {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 50 + Math.floor(Math.random() * 50);
      const lightness = 40 + Math.floor(Math.random() * 40);
      newColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    setColors(newColors);
    toast({
      title: "Colors randomized",
      description: "New gradient palette generated",
    });
  };

  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'colors':
        return (
          <ColorPanel
            colors={colors}
            selectedPreset={selectedPreset}
            onColorsChange={setColors}
            onPresetChange={setSelectedPreset}
            onRandomize={randomizeColors}
          />
        );
      case 'filters':
        return (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
          />
        );
      case 'canvas':
        return (
          <CanvasPanel
            canvasSize={canvasSize}
            onCanvasSizeChange={setCanvasSize}
          />
        );
      case 'export':
        return (
          <ExportPanel
            generateGradient={generateGradient}
            colors={colors}
            canvasSize={canvasSize}
            filters={filters}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="px-4 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SidebarTrigger className="md:hidden" />
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-lg md:text-xl font-semibold text-foreground">
                    MagicGrounds
                  </h1>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">Export</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Sidebar Content for Mobile */}
            <div className="lg:hidden border-b border-border">
              {renderSidebarContent()}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/20 min-h-[400px]">
              <div className="relative max-w-full max-h-full">
                <div
                  ref={canvasRef}
                  className="rounded-lg md:rounded-xl shadow-lg border border-border max-w-full max-h-full"
                  style={{
                    width: `min(${canvasSize.width * canvasSize.scale}px, 90vw)`,
                    height: `min(${canvasSize.height * canvasSize.scale}px, 60vh)`,
                    background: generateGradient(),
                    filter: `
                      contrast(${filters.contrast}%) 
                      brightness(${filters.brightness}%) 
                      hue-rotate(${filters.hue}deg)
                      ${filters.blur > 0 ? `blur(${filters.blur * 0.1}px)` : ''}
                    `,
                  }}
                >
                  {/* Grain overlay */}
                  {filters.grain > 0 && (
                    <div
                      className="absolute inset-0 rounded-lg md:rounded-xl opacity-30 mix-blend-overlay"
                      style={{
                        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        opacity: filters.grain / 100,
                      }}
                    />
                  )}
                  
                  {/* Watermark */}
                  <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-background/80 backdrop-blur-sm rounded px-2 md:px-3 py-1 md:py-1.5 text-foreground text-xs md:text-sm font-medium border border-border">
                    MagicGrounds
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Sidebar Content */}
            <div className="hidden lg:block lg:w-80 border-l border-border bg-muted/30 overflow-y-auto">
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;