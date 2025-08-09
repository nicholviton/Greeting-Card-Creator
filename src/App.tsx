import { useState, useEffect } from 'react'
import './App.css'
import { getAllTemplates, getAllCategories, getTemplatesByCategory, Template } from './data'

// Temporary placeholder components for initial setup
const TemplateGallery = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = getAllCategories();
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const loadedTemplates = await getAllTemplates();
        setTemplates(loadedTemplates);
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
      <h2>Template Gallery</h2>
      <p>Total templates: {templates.length}</p>
      <h3>Categories:</h3>
      <ul>
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
          <div key={template.id} className="template-item">
            <h4>{template.name}</h4>
            <p>Category: {template.category}</p>
            <p>{template.description}</p>
            <small>Created: {template.createdAt?.toLocaleDateString() || 'Unknown'}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

const CardEditor = () => (
  <div className="card-editor">
    <h2>Card Editor</h2>
    <p>Card editing interface will go here</p>
  </div>
)

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
