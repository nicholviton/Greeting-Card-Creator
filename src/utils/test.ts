/**
 * Test utilities for canvas rendering
 */

import { PanelData } from '../types';
import { PRINT_CONFIG } from '../utils/canvas';

/**
 * Creates a simple test panel for development
 */
export const createTestPanel = (): PanelData => ({
  id: 'test-panel',
  name: 'Test Panel',
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 1
  },
  dimensions: {
    width: PRINT_CONFIG.PANEL_WIDTH_PX,
    height: PRINT_CONFIG.PANEL_HEIGHT_PX
  },
  textSlots: [
    {
      id: 'test-text-1',
      placeholder: 'Hello World!',
      position: { x: 100, y: 200 },
      size: { width: 1075, height: 100 },
      maxLength: 50,
      defaultFont: 'Arial',
      defaultSize: 'large',
      defaultColor: '#FFFFFF',
      textAlign: 'center',
      lineHeight: 1.2
    },
    {
      id: 'test-text-2',
      placeholder: 'This is a test of text wrapping and positioning on the canvas.',
      position: { x: 100, y: 800 },
      size: { width: 500, height: 200 },
      maxLength: 150,
      defaultFont: 'Georgia',
      defaultSize: 'medium',
      defaultColor: '#333333',
      textAlign: 'left',
      lineHeight: 1.6
    }
  ],
  imageSlots: [
    {
      id: 'test-image-1',
      position: { x: 400, y: 400 },
      size: { width: 475, height: 300 },
      shape: 'rectangle',
      placeholder: 'Test Image Slot',
      aspectRatio: 'free'
    },
    {
      id: 'test-image-2',
      position: { x: 700, y: 800 },
      size: { width: 200, height: 200 },
      shape: 'circle',
      placeholder: 'Circle Slot',
      aspectRatio: 'square'
    },
    {
      id: 'test-image-3',
      position: { x: 950, y: 800 },
      size: { width: 250, height: 150 },
      shape: 'rounded-rectangle',
      borderRadius: 20,
      placeholder: 'Rounded Slot',
      aspectRatio: 'free'
    }
  ]
});

/**
 * Validates that a canvas has been properly rendered
 */
export const validateCanvasRendering = (canvas: HTMLCanvasElement): boolean => {
  if (!canvas) return false;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  
  // Check if canvas has content (not just blank)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Check if any pixels are not transparent
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] !== 0) return true; // Found non-transparent pixel
  }
  
  return false;
};

/**
 * Gets canvas performance metrics
 */
export const getCanvasMetrics = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  return {
    width: canvas.width,
    height: canvas.height,
    aspectRatio: canvas.width / canvas.height,
    totalPixels: canvas.width * canvas.height,
    memoryUsage: canvas.width * canvas.height * 4, // 4 bytes per pixel (RGBA)
    contextType: '2d',
    imageSmoothingEnabled: ctx.imageSmoothingEnabled,
    imageSmoothingQuality: ctx.imageSmoothingQuality
  };
};
