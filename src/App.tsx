import { useState, useEffect } from 'react'
import './App.css'
import { getAllTemplates, getAllCategories, getTemplatesByCategory, Template } from './data'
import { TemplatePreview, PanelRenderer } from './components'

// Enhanced TemplateGallery with visual preview
const TemplateGallery = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const categories = getAllCategories();
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const loadedTemplates = await getAllTemplates();
        setTemplates(loadedTemplates);
        // Auto-select first template for preview
        if (loadedTemplates.length > 0) {
          setSelectedTemplate(loadedTemplates[0].id);
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  if (loading) {
    return (
      <div className="template-gallery">
        <h2>Template Gallery</h2>
        <p>Loading templates...</p>
      </div>
    );
  }
  
  return (
    <div className="template-gallery">
      <div className="gallery-sidebar">
        <h2>Template Gallery</h2>
        <p>Total templates: {templates.length}</p>
        
        <h3>Categories:</h3>
        <ul className="category-list">
          {categories.map(category => {
            const count = category === 'all' ? templates.length : 
                         templates.filter(t => t.category === category).length;
            return (
              <li key={category}>
                {category}: {count} template{count !== 1 ? 's' : ''}
              </li>
            )
          })}
        </ul>
        
        <h3>Available Templates:</h3>
        <div className="template-list">
          {templates.map(template => (
            <div 
              key={template.id} 
              className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <h4>{template.name}</h4>
              <p>Category: {template.category}</p>
              <p>{template.description}</p>
              <small>Created: {template.createdAt?.toLocaleDateString() || 'Unknown'}</small>
            </div>
          ))}
        </div>
      </div>
      
      <div className="gallery-preview">
        {selectedTemplate ? (
          <TemplatePreview 
            templateId={selectedTemplate}
            className="main-template-preview"
          />
        ) : (
          <div className="no-selection">
            <h3>Select a template to preview</h3>
            <p>Choose a template from the list to see its visual preview</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CardEditor = () => {
  const [showTest, setShowTest] = useState(false);
  
  return (
    <div className="card-editor">
      <h2>Card Editor</h2>
      <p>Card editing interface will go here</p>
      
      <button 
        onClick={() => setShowTest(!showTest)}
        style={{ 
          marginTop: '1rem', 
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer'
        }}
      >
        {showTest ? 'Hide Test Panel' : 'Show Test Panel'}
      </button>
      
      {showTest && <TestPanelDemo />}
    </div>
  );
};

// Test component to demonstrate panel rendering
const TestPanelDemo = () => {
  const { createTestPanel, validateCanvasRendering, getCanvasMetrics } = require('./utils/test');
  const [canvasMetrics, setCanvasMetrics] = useState<any>(null);
  
  const testPanel = createTestPanel();
  
  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Canvas Rendering Test</h3>
      <p>This demonstrates our basic panel renderer with a test panel containing gradients, text slots, and image slots.</p>
      
      <div style={{ marginTop: '1rem' }}>
        <PanelRenderer
          panel={testPanel}
          onCanvasReady={(canvas: HTMLCanvasElement) => {
            const isValid = validateCanvasRendering(canvas);
            const metrics = getCanvasMetrics(canvas);
            
            console.log('Canvas validation:', isValid);
            console.log('Canvas metrics:', metrics);
            
            setCanvasMetrics(metrics);
          }}
        />
      </div>
      
      {canvasMetrics && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <strong>Canvas Metrics:</strong>
          <ul>
            <li>Dimensions: {canvasMetrics.width} × {canvasMetrics.height}</li>
            <li>Aspect Ratio: {canvasMetrics.aspectRatio?.toFixed(2)}</li>
            <li>Total Pixels: {canvasMetrics.totalPixels?.toLocaleString()}</li>
            <li>Memory Usage: ~{(canvasMetrics.memoryUsage / 1024 / 1024).toFixed(2)} MB</li>
            <li>Image Smoothing: {canvasMetrics.imageSmoothingEnabled ? 'Enabled' : 'Disabled'}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const PDFExport = () => (
  <div className="pdf-export">
    <h2>Export PDF</h2>
    <p>PDF generation will go here</p>
  </div>
)

type AppView = 'gallery' | 'editor' | 'export'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('gallery')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'gallery':
        return <TemplateGallery />
      case 'editor':
        return <CardEditor />
      case 'export':
        return <PDFExport />
      default:
        return <TemplateGallery />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Greeting Card Creator</h1>
        <nav className="app-nav">
          <button 
            className={currentView === 'gallery' ? 'active' : ''}
            onClick={() => setCurrentView('gallery')}
          >
            Templates
          </button>
          <button 
            className={currentView === 'editor' ? 'active' : ''}
            onClick={() => setCurrentView('editor')}
          >
            Editor
          </button>
          <button 
            className={currentView === 'export' ? 'active' : ''}
            onClick={() => setCurrentView('export')}
          >
            Export
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App
