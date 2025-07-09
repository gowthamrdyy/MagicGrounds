import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CanvasPanelProps {
  canvasSize: {
    width: number;
    height: number;
    scale: number;
  };
  onCanvasSizeChange: (size: any) => void;
}

const aspectRatios = [
  { width: 1, height: 1 },
  { width: 2, height: 1 },
  { width: 16, height: 9 },
  { width: 4, height: 3 },
  { width: 3, height: 2 },
  { width: 7, height: 4 }
];

export function CanvasPanel({ canvasSize, onCanvasSizeChange }: CanvasPanelProps) {
  return (
    <div className="p-6 space-y-6">
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
            onChange={(e) => onCanvasSizeChange(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Height:</label>
          <Input
            type="number"
            value={canvasSize.height}
            onChange={(e) => onCanvasSizeChange(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
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
              onClick={() => onCanvasSizeChange(prev => ({ ...prev, scale }))}
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
              onClick={() => onCanvasSizeChange(prev => ({ 
                ...prev, 
                width: ratio.width * 200, 
                height: ratio.height * 200 
              }))}
              className="text-xs"
            >
              {ratio.width}:{ratio.height}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}