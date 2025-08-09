import React, { useRef, useEffect, useState } from 'react';
import { PanelData, TextSlot, ImageSlot } from '../types';
import { createPreviewCanvas, applyBackground, PRINT_CONFIG } from '../utils/canvas';

interface PanelRendererProps {
  panel: PanelData;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

/**
 * PanelRenderer component - Renders a template panel to canvas
 * Handles background rendering and basic panel structure
 */
export const PanelRenderer: React.FC<PanelRendererProps> = ({
  panel,
  className = '',
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Render panel to canvas
  const renderPanel = async () => {
    if (!canvasRef.current) return;

    setIsRendering(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas 2D context');
      }

      // Set canvas dimensions for preview
      const displayWidth = Math.round(panel.dimensions.width * PRINT_CONFIG.PREVIEW_SCALE);
      const displayHeight = Math.round(panel.dimensions.height * PRINT_CONFIG.PREVIEW_SCALE);
      
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      
      // Scale context for preview rendering
      ctx.scale(PRINT_CONFIG.PREVIEW_SCALE, PRINT_CONFIG.PREVIEW_SCALE);
      
      // Configure high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.textBaseline = 'top';

      // Clear canvas
      ctx.clearRect(0, 0, panel.dimensions.width, panel.dimensions.height);

      // Render background (only handle color and gradient for now)
      if (panel.background.type === 'color' || panel.background.type === 'gradient') {
        applyBackground(
          ctx,
          {
            type: panel.background.type,
            value: panel.background.value,
            opacity: panel.background.opacity || 1
          },
          panel.dimensions.width,
          panel.dimensions.height
        );
      } else {
        // Fallback for image/pattern backgrounds - use white for now
        applyBackground(
          ctx,
          { type: 'color', value: '#ffffff', opacity: 1 },
          panel.dimensions.width,
          panel.dimensions.height
        );
      }

      // Render text slot placeholders
      renderTextSlotPlaceholders(ctx, panel);

      // Render image slot placeholders
      renderImageSlotPlaceholders(ctx, panel);

      // Call callback if provided
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }

    } catch (err) {
      console.error('Error rendering panel:', err);
      setError(err instanceof Error ? err.message : 'Unknown rendering error');
    } finally {
      setIsRendering(false);
    }
  };

  // Render text slot placeholders
  const renderTextSlotPlaceholders = (ctx: CanvasRenderingContext2D, panel: PanelData) => {
    panel.textSlots.forEach((slot: TextSlot) => {
      ctx.save();
      
      // Set font style
      const fontSize = getFontSize(slot.defaultSize || 'medium');
      ctx.font = `${fontSize}px ${slot.defaultFont || 'Arial'}`;
      ctx.fillStyle = slot.defaultColor || '#000000';
      ctx.textAlign = getCanvasTextAlign(slot.textAlign || 'left');
      
      // Calculate text position
      let textX = slot.position.x;
      if (slot.textAlign === 'center') {
        textX += slot.size.width / 2;
      } else if (slot.textAlign === 'right') {
        textX += slot.size.width;
      }
      
      // Render placeholder text
      const text = slot.placeholder || 'Text Slot';
      const lines = wrapText(ctx, text, slot.size.width);
      const lineHeight = fontSize * (slot.lineHeight || 1.4);
      
      lines.forEach((line, index) => {
        const y = slot.position.y + (index * lineHeight);
        if (y + lineHeight <= slot.position.y + slot.size.height) {
          ctx.fillText(line, textX, y);
        }
      });
      
      // Draw slot outline for debugging
      if (process.env.NODE_ENV === 'development') {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(slot.position.x, slot.position.y, slot.size.width, slot.size.height);
      }
      
      ctx.restore();
    });
  };

  // Render image slot placeholders
  const renderImageSlotPlaceholders = (ctx: CanvasRenderingContext2D, panel: PanelData) => {
    panel.imageSlots.forEach((slot: ImageSlot) => {
      ctx.save();
      
      // Set placeholder style
      ctx.fillStyle = '#f3f4f6';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      
      // Draw placeholder shape
      if (slot.shape === 'circle') {
        const centerX = slot.position.x + slot.size.width / 2;
        const centerY = slot.position.y + slot.size.height / 2;
        const radius = Math.min(slot.size.width, slot.size.height) / 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (slot.shape === 'rounded-rectangle') {
        const radius = slot.borderRadius || 10;
        drawRoundedRect(
          ctx,
          slot.position.x,
          slot.position.y,
          slot.size.width,
          slot.size.height,
          radius
        );
        ctx.fill();
        ctx.stroke();
      } else {
        // Rectangle
        ctx.fillRect(slot.position.x, slot.position.y, slot.size.width, slot.size.height);
        ctx.strokeRect(slot.position.x, slot.position.y, slot.size.width, slot.size.height);
      }
      
      // Add placeholder text
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      const placeholderText = slot.placeholder || 'Image';
      const textX = slot.position.x + slot.size.width / 2;
      const textY = slot.position.y + slot.size.height / 2;
      ctx.fillText(placeholderText, textX, textY);
      
      ctx.restore();
    });
  };

  // Helper function to get font size from string
  const getFontSize = (size: string): number => {
    switch (size) {
      case 'small': return 14;
      case 'medium': return 18;
      case 'large': return 24;
      case 'extra-large': return 32;
      default: return 18;
    }
  };

  // Helper function to convert text align
  const getCanvasTextAlign = (align: string): CanvasTextAlign => {
    switch (align) {
      case 'center': return 'center';
      case 'right': return 'right';
      default: return 'left';
    }
  };

  // Helper function to wrap text
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Helper function to draw rounded rectangle
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Re-render when panel changes
  useEffect(() => {
    renderPanel();
  }, [panel]);

  return (
    <div className={`panel-renderer ${className}`}>
      {isRendering && (
        <div className="rendering-overlay">
          <div>Rendering panel...</div>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <div>Error: {error}</div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="panel-canvas"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          display: 'block',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
      
      <div className="panel-info">
        <h4>{panel.name}</h4>
        <small>{panel.dimensions.width} × {panel.dimensions.height}px</small>
      </div>
    </div>
  );
};

export default PanelRenderer;
