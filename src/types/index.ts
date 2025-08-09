// Core application types for the Greeting Card Creator

export interface Template {
  id: string;
  name: string;
  category: 'birthday' | 'holiday' | 'thank-you' | 'get-well' | 'blank';
  thumbnail: string;
  description?: string;
  panels: {
    front: PanelData;
    back: PanelData;
    insideLeft: PanelData;
    insideRight: PanelData;
  };
}

export interface PanelData {
  background: string; // URL to background image
  textSlots: TextSlot[];
  imageSlots: ImageSlot[];
}

export interface TextSlot {
  id: string;
  placeholder: string;
  position: { x: number; y: number };
  maxLength: number;
  defaultFont: string;
  defaultSize: 'small' | 'medium' | 'large';
  defaultColor?: string;
  allowedFonts?: string[];
  textAlign?: 'left' | 'center' | 'right';
}

export interface ImageSlot {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  shape: 'rectangle' | 'circle';
  defaultImage?: string;
  placeholder?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  templateId: string;
  createdAt: Date;
  lastModified: Date;
  slots: {
    [slotId: string]: SlotValue;
  };
  settings: ProjectSettings;
}

export interface SlotValue {
  type: 'text' | 'image';
  value: string; // text content or image data URL
  font?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface ProjectSettings {
  paperSize: PaperSize;
  foldType: FoldType;
  resolution: number;
  includeGuidelines: boolean;
  margins: Margins;
}

export interface PaperSize {
  width: number;  // in inches
  height: number; // in inches
  name: string;   // e.g., "9x11"
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type FoldType = 'quarter-fold' | 'bi-fold' | 'tri-fold' | 'single-panel';

export type PanelType = 'front' | 'back' | 'insideLeft' | 'insideRight';

export type AppView = 'gallery' | 'editor' | 'export';

// Font configuration
export interface FontOption {
  name: string;
  value: string;
  preview: string;
}

// Color configuration
export interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

// PDF export options
export interface PDFExportOptions {
  includeGuidelines: boolean;
  fileName: string;
  quality: 'standard' | 'high';
  margins: Margins;
}

// Template category for filtering
export type TemplateCategory = 'all' | 'birthday' | 'holiday' | 'thank-you' | 'get-well' | 'blank';

// Error types
export interface AppError {
  type: 'validation' | 'upload' | 'export' | 'storage' | 'network';
  message: string;
  details?: string;
}

// Event handlers
export type SlotUpdateHandler = (slotId: string, value: string | File) => void;
export type TemplateSelectHandler = (template: Template) => void;
export type ProjectSaveHandler = (project: ProjectData) => void;
