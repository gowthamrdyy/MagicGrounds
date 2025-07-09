import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

interface FilterPanelProps {
  filters: {
    grain: number;
    blur: number;
    contrast: number;
    brightness: number;
    hue: number;
  };
  onFiltersChange: (filters: any) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const updateFilter = (key: string, value: number) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    onFiltersChange({ grain: 0, blur: 0, contrast: 100, brightness: 100, hue: 0 });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {/* Grain */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">
            Grain ({filters.grain}%):
          </label>
          <Slider
            value={[filters.grain]}
            onValueChange={(value) => updateFilter('grain', value[0])}
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
            onValueChange={(value) => updateFilter('blur', value[0])}
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
            onValueChange={(value) => updateFilter('contrast', value[0])}
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
            onValueChange={(value) => updateFilter('brightness', value[0])}
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
            onValueChange={(value) => updateFilter('hue', value[0])}
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
                onClick={() => updateFilter('hue', deg)}
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
          onClick={resetFilters}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh filters
        </Button>
      </div>
    </div>
  );
}