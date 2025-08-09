// Core application types for the Greeting Card Creator

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface Template {
  id: string;
  name: string;
  category: 'birthday' | 'holiday' | 'thank-you' | 'get-well' | 'blank';
  thumbnail: string;
  description?: string;
  author?: string;
  createdAt?: Date;
  panels: {
    front: PanelData;
    back: PanelData;
    insideLeft: PanelData;
    insideRight: PanelData;
  };
  metadata?: TemplateMetadata;
}

export interface TemplateMetadata {
  version: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes to complete
  colorScheme: string[];
}

export interface PanelData {
  id: string;
  name: string; // 'front', 'back', etc.
  background: BackgroundData;
  textSlots: TextSlot[];
  imageSlots: ImageSlot[];
  dimensions: {
    width: number;
    height: number;
  };
}

export interface BackgroundData {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  value: string; // color hex, image URL, or gradient definition
  opacity?: number;
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  position?: string; // CSS background-position
}

export interface TextSlot {
  id: string;
  placeholder: string;
  position: Position;
  size: Size;
  maxLength: number;
  defaultFont: string;
  defaultSize: FontSize;
  defaultColor?: string;
  allowedFonts?: string[];
  textAlign: TextAlign;
  lineHeight?: number;
  letterSpacing?: number;
  bounds?: Bounds; // constrains where text can be positioned
}

export interface ImageSlot {
  id: string;
  position: Position;
  size: Size;
  shape: 'rectangle' | 'circle' | 'rounded-rectangle';
  borderRadius?: number; // for rounded-rectangle
  defaultImage?: string;
  placeholder?: string;
  aspectRatio?: 'free' | 'square' | '4:3' | '16:9' | '3:2';
  allowedFormats?: ImageFormat[];
  maxFileSize?: number; // in bytes
  bounds?: Bounds;
}

// ============================================================================
// PROJECT AND USER DATA
// ============================================================================

export interface ProjectData {
  id: string;
  name: string;
  templateId: string;
  createdAt: Date;
  lastModified: Date;
  version: string;
  slots: {
    [slotId: string]: SlotValue;
  };
  settings: ProjectSettings;
  metadata?: ProjectMetadata;
}

export interface ProjectMetadata {
  totalEditTime: number; // minutes spent editing
  exportCount: number;
  lastExportedAt?: Date;
  favorited: boolean;
}

export interface SlotValue {
  type: 'text' | 'image';
  value: string; // text content or image data URL
  font?: string;
  color?: string;
  size?: FontSize;
  originalFileName?: string; // for images
  uploadedAt?: Date;
  customProperties?: Record<string, unknown>;
}

export interface ProjectSettings {
  paperSize: PaperSize;
  foldType: FoldType;
  resolution: number;
  includeGuidelines: boolean;
  margins: Margins;
  colorSpace: 'RGB' | 'CMYK';
  bleedSize: number; // in inches
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface PaperSize {
  width: number;  // in inches
  height: number; // in inches
  name: string;   // e.g., "9x11"
  isLandscape: boolean;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

export type FoldType = 'quarter-fold' | 'bi-fold' | 'tri-fold' | 'single-panel';

export type PanelType = 'front' | 'back' | 'insideLeft' | 'insideRight';

export type AppView = 'gallery' | 'editor' | 'export' | 'projects';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type ImageFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'gif';

export type TemplateCategory = 'all' | 'birthday' | 'holiday' | 'thank-you' | 'get-well' | 'blank';

export type AppTheme = 'light' | 'dark' | 'auto';

export type ExportFormat = 'pdf' | 'png' | 'jpeg';

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

// Font configuration
export interface FontOption {
  name: string;
  value: string;
  preview: string;
  category: 'serif' | 'sans-serif' | 'monospace' | 'decorative';
  weight?: 'normal' | 'bold' | '300' | '400' | '500' | '600' | '700';
}

// Color configuration
export interface ColorOption {
  name: string;
  value: string;
  hex: string;
  category: 'primary' | 'neutral' | 'accent' | 'seasonal';
}

// PDF export options
export interface PDFExportOptions {
  includeGuidelines: boolean;
  includeFoldLines: boolean;
  fileName: string;
  quality: 'standard' | 'high' | 'print-ready';
  margins: Margins;
  format: ExportFormat;
  compression: boolean;
}

// Error types
export interface AppError {
  type: 'validation' | 'upload' | 'export' | 'storage' | 'network' | 'permission';
  message: string;
  details?: string;
  code?: string;
  timestamp: Date;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number; // 0-100
}

// User preferences
export interface UserPreferences {
  theme: AppTheme;
  defaultPaperSize: string;
  autoSave: boolean;
  showTooltips: boolean;
  recentTemplates: string[];
  favoriteColors: string[];
  defaultFont: string;
}

// ============================================================================
// EVENT HANDLERS AND CALLBACKS
// ============================================================================

export type SlotUpdateHandler = (slotId: string, value: string | File) => void;
export type TemplateSelectHandler = (template: Template) => void;
export type ProjectSaveHandler = (project: ProjectData) => void;
export type PanelChangeHandler = (panelType: PanelType) => void;
export type ErrorHandler = (error: AppError) => void;
export type LoadingHandler = (loading: LoadingState) => void;

// ============================================================================
// VALIDATION AND UTILITY TYPES
// ============================================================================

// Type guards
export type Validator<T> = (value: unknown) => value is T;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
  timestamp: Date;
}

// File upload types
export interface FileUploadResult {
  success: boolean;
  dataUrl?: string;
  originalName: string;
  size: number;
  format: ImageFormat;
  dimensions?: Size;
  error?: string;
}

// Search and filtering
export interface SearchFilters {
  category: TemplateCategory;
  searchTerm: string;
  sortBy: 'name' | 'date' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

// ============================================================================
// CONSTANTS AND DEFAULTS (Re-exported from constants.ts)
// ============================================================================

export {
  DEFAULT_PAPER_SIZE,
  DEFAULT_MARGINS,
  SUPPORTED_IMAGE_FORMATS,
  MAX_FILE_SIZE,
  FONT_SIZES,
  PANEL_ORDER,
  DEFAULT_FONTS,
  DEFAULT_COLORS,
  TEMPLATE_CATEGORIES,
  VALIDATION_LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './constants';

// ============================================================================
// LEGACY CONSTANTS (for backward compatibility)
// ============================================================================

export const PANEL_ORDER_LEGACY: PanelType[] = ['front', 'back', 'insideLeft', 'insideRight'];

// ============================================================================
// TYPE UTILITIES
// ============================================================================

// Helper type for making all properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Helper type for making specific properties required
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Extract slot types
export type SlotType = SlotValue['type'];

// Template without panels (for lists)
export type TemplateInfo = Omit<Template, 'panels'>;

// Project without slot data (for lists)
export type ProjectInfo = Omit<ProjectData, 'slots'>;

// Panel identifiers
export type PanelId = keyof Template['panels'];
