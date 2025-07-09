
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Play,
  Pause,
  Share,
  Heart,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';

// Color palette presets
const palettePresets = {
  sunset: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  cyberpunk: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080', '#8000FF'],
  ocean: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
  pastel: ['#FFB6C1', '#E6E6FA', '#B0E0E6', '#F0E68C', '#DDA0DD'],
  forest: ['#2d5016', '#3e7b27', '#87a96b', '#c9d9b7', '#b8d0a7'],
  neon: ['#39FF14', '#FF073A', '#00BFFF', '#FFD700', '#FF1493'],
  vintage: ['#D4A574', '#8B4513', '#CD853F', '#DEB887', '#F4A460'],
  cosmic: ['#4B0082', '#8A2BE2', '#9400D3', '#FF69B4', '#FFB6C1']
};

// Social media templates
const socialTemplates = {
  'Instagram Post': { width: 1080, height: 1080, ratio: '1:1' },
  'Instagram Story': { width: 1080, height: 1920, ratio: '9:16' },
  'YouTube Banner': { width: 2560, height: 1440, ratio: '16:9' },
  'Twitter Header': { width: 1500, height: 500, ratio: '3:1' },
  'LinkedIn Cover': { width: 1584, height: 396, ratio: '4:1' },
  'Facebook Cover': { width: 1200, height: 630, ratio: '1.91:1' },
  'Desktop Wallpaper': { width: 1920, height: 1080, ratio: '16:9' },
  'Mobile Wallpaper': { width: 1080, height: 1920, ratio: '9:16' }
};

const Index = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State management
  const [colors, setColors] = useState(['#667eea', '#764ba2', '#f093fb']);
  const [selectedPreset, setSelectedPreset] = useState('ocean');
  const [filters, setFilters] = useState({
    grain: 0,
    blur: 0,
    contrast: 100,
    brightness: 100,
    hueShift: 0
  });
  const [canvasSettings, setCanvasSettings] = useState({
    width: 1080,
    height: 1080,
    scale: 1,
    aspectRatioLocked: true
  });
  const [selectedTemplate, setSelectedTemplate] = useState('Instagram Post');
  const [gradientType, setGradientType] = useState('linear');
  const [gradientDirection, setGradientDirection] = useState(45);
  const [isAnimated, setIsAnimated] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Generate CSS gradient
  const generateGradientCSS = useCallback(() => {
    const colorStops = colors.map((color, index) => 
      `${color} ${(index / (colors.length - 1)) * 100}%`
    ).join(', ');
    
    if (gradientType === 'radial') {
      return `radial-gradient(circle, ${colorStops})`;
    } else if (gradientType === 'conic') {
      return `conic-gradient(from ${gradientDirection}deg, ${colorStops})`;
    }
    return `linear-gradient(${gradientDirection}deg, ${colorStops})`;
  }, [colors, gradientType, gradientDirection]);

  // Apply filters to canvas
  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let filterString = '';
    if (filters.blur > 0) filterString += `blur(${filters.blur * 2}px) `;
    if (filters.contrast !== 100) filterString += `contrast(${filters.contrast}%) `;
    if (filters.brightness !== 100) filterString += `brightness(${filters.brightness}%) `;
    if (filters.hueShift !== 0) filterString += `hue-rotate(${filters.hueShift}deg) `;

    canvas.style.filter = filterString;
  }, [filters]);

  // Randomize colors
  const randomizeColors = () => {
    const newColors = [];
    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 50 + Math.floor(Math.random() * 50);
      const lightness = 40 + Math.floor(Math.random() * 40);
      newColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    setColors(newColors);
    toast({
      title: "Colors Randomized! ✨",
      description: "New gradient palette generated",
    });
  };

  // Load palette preset
  const loadPreset = (presetName: string) => {
    setColors([...palettePresets[presetName as keyof typeof palettePresets]]);
    setSelectedPreset(presetName);
    toast({
      title: `${presetName.charAt(0).toUpperCase() + presetName.slice(1)} Palette Loaded`,
      description: "Gradient updated with new colors",
    });
  };

  // Update canvas size from template
  const selectTemplate = (templateName: string) => {
    const template = socialTemplates[templateName as keyof typeof socialTemplates];
    setCanvasSettings(prev => ({
      ...prev,
      width: template.width,
      height: template.height
    }));
    setSelectedTemplate(templateName);
  };

  // Export gradient
  const exportGradient = async (format: 'png' | 'jpg' | 'svg' | 'css') => {
    setIsExporting(true);
    
    try {
      if (format === 'css') {
        const cssCode = `background: ${generateGradientCSS()};`;
        await navigator.clipboard.writeText(cssCode);
        toast({
          title: "CSS Copied! 📋",
          description: "Gradient CSS code copied to clipboard",
        });
      } else if (format === 'svg') {
        const svgContent = `
          <svg width="${canvasSettings.width}" height="${canvasSettings.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                ${colors.map((color, index) => 
                  `<stop offset="${(index / (colors.length - 1)) * 100}%" style="stop-color:${color}"/>`
                ).join('')}
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
          </svg>
        `;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `magicgrounds-gradient.svg`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Canvas export for PNG/JPG
        const canvas = document.createElement('canvas');
        canvas.width = canvasSettings.width;
        canvas.height = canvasSettings.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          colors.forEach((color, index) => {
            gradient.addColorStop(index / (colors.length - 1), color);
          });
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add grain effect if enabled
          if (filters.grain > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
              const noise = (Math.random() - 0.5) * filters.grain * 2;
              data[i] = Math.max(0, Math.min(255, data[i] + noise));
              data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
              data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
          
          // Download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `magicgrounds-gradient.${format}`;
              a.click();
              URL.revokeObjectURL(url);
            }
          }, `image/${format}`, 0.9);
        }
      }
      
      toast({
        title: "Export Successful! 🎉",
        description: `Gradient exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Copy color palette
  const copyPalette = async () => {
    const paletteText = colors.join(', ');
    await navigator.clipboard.writeText(paletteText);
    toast({
      title: "Palette Copied! 🎨",
      description: "Color codes copied to clipboard",
    });
  };

  // Update canvas filters
  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MagicGrounds
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6 overflow-y-auto">
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
                <TabsTrigger value="colors" className="data-[state=active]:bg-purple-500">
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="filters" className="data-[state=active]:bg-purple-500">
                  <Sliders className="w-4 h-4 mr-2" />
                  Filters
                </TabsTrigger>
                <TabsTrigger value="canvas" className="data-[state=active]:bg-purple-500">
                  <Monitor className="w-4 h-4 mr-2" />
                  Canvas
                </TabsTrigger>
              </TabsList>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-4">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Palette Presets
                      <Button 
                        onClick={randomizeColors}
                        size="sm" 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Shuffle className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(palettePresets).map(preset => (
                        <Button
                          key={preset}
                          onClick={() => loadPreset(preset)}
                          variant={selectedPreset === preset ? "default" : "outline"}
                          size="sm"
                          className={`capitalize border-white/20 ${
                            selectedPreset === preset 
                              ? 'bg-purple-500 hover:bg-purple-600' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {preset}
                        </Button>
                      ))}
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    <div className="space-y-3">
                      <Label className="text-white">Custom Colors</Label>
                      {colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...colors];
                              newColors[index] = e.target.value;
                              setColors(newColors);
                            }}
                            className="w-8 h-8 rounded border-white/20 bg-transparent cursor-pointer"
                          />
                          <Input
                            value={color}
                            onChange={(e) => {
                              const newColors = [...colors];
                              newColors[index] = e.target.value;
                              setColors(newColors);
                            }}
                            className="flex-1 bg-white/10 border-white/20 text-white"
                          />
                          {colors.length > 2 && (
                            <Button
                              onClick={() => setColors(colors.filter((_, i) => i !== index))}
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-red-500/20"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      {colors.length < 5 && (
                        <Button
                          onClick={() => setColors([...colors, '#ffffff'])}
                          size="sm"
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                          Add Color
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={copyPalette}
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Palette
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Gradient Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={gradientType} onValueChange={setGradientType}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                        <SelectItem value="conic">Conic</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {gradientType !== 'radial' && (
                      <div className="space-y-2">
                        <Label className="text-white">Direction: {gradientDirection}°</Label>
                        <Slider
                          value={[gradientDirection]}
                          onValueChange={(value) => setGradientDirection(value[0])}
                          max={360}
                          step={15}
                          className="w-full"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Filters Tab */}
              <TabsContent value="filters" className="space-y-4">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Visual Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-white">Grain: {filters.grain}%</Label>
                      <Slider
                        value={[filters.grain]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, grain: value[0] }))}
                        max={100}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Blur: {filters.blur}%</Label>
                      <Slider
                        value={[filters.blur]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, blur: value[0] }))}
                        max={100}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Contrast: {filters.contrast}%</Label>
                      <Slider
                        value={[filters.contrast]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, contrast: value[0] }))}
                        min={0}
                        max={200}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Brightness: {filters.brightness}%</Label>
                      <Slider
                        value={[filters.brightness]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, brightness: value[0] }))}
                        min={0}
                        max={200}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Hue Shift: {filters.hueShift}°</Label>
                      <Slider
                        value={[filters.hueShift]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, hueShift: value[0] }))}
                        min={0}
                        max={360}
                        className="w-full"
                      />
                      <div className="flex gap-1 mt-2">
                        {[15, 45, 90, 180, 270].map(deg => (
                          <Button
                            key={deg}
                            onClick={() => setFilters(prev => ({ ...prev, hueShift: deg }))}
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 text-xs"
                          >
                            {deg}°
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => setFilters({ grain: 0, blur: 0, contrast: 100, brightness: 100, hueShift: 0 })}
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Canvas Tab */}
              <TabsContent value="canvas" className="space-y-4">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={selectedTemplate} onValueChange={selectTemplate}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        {Object.keys(socialTemplates).map(template => (
                          <SelectItem key={template} value={template}>
                            {template}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="text-sm text-gray-400 text-center">
                      {canvasSettings.width} × {canvasSettings.height}
                      <br />
                      {socialTemplates[selectedTemplate as keyof typeof socialTemplates]?.ratio}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Custom Size</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label className="text-white text-sm">Width</Label>
                        <Input
                          type="number"
                          value={canvasSettings.width}
                          onChange={(e) => {
                            const width = parseInt(e.target.value) || 1080;
                            setCanvasSettings(prev => ({
                              ...prev,
                              width,
                              height: prev.aspectRatioLocked ? Math.round(width * (prev.height / prev.width)) : prev.height
                            }));
                          }}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <Button
                        onClick={() => setCanvasSettings(prev => ({ ...prev, aspectRatioLocked: !prev.aspectRatioLocked }))}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 mt-6"
                      >
                        {canvasSettings.aspectRatioLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </Button>
                      <div className="flex-1">
                        <Label className="text-white text-sm">Height</Label>
                        <Input
                          type="number"
                          value={canvasSettings.height}
                          onChange={(e) => {
                            const height = parseInt(e.target.value) || 1080;
                            setCanvasSettings(prev => ({
                              ...prev,
                              height,
                              width: prev.aspectRatioLocked ? Math.round(height * (prev.width / prev.height)) : prev.width
                            }));
                          }}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Scale: {canvasSettings.scale}x</Label>
                      <Slider
                        value={[canvasSettings.scale]}
                        onValueChange={(value) => setCanvasSettings(prev => ({ ...prev, scale: value[0] }))}
                        min={0.5}
                        max={3}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Animation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Animated Gradient</Label>
                      <Switch
                        checked={isAnimated}
                        onCheckedChange={setIsAnimated}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Show Watermark</Label>
                      <Switch
                        checked={showWatermark}
                        onCheckedChange={setShowWatermark}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative">
                <div
                  className={`rounded-lg shadow-2xl border border-white/20 backdrop-blur-sm ${
                    isAnimated ? 'animate-pulse' : ''
                  }`}
                  style={{
                    width: Math.min(400, canvasSettings.width * canvasSettings.scale),
                    height: Math.min(400, canvasSettings.height * canvasSettings.scale),
                    background: generateGradientCSS(),
                    filter: `blur(${filters.blur * 0.5}px) contrast(${filters.contrast}%) brightness(${filters.brightness}%) hue-rotate(${filters.hueShift}deg)`,
                  }}
                >
                  {showWatermark && (
                    <div className="absolute bottom-2 right-2 text-white/50 text-xs font-medium">
                      MagicGrounds
                    </div>
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  width={canvasSettings.width}
                  height={canvasSettings.height}
                />
              </div>
            </div>

            {/* Export Controls */}
            <div className="border-t border-white/20 p-6 bg-white/5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {selectedTemplate}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {canvasSettings.width} × {canvasSettings.height}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => exportGradient('css')}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    CSS
                  </Button>
                  <Button
                    onClick={() => exportGradient('svg')}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    SVG
                  </Button>
                  <Button
                    onClick={() => exportGradient('png')}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PNG
                  </Button>
                  <Button
                    onClick={() => exportGradient('jpg')}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'JPG'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
