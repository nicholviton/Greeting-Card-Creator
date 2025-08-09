/**
 * PDF Generation Utilities
 * Handles export of canvas panels to print-ready PDF
 */

import jsPDF from 'jspdf';
import { PRINT_CONFIG } from './canvas';

/**
 * PDF configuration for 9" x 11" landscape cards
 */
export const PDF_CONFIG = {
  // Page setup (landscape orientation)
  FORMAT: [PRINT_CONFIG.PAPER_WIDTH_PX / PRINT_CONFIG.DPI * 25.4, 
           PRINT_CONFIG.PAPER_HEIGHT_PX / PRINT_CONFIG.DPI * 25.4] as [number, number], // in mm
  ORIENTATION: 'landscape' as const,
  UNIT: 'mm' as const,
  
  // Margins and positioning (in mm)
  MARGIN: 5,
  FOLD_LINE_WIDTH: 0.2,
  FOLD_LINE_COLOR: '#CCCCCC',
} as const;

/**
 * Creates a new PDF document configured for greeting cards
 */
export const createPDF = (): jsPDF => {
  return new jsPDF({
    orientation: PDF_CONFIG.ORIENTATION,
    unit: PDF_CONFIG.UNIT,
    format: PDF_CONFIG.FORMAT,
    compress: true,
  });
};

/**
 * Adds a canvas panel to the PDF at the specified position
 */
export const addCanvasToPanel = (
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  panelPosition: 'front' | 'back' | 'insideLeft' | 'insideRight'
): void => {
  const imageData = canvas.toDataURL('image/png', 0.95);
  
  // Calculate panel dimensions in mm
  const panelWidthMM = PRINT_CONFIG.PANEL_WIDTH_PX / PRINT_CONFIG.DPI * 25.4;
  const panelHeightMM = PRINT_CONFIG.PANEL_HEIGHT_PX / PRINT_CONFIG.DPI * 25.4;
  
  // Calculate positions for quarter-fold layout
  const positions = getQuarterFoldPositions(panelWidthMM, panelHeightMM);
  const position = positions[panelPosition];
  
  // Add image to PDF
  pdf.addImage(
    imageData,
    'PNG',
    position.x,
    position.y,
    panelWidthMM,
    panelHeightMM,
    undefined,
    'FAST'
  );
};

/**
 * Calculates positions for quarter-fold layout
 */
const getQuarterFoldPositions = (panelWidth: number, panelHeight: number) => {
  const pageWidth = PDF_CONFIG.FORMAT[0];
  const pageHeight = PDF_CONFIG.FORMAT[1];
  const margin = PDF_CONFIG.MARGIN;
  
  // Center the card layout on the page
  const totalWidth = panelWidth * 2;
  const totalHeight = panelHeight * 2;
  const startX = (pageWidth - totalWidth) / 2;
  const startY = (pageHeight - totalHeight) / 2;
  
  return {
    // Quarter-fold layout:
    // [insideLeft] [insideRight]
    // [front]      [back]
    insideLeft: { x: startX, y: startY },
    insideRight: { x: startX + panelWidth, y: startY },
    front: { x: startX, y: startY + panelHeight },
    back: { x: startX + panelWidth, y: startY + panelHeight },
  };
};

/**
 * Adds fold lines to the PDF
 */
export const addFoldLines = (pdf: jsPDF): void => {
  const panelWidthMM = PRINT_CONFIG.PANEL_WIDTH_PX / PRINT_CONFIG.DPI * 25.4;
  const panelHeightMM = PRINT_CONFIG.PANEL_HEIGHT_PX / PRINT_CONFIG.DPI * 25.4;
  const positions = getQuarterFoldPositions(panelWidthMM, panelHeightMM);
  
  pdf.setDrawColor(PDF_CONFIG.FOLD_LINE_COLOR);
  pdf.setLineWidth(PDF_CONFIG.FOLD_LINE_WIDTH);
  pdf.setLineDashPattern([2, 2], 0);
  
  // Vertical fold line
  const verticalX = positions.insideLeft.x + panelWidthMM;
  pdf.line(
    verticalX,
    positions.insideLeft.y,
    verticalX,
    positions.front.y + panelHeightMM
  );
  
  // Horizontal fold line
  const horizontalY = positions.insideLeft.y + panelHeightMM;
  pdf.line(
    positions.insideLeft.x,
    horizontalY,
    positions.insideRight.x + panelWidthMM,
    horizontalY
  );
  
  // Reset line style
  pdf.setLineDashPattern([], 0);
};

/**
 * Creates a complete PDF from four canvas panels
 */
export const createCardPDF = (panels: {
  front: HTMLCanvasElement;
  back: HTMLCanvasElement;
  insideLeft: HTMLCanvasElement;
  insideRight: HTMLCanvasElement;
}, options: {
  includeFoldLines?: boolean;
  filename?: string;
} = {}): jsPDF => {
  const { includeFoldLines = true, filename = 'greeting-card.pdf' } = options;
  
  const pdf = createPDF();
  
  // Add all panels
  addCanvasToPanel(pdf, panels.front, 'front');
  addCanvasToPanel(pdf, panels.back, 'back');
  addCanvasToPanel(pdf, panels.insideLeft, 'insideLeft');
  addCanvasToPanel(pdf, panels.insideRight, 'insideRight');
  
  // Add fold lines if requested
  if (includeFoldLines) {
    addFoldLines(pdf);
  }
  
  // Add metadata
  pdf.setProperties({
    title: 'Greeting Card',
    subject: 'Printable Greeting Card',
    author: 'Greeting Card Creator',
    creator: 'Greeting Card Creator App',
  });
  
  return pdf;
};

/**
 * Downloads the PDF file
 */
export const downloadPDF = (pdf: jsPDF, filename: string = 'greeting-card.pdf'): void => {
  pdf.save(filename);
};

/**
 * Gets PDF as blob for further processing
 */
export const getPDFBlob = (pdf: jsPDF): Blob => {
  return pdf.output('blob');
};
