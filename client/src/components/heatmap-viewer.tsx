import { useEffect, useRef } from "react";
import type { Task, Click } from "@shared/schema";

interface HeatmapViewerProps {
  task: Task;
  clicks: Click[];
}

export function HeatmapViewer({ task, clicks }: HeatmapViewerProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current || clicks.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    const updateCanvas = () => {
      // Set canvas size to match image
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw heatmap points
      clicks.forEach(click => {
        const x = (click.x / 100) * canvas.width;
        const y = (click.y / 100) * canvas.height;
        
        // Create radial gradient for heatmap effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.6)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Update canvas when image loads
    if (img.complete) {
      updateCanvas();
    } else {
      img.onload = updateCanvas;
    }

    // Update canvas on resize
    window.addEventListener('resize', updateCanvas);
    
    return () => {
      window.removeEventListener('resize', updateCanvas);
    };
  }, [clicks]);

  const clicksByIntensity = clicks.reduce((acc, click) => {
    const key = `${Math.round(click.x)}-${Math.round(click.y)}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxIntensity = Math.max(...Object.values(clicksByIntensity));

  return (
    <div>
      <div className="relative">
        <img 
          ref={imageRef}
          src={task.imageUrl}
          alt="Task interface with heatmap overlay"
          className="w-full h-auto rounded-lg"
          data-testid="img-heatmap-base"
        />
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
          data-testid="canvas-heatmap-overlay"
        />
      </div>
      
      {/* Heatmap Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">High activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Medium activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Low activity</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground" data-testid="text-heatmap-stats">
          <span>{clicks.length} total clicks</span> • <span>{Object.keys(clicksByIntensity).length} unique areas</span>
        </div>
      </div>
    </div>
  );
}
