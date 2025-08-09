/**
 * Canvas Utilities for Greeting Card Rendering
 * Handles high-resolution canvas operations and print-quality rendering
 */

// Standard print dimensions (in pixels at 300 DPI)
export const PRINT_CONFIG = {
  // 9" x 11" paper at 300 DPI
  PAPER_WIDTH_PX: 2700,  // 9 inches * 300 DPI
  PAPER_HEIGHT_PX: 3300, // 11 inches * 300 DPI
  
  // Quarter-fold card dimensions (each panel)
  PANEL_WIDTH_PX: 1275,  // 4.25 inches * 300 DPI
  PANEL_HEIGHT_PX: 1650, // 5.5 inches * 300 DPI
  
  // Print settings
  DPI: 300,
  BLEED_PX: 9, // 0.03 inches * 300 DPI (3mm bleed)
  
  // Preview settings (for screen display)
  PREVIEW_SCALE: 0.3, // Scale down for screen display
} as const;

/**
 * Creates a high-resolution canvas for print-quality rendering
 */
export const createHighResCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas');
  }
  
  // Set actual canvas size for high-resolution rendering
  canvas.width = width;
  canvas.height = height;
  
  // Configure context for high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.textBaseline = 'top';
  
  return canvas;
};

/**
 * Creates a canvas scaled for preview display
 */
export const createPreviewCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = createHighResCanvas(
    Math.round(width * PRINT_CONFIG.PREVIEW_SCALE),
    Math.round(height * PRINT_CONFIG.PREVIEW_SCALE)
  );
  
  // Scale the context for preview
  const ctx = canvas.getContext('2d')!;
  ctx.scale(PRINT_CONFIG.PREVIEW_SCALE, PRINT_CONFIG.PREVIEW_SCALE);
  
  return canvas;
};

/**
 * Applies background to canvas (color or gradient)
 */
export const applyBackground = (
  ctx: CanvasRenderingContext2D,
  background: {
    type: 'color' | 'gradient';
    value: string;
    opacity: number;
  },
  width: number,
  height: number
): void => {
  ctx.save();
  
  // Set opacity
  ctx.globalAlpha = background.opacity;
  
  if (background.type === 'color') {
    ctx.fillStyle = background.value;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === 'gradient') {
    // Parse CSS gradient string (simplified)
    // For now, handle linear gradients
    const gradientMatch = background.value.match(/linear-gradient\(([^)]+)\)/);
    if (gradientMatch) {
      const params = gradientMatch[1].split(',').map(s => s.trim());
      const angle = params[0].includes('deg') ? parseFloat(params[0]) : 90;
      
      // Create gradient based on angle
      const gradient = createLinearGradient(ctx, angle, width, height);
      
      // Add color stops (simplified parsing)
      for (let i = 1; i < params.length; i++) {
        const colorStop = params[i];
        const match = colorStop.match(/(.+?)\s+(\d+)%/);
        if (match) {
          gradient.addColorStop(parseInt(match[2]) / 100, match[1].trim());
        }
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Fallback to solid color if gradient parsing fails
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
  }
  
  ctx.restore();
};

/**
 * Creates a linear gradient based on angle
 */
const createLinearGradient = (
  ctx: CanvasRenderingContext2D,
  angle: number,
  width: number,
  height: number
): CanvasGradient => {
  // Convert angle to radians
  const rad = (angle - 90) * (Math.PI / 180);
  
  // Calculate gradient endpoints
  const x1 = width / 2 + Math.cos(rad) * width / 2;
  const y1 = height / 2 + Math.sin(rad) * height / 2;
  const x2 = width / 2 - Math.cos(rad) * width / 2;
  const y2 = height / 2 - Math.sin(rad) * height / 2;
  
  return ctx.createLinearGradient(x1, y1, x2, y2);
};

/**
 * Loads an image and returns a promise
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for external images
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Converts canvas to high-quality data URL
 */
export const canvasToDataURL = (canvas: HTMLCanvasElement, quality: number = 0.95): string => {
  return canvas.toDataURL('image/png', quality);
};

/**
 * Downloads canvas as image file
 */
export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvasToDataURL(canvas);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
