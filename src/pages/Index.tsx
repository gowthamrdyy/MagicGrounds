import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Copy, 
  Shuffle, 
  Palette, 
  Sliders, 
  Monitor, 
  Lock, 
  Unlock,
  RotateCcw,
  Save,
  HelpCircle,
  Plus
} from 'lucide-react';

// Color palette presets
const palettePresets = [
  { name: 'Sunset', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
  { name: 'Ocean', colors: ['#667eea', '#764ba2', '#f093fb'] },
  { name: 'Pastel', colors: ['#FFB6C1', '#E6E6FA', '#B0E0E6'] },
  { name: 'Forest', colors: ['#2d5016', '#3e7b27', '#87a96b'] },
  { name: 'Vintage', colors: ['#D4A574', '#8B4513', '#CD853F'] },
  { name: 'Neon', colors: ['#39FF14', '#FF073A', '#00BFFF'] }
];

// Aspect ratios
const aspectRatios = [
  { width: 1, height: 1 },
  { width: 2, height: 1 },
  { width: 16, height: 9 },
  { width: 4, height: 3 },
  { width: 3, height: 2 },
  { width: 7, height: 4 },
  { width: 8, height: 7 },
  { width: 16, height: 9 },
  { width: 1, height: 2 },
  { width: 1, height: 3 },
  { width: 2, height: 3 },
  { width: 3, height: 4 }
];

const Index = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [colors, setColors] = useState(['#667eea', '#764ba2', '#f093fb']);
  const [selectedPreset, setSelectedPreset] = useState('Ocean');
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
    scale: 1
  });

  // Generate gradient
  const generateGradient = () => {
    const colorStops = colors.map((color, index) => 
      `${color} ${(index / (colors.length - 1)) * 100}%`
    ).join(', ');
    return `linear-gradient(135deg, ${colorStops})`;
  };

  // Update color
  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                MagicGrounds
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-muted/30 border-r border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Custom Palette */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Custom Palette</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex space-x-2 mb-4">
                {colors.map((color, index) => (
                  <div key={index} className="relative group">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer hover:border-ring transition-colors"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 rounded-lg border-dashed text-muted-foreground"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={randomizeColors}
                className="w-full"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize colors
              </Button>
            </div>

            {/* Palette Presets */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4">Choose Palette:</h3>
              <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  {palettePresets.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {preset.colors.slice(0, 3).map((color, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span>{preset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sliders className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Filters</h3>
              </div>
              <div className="space-y-4">
                {/* Grain */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Grain ({filters.grain}%):
                  </label>
                  <Slider
                    value={[filters.grain]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, grain: value[0] }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                {/* Blur */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Blur ({filters.blur}%):
                  </label>
                  <Slider
                    value={[filters.blur]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, blur: value[0] }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Contrast ({filters.contrast}%):
                  </label>
                  <Slider
                    value={[filters.contrast]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, contrast: value[0] }))}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Brightness */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Brightness ({filters.brightness}%):
                  </label>
                  <Slider
                    value={[filters.brightness]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, brightness: value[0] }))}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Hue Shift */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Hue ({filters.hue}°):
                  </label>
                  <Slider
                    value={[filters.hue]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, hue: value[0] }))}
                    max={360}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[0, 15, 30, 45, 60, 90].map((deg) => (
                      <Button
                        key={deg}
                        variant="outline"
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, hue: deg }))}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        {deg}°
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ grain: 0, blur: 0, contrast: 100, brightness: 100, hue: 0 })}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refresh filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
            <div className="relative">
              <div
                ref={canvasRef}
                className="rounded-xl shadow-lg border border-border"
                style={{
                  width: `${canvasSize.width * canvasSize.scale}px`,
                  height: `${canvasSize.height * canvasSize.scale}px`,
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
                    className="absolute inset-0 rounded-xl opacity-30 mix-blend-overlay"
                    style={{
                      background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      opacity: filters.grain / 100,
                    }}
                  />
                )}
                
                {/* Watermark */}
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-foreground text-sm font-medium border border-border">
                  MagicGrounds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Canvas Controls */}
        <div className="w-80 bg-muted/30 border-l border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Canvas Size */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Canvas Size</h3>
              </div>
              
              {/* Template Dropdown */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-2 block">Choose Template:</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram Post (1080x1080)</SelectItem>
                    <SelectItem value="youtube">YouTube Banner (2560x1440)</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Background (1584x396)</SelectItem>
                    <SelectItem value="twitter">Twitter Header (1500x500)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Width:</label>
                  <Input
                    type="number"
                    value={canvasSize.width}
                    onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Height:</label>
                  <Input
                    type="number"
                    value={canvasSize.height}
                    onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                  />
                </div>
              </div>

              {/* Scale */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-2 block">Scale:</label>
                <div className="flex space-x-2">
                  {[0.5, 1, 2].map((scale) => (
                    <Button
                      key={scale}
                      variant={canvasSize.scale === scale ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCanvasSize(prev => ({ ...prev, scale }))}
                    >
                      {scale}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratios */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Ratio:</label>
                <div className="grid grid-cols-3 gap-2">
                  {aspectRatios.map((ratio) => (
                    <Button
                      key={`${ratio.width}:${ratio.height}`}
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasSize(prev => ({ 
                        ...prev, 
                        width: ratio.width * 100, 
                        height: ratio.height * 100 
                      }))}
                      className="text-xs"
                    >
                      {ratio.width}:{ratio.height}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4">Export</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy CSS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;