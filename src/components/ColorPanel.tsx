import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shuffle, HelpCircle, Plus } from "lucide-react";

interface ColorPanelProps {
  colors: string[];
  selectedPreset: string;
  onColorsChange: (colors: string[]) => void;
  onPresetChange: (preset: string) => void;
  onRandomize: () => void;
}

const palettePresets = [
  { name: 'Sunset', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
  { name: 'Ocean', colors: ['#667eea', '#764ba2', '#f093fb'] },
  { name: 'Pastel', colors: ['#FFB6C1', '#E6E6FA', '#B0E0E6'] },
  { name: 'Forest', colors: ['#2d5016', '#3e7b27', '#87a96b'] },
  { name: 'Vintage', colors: ['#D4A574', '#8B4513', '#CD853F'] },
  { name: 'Neon', colors: ['#39FF14', '#FF073A', '#00BFFF'] }
];

export function ColorPanel({ colors, selectedPreset, onColorsChange, onPresetChange, onRandomize }: ColorPanelProps) {
  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    onColorsChange(newColors);
  };

  const addColor = () => {
    if (colors.length < 5) {
      onColorsChange([...colors, '#ffffff']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      onColorsChange(colors.filter((_, i) => i !== index));
    }
  };

  const loadPreset = (presetName: string) => {
    const preset = palettePresets.find(p => p.name === presetName);
    if (preset) {
      onColorsChange(preset.colors);
      onPresetChange(presetName);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Custom Palette */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">Custom Palette</h3>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {colors.map((color, index) => (
            <div key={index} className="relative group">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer hover:border-ring transition-colors"
              />
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(index)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {colors.length < 5 && (
            <Button
              variant="outline"
              size="sm"
              onClick={addColor}
              className="w-10 h-10 rounded-lg border-dashed text-muted-foreground"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRandomize}
          className="w-full"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Randomize colors
        </Button>
      </div>

      {/* Palette Presets */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Choose Palette:</h3>
        <Select value={selectedPreset} onValueChange={loadPreset}>
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
    </div>
  );
}