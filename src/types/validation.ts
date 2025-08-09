// Validation utilities for the Greeting Card Creator

import type {
  Template,
  ProjectData,
  SlotValue,
  TextSlot,
  ImageSlot,
  AppError,
  ImageFormat,
} from './index';

import {
  SUPPORTED_IMAGE_FORMATS,
  MAX_FILE_SIZE,
} from './index';

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isTemplate = (value: unknown): value is Template => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  
  return Boolean(
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.thumbnail === 'string' &&
    obj.panels &&
    typeof obj.panels === 'object'
  );
};

export const isProjectData = (value: unknown): value is ProjectData => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  
  return Boolean(
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.templateId === 'string' &&
    obj.createdAt instanceof Date &&
    obj.lastModified instanceof Date &&
    obj.slots &&
    typeof obj.slots === 'object' &&
    obj.settings &&
    typeof obj.settings === 'object'
  );
};

export const isSlotValue = (value: unknown): value is SlotValue => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  
  return Boolean(
    (obj.type === 'text' || obj.type === 'image') &&
    typeof obj.value === 'string'
  );
};

export const isTextSlot = (value: unknown): value is TextSlot => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  
  return Boolean(
    typeof obj.id === 'string' &&
    typeof obj.placeholder === 'string' &&
    obj.position &&
    typeof obj.position === 'object' &&
    typeof obj.maxLength === 'number'
  );
};

export const isImageSlot = (value: unknown): value is ImageSlot => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  
  return Boolean(
    typeof obj.id === 'string' &&
    obj.position &&
    typeof obj.position === 'object' &&
    obj.size &&
    typeof obj.size === 'object' &&
    typeof obj.shape === 'string'
  );
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export const validateTemplateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Template name is required';
  }
  if (name.length > 100) {
    return 'Template name must be less than 100 characters';
  }
  return null;
};

export const validateProjectName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Project name is required';
  }
  if (name.length > 100) {
    return 'Project name must be less than 100 characters';
  }
  if (!/^[a-zA-Z0-9\s\-_\.]+$/.test(name)) {
    return 'Project name contains invalid characters';
  }
  return null;
};

export const validateTextSlotValue = (value: string, slot: TextSlot): string | null => {
  if (value.length > slot.maxLength) {
    return `Text exceeds maximum length of ${slot.maxLength} characters`;
  }
  return null;
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum of ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
    };
  }

  // Check file type
  const extension = file.name.split('.').pop()?.toLowerCase() as ImageFormat;
  if (!SUPPORTED_IMAGE_FORMATS.includes(extension)) {
    return {
      isValid: false,
      error: `File type not supported. Please use: ${SUPPORTED_IMAGE_FORMATS.join(', ')}`,
    };
  }

  // Check MIME type
  const validMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  
  if (!validMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type detected',
    };
  }

  return { isValid: true };
};

export const validateSlotId = (slotId: string): boolean => {
  return /^[a-zA-Z0-9\-_]+$/.test(slotId) && slotId.length > 0 && slotId.length <= 50;
};

export const validatePosition = (x: number, y: number, bounds?: { width: number; height: number }): string | null => {
  if (x < 0 || y < 0) {
    return 'Position coordinates must be positive';
  }
  
  if (bounds && (x > bounds.width || y > bounds.height)) {
    return 'Position is outside panel bounds';
  }
  
  return null;
};

export const validateHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// ============================================================================
// ERROR CREATION UTILITIES
// ============================================================================

export const createValidationError = (message: string, details?: string): AppError => ({
  type: 'validation',
  message,
  details,
  timestamp: new Date(),
});

export const createUploadError = (message: string, details?: string): AppError => ({
  type: 'upload',
  message,
  details,
  timestamp: new Date(),
});

export const createStorageError = (message: string, details?: string): AppError => ({
  type: 'storage',
  message,
  details,
  timestamp: new Date(),
});

export const createExportError = (message: string, details?: string): AppError => ({
  type: 'export',
  message,
  details,
  timestamp: new Date(),
});

// ============================================================================
// DATA SANITIZATION
// ============================================================================

export const sanitizeProjectName = (name: string): string => {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s\-_\.]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100); // Limit length
};

export const sanitizeFileName = (name: string): string => {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\-_\.]/g, '_') // Replace invalid chars with underscore
    .replace(/_{2,}/g, '_') // Collapse multiple underscores
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .substring(0, 50); // Limit length
};

export const sanitizeTextContent = (text: string): string => {
  return text
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export const validateTemplate = (template: unknown): ValidationResult => {
  const errors: string[] = [];
  
  if (!isTemplate(template)) {
    errors.push('Invalid template structure');
    return { isValid: false, errors };
  }
  
  const nameError = validateTemplateName(template.name);
  if (nameError) errors.push(nameError);
  
  if (!template.thumbnail) {
    errors.push('Template thumbnail is required');
  }
  
  if (!template.panels || Object.keys(template.panels).length === 0) {
    errors.push('Template must have at least one panel');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProject = (project: unknown): ValidationResult => {
  const errors: string[] = [];
  
  if (!isProjectData(project)) {
    errors.push('Invalid project structure');
    return { isValid: false, errors };
  }
  
  const nameError = validateProjectName(project.name);
  if (nameError) errors.push(nameError);
  
  if (!project.templateId) {
    errors.push('Project must reference a template');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
