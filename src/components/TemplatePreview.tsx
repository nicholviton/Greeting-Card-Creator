import React, { useState, useEffect } from 'react';
import PanelRenderer from './PanelRenderer';
import { getTemplateById } from '../data';
import { Template } from '../types';

interface TemplatePreviewProps {
  templateId: string;
  className?: string;
}

/**
 * TemplatePreview component - Shows all 4 panels of a template
 */
export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateId,
  className = ''
}) => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'front' | 'back' | 'insideLeft' | 'insideRight'>('front');

  useEffect(() => {
    const loadTemplate = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const templateData = await getTemplateById(templateId);
        if (!templateData) {
          throw new Error(`Template with ID ${templateId} not found`);
        }
        setTemplate(templateData);
      } catch (err) {
        console.error('Error loading template:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className={`template-preview loading ${className}`}>
        <div className="loading-spinner">Loading template...</div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className={`template-preview error ${className}`}>
        <div className="error-message">
          {error || 'Template not found'}
        </div>
      </div>
    );
  }

  const panels = [
    { key: 'front', label: 'Front', data: template.panels.front },
    { key: 'back', label: 'Back', data: template.panels.back },
    { key: 'insideLeft', label: 'Inside Left', data: template.panels.insideLeft },
    { key: 'insideRight', label: 'Inside Right', data: template.panels.insideRight },
  ] as const;

  return (
    <div className={`template-preview ${className}`}>
      <div className="template-header">
        <h2>{template.name}</h2>
        <p>{template.description}</p>
      </div>

      <div className="panel-navigation">
        {panels.map(({ key, label }) => (
          <button
            key={key}
            className={`panel-tab ${activePanel === key ? 'active' : ''}`}
            onClick={() => setActivePanel(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="panel-preview">
        <PanelRenderer
          panel={template.panels[activePanel]}
          className="active-panel"
          onCanvasReady={(canvas) => {
            console.log(`Panel ${activePanel} rendered:`, canvas);
          }}
        />
      </div>

      <div className="template-info">
        <div className="template-stats">
          <div className="stat">
            <label>Category:</label>
            <span>{template.category}</span>
          </div>
          <div className="stat">
            <label>Estimated Time:</label>
            <span>{template.metadata?.estimatedTime || 'Unknown'} minutes</span>
          </div>
          <div className="stat">
            <label>Difficulty:</label>
            <span>{template.metadata?.difficulty || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
