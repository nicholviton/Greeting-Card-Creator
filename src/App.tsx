import { useState } from 'react'
import './App.css'

// Temporary placeholder components for initial setup
const TemplateGallery = () => (
  <div className="template-gallery">
    <h2>Template Gallery</h2>
    <p>Template selection will go here</p>
  </div>
)

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
