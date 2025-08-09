// Application constants for the Greeting Card Creator

import type { PaperSize, Margins, FontSize, ImageFormat } from './index';

// ============================================================================
// PAPER AND PRINT SETTINGS
// ============================================================================

export const DEFAULT_PAPER_SIZE: PaperSize = {
  width: 11,
  height: 9,
  name: '11x9',
  isLandscape: true,
};

export const AVAILABLE_PAPER_SIZES: PaperSize[] = [
  {
    width: 11,
    height: 9,
    name: '11x9',
    isLandscape: true,
  },
  {
    width: 8.5,
    height: 11,
    name: 'Letter',
    isLandscape: false,
  },
  {
    width: 11,
    height: 8.5,
    name: 'Letter Landscape',
    isLandscape: true,
  },
];

export const DEFAULT_MARGINS: Margins = {
  top: 0.25,
  right: 0.25,
  bottom: 0.25,
  left: 0.25,
};

export const PRINT_RESOLUTION = 300; // DPI

export const BLEED_SIZE = 0.125; // inches

// ============================================================================
// FILE HANDLING
// ============================================================================

export const SUPPORTED_IMAGE_FORMATS: ImageFormat[] = ['jpeg', 'jpg', 'png', 'webp'];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
];

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const FONT_SIZES: Record<FontSize, number> = {
  small: 12,
  medium: 16,
  large: 24,
  'extra-large': 32,
};

export const DEFAULT_FONTS = [
  {
    name: 'Arial',
    value: 'Arial, sans-serif',
    preview: 'Arial Font Preview',
    category: 'sans-serif' as const,
  },
  {
    name: 'Georgia',
    value: 'Georgia, serif',
    preview: 'Georgia Font Preview',
    category: 'serif' as const,
  },
  {
    name: 'Times New Roman',
    value: '"Times New Roman", serif',
    preview: 'Times New Roman Font Preview',
    category: 'serif' as const,
  },
  {
    name: 'Comic Sans MS',
    value: '"Comic Sans MS", cursive',
    preview: 'Comic Sans MS Font Preview',
    category: 'decorative' as const,
  },
  {
    name: 'Helvetica',
    value: 'Helvetica, Arial, sans-serif',
    preview: 'Helvetica Font Preview',
    category: 'sans-serif' as const,
  },
];

export const DEFAULT_COLORS = [
  { name: 'Black', value: '#000000', hex: '#000000', category: 'neutral' as const },
  { name: 'White', value: '#FFFFFF', hex: '#FFFFFF', category: 'neutral' as const },
  { name: 'Dark Gray', value: '#4A4A4A', hex: '#4A4A4A', category: 'neutral' as const },
  { name: 'Light Gray', value: '#B8B8B8', hex: '#B8B8B8', category: 'neutral' as const },
  { name: 'Blue', value: '#3B82F6', hex: '#3B82F6', category: 'primary' as const },
  { name: 'Green', value: '#10B981', hex: '#10B981', category: 'primary' as const },
  { name: 'Red', value: '#EF4444', hex: '#EF4444', category: 'primary' as const },
  { name: 'Purple', value: '#8B5CF6', hex: '#8B5CF6', category: 'accent' as const },
  { name: 'Orange', value: '#F97316', hex: '#F97316', category: 'accent' as const },
  { name: 'Pink', value: '#EC4899', hex: '#EC4899', category: 'accent' as const },
  { name: 'Gold', value: '#F59E0B', hex: '#F59E0B', category: 'seasonal' as const },
  { name: 'Brown', value: '#92400E', hex: '#92400E', category: 'seasonal' as const },
];

// ============================================================================
// TEMPLATE CONFIGURATION
// ============================================================================

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'birthday', name: 'Birthday' },
  { id: 'holiday', name: 'Holiday' },
  { id: 'thank-you', name: 'Thank You' },
  { id: 'get-well', name: 'Get Well' },
  { id: 'blank', name: 'Blank' },
] as const;

export const PANEL_NAMES = {
  front: 'Front Cover',
  back: 'Back Cover',
  insideLeft: 'Inside Left',
  insideRight: 'Inside Right',
} as const;

export const PANEL_ORDER = ['front', 'insideLeft', 'insideRight', 'back'] as const;

// ============================================================================
// VALIDATION LIMITS
// ============================================================================

export const VALIDATION_LIMITS = {
  PROJECT_NAME_MAX_LENGTH: 100,
  TEMPLATE_NAME_MAX_LENGTH: 100,
  TEXT_SLOT_MAX_LENGTH: 500,
  SLOT_ID_MAX_LENGTH: 50,
  MAX_TEMPLATES_PER_USER: 50,
  MAX_PROJECTS_PER_USER: 100,
  MAX_IMAGE_DIMENSION: 4000, // pixels
  MIN_IMAGE_DIMENSION: 100, // pixels
} as const;

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  PROJECTS: 'greeting-card-projects',
  USER_PREFERENCES: 'greeting-card-preferences',
  RECENT_TEMPLATES: 'greeting-card-recent-templates',
  DRAFT_PROJECT: 'greeting-card-draft',
  APP_VERSION: 'greeting-card-version',
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'Invalid file type. Please select a JPEG, PNG, or WebP image.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 5MB.',
  UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  SAVE_FAILED: 'Failed to save project. Please try again.',
  LOAD_FAILED: 'Failed to load project. The file may be corrupted.',
  EXPORT_FAILED: 'Failed to export PDF. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TEMPLATE_LOAD_FAILED: 'Failed to load template. Please try again.',
  INVALID_PROJECT_NAME: 'Project name contains invalid characters.',
  PROJECT_NAME_REQUIRED: 'Project name is required.',
  SLOT_VALUE_TOO_LONG: 'Text exceeds maximum length for this area.',
  INVALID_COLOR: 'Invalid color format.',
  POSITION_OUT_OF_BOUNDS: 'Position is outside the allowed area.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  PROJECT_SAVED: 'Project saved successfully!',
  PROJECT_LOADED: 'Project loaded successfully!',
  PDF_EXPORTED: 'PDF exported successfully!',
  IMAGE_UPLOADED: 'Image uploaded successfully!',
  TEMPLATE_APPLIED: 'Template applied successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;

// ============================================================================
// APPLICATION METADATA
// ============================================================================

export const APP_CONFIG = {
  VERSION: '1.0.0',
  NAME: 'Greeting Card Creator',
  DESCRIPTION: 'Create beautiful printable greeting cards',
  AUTHOR: 'Your Name',
  HOMEPAGE: 'https://greeting-card-creator.app',
  SUPPORT_EMAIL: 'support@greeting-card-creator.app',
} as const;

// ============================================================================
// DEVELOPMENT CONFIGURATION
// ============================================================================

export const DEV_CONFIG = {
  LOG_LEVEL: 'info' as const,
  ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  MOCK_DATA: process.env.NODE_ENV === 'development',
  API_TIMEOUT: 10000, // milliseconds
} as const;
