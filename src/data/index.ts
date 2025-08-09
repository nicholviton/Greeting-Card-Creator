import { Template, TemplateCategory } from '../types';

// Re-export types for convenience
export type { Template, TemplateCategory };

// Template interface for JSON data (with string dates)
interface TemplateData {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  author: string;
  createdAt: string;
  panels: Template['panels'];
  metadata: Template['metadata'];
}

// Template file names
const templateFiles = [
  'birthday-balloons-01.json',
  'holiday-winter-01.json',
  'thank-you-floral-01.json',
  'get-well-sunshine-01.json',
  'blank-canvas-01.json',
] as const;

// Convert JSON template data to Template objects
const convertToTemplate = (data: TemplateData): Template => ({
  ...data,
  category: data.category as Exclude<TemplateCategory, 'all'>,
  createdAt: new Date(data.createdAt),
});

// Load templates dynamically
const loadTemplate = async (filename: string): Promise<Template> => {
  try {
    const response = await fetch(`/data/templates/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${filename}`);
    }
    const data: TemplateData = await response.json();
    return convertToTemplate(data);
  } catch (error) {
    console.error(`Error loading template ${filename}:`, error);
    throw error;
  }
};

// Load all templates
export const loadAllTemplates = async (): Promise<Template[]> => {
  try {
    const templatePromises = templateFiles.map(loadTemplate);
    return await Promise.all(templatePromises);
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
};

// Cache for loaded templates
let templatesCache: Template[] | null = null;

// Export all templates as typed Template objects
export const getAllTemplates = async (): Promise<Template[]> => {
  if (templatesCache === null) {
    templatesCache = await loadAllTemplates();
  }
  return templatesCache;
};

// Export templates grouped by category
export const getTemplatesByCategory = async (category: TemplateCategory): Promise<Template[]> => {
  const templates = await getAllTemplates();
  if (category === 'all') {
    return templates;
  }
  return templates.filter(template => template.category === category);
};

// Utility functions for template management
export const getTemplateById = async (id: string): Promise<Template | undefined> => {
  const templates = await getAllTemplates();
  return templates.find(template => template.id === id);
};

export const getAllCategories = (): TemplateCategory[] => {
  return ['all', 'birthday', 'holiday', 'thank-you', 'get-well', 'blank'];
};

export const searchTemplates = async (query: string): Promise<Template[]> => {
  const templates = await getAllTemplates();
  const lowercaseQuery = query.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    (template.description && template.description.toLowerCase().includes(lowercaseQuery)) ||
    (template.metadata && template.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  );
};

// For backward compatibility, export synchronous versions that return empty arrays initially
export const allTemplates: Template[] = [];
export const templatesByCategory: Partial<Record<TemplateCategory, Template[]>> = {};

// Initialize templates on module load
getAllTemplates().then(templates => {
  allTemplates.splice(0, allTemplates.length, ...templates);
  templatesByCategory.birthday = templates.filter(t => t.category === 'birthday');
  templatesByCategory.holiday = templates.filter(t => t.category === 'holiday');
  templatesByCategory['thank-you'] = templates.filter(t => t.category === 'thank-you');
  templatesByCategory['get-well'] = templates.filter(t => t.category === 'get-well');
  templatesByCategory.blank = templates.filter(t => t.category === 'blank');
}).catch(console.error);
