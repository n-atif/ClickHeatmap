export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

export class SimpleHeatmap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private points: HeatmapPoint[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    this.ctx = ctx;
  }

  setData(points: HeatmapPoint[]) {
    this.points = points;
    this.render();
  }

  private render() {
    const { canvas, ctx } = this;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Find max value for normalization
    const maxValue = Math.max(...this.points.map(p => p.value));
    
    this.points.forEach(point => {
      const intensity = point.value / maxValue;
      const radius = 20 + (intensity * 20); // Dynamic radius based on intensity
      
      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );
      
      // Color based on intensity
      const alpha = intensity * 0.7;
      if (intensity > 0.7) {
        gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 100, 0, ${alpha * 0.5})`);
      } else if (intensity > 0.4) {
        gradient.addColorStop(0, `rgba(255, 255, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 150, 0, ${alpha * 0.5})`);
      } else {
        gradient.addColorStop(0, `rgba(0, 150, 255, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(0, 200, 255, ${alpha * 0.5})`);
      }
      
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }
}
