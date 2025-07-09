import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportPanelProps {
  generateGradient: () => string;
  colors: string[];
  canvasSize: {
    width: number;
    height: number;
    scale: number;
  };
  filters: {
    grain: number;
    blur: number;
    contrast: number;
    brightness: number;
    hue: number;
  };
}

export function ExportPanel({ generateGradient, colors, canvasSize, filters }: ExportPanelProps) {
  const { toast } = useToast();

  const copyCSS = async () => {
    const cssCode = `background: ${generateGradient()};`;
    await navigator.clipboard.writeText(cssCode);
    toast({
      title: "CSS Copied!",
      description: "Gradient CSS code copied to clipboard",
    });
  };

  const downloadImage = async (format: 'png' | 'jpg' | 'svg') => {
    try {
      if (format === 'svg') {
        const svgContent = `
          <svg width="${canvasSize.width}" height="${canvasSize.height}" xmlns="http://www.w3.org/2000/svg">
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
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
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
        title: "Export Successful!",
        description: `Gradient exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-sm font-medium text-foreground mb-4">Export</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyCSS}
          className="w-full justify-start"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy CSS
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadImage('png')}
          className="w-full justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadImage('jpg')}
          className="w-full justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Download JPG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadImage('svg')}
          className="w-full justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Download SVG
        </Button>
      </div>
    </div>
  );
}