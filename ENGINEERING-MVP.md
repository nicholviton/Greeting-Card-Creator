# Greeting Card Creator - Simplified Engineering Document (MVP)

## 1. Simplified Technical Architecture

### 1.1 System Architecture Overview

The MVP version uses a significantly simplified architecture focused on template-slot editing rather than complex canvas manipulation.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client-Side Application                   │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (React)                                           │
│  ├── Template Gallery Component                             │
│  ├── Slot Editor Component                                  │
│  ├── Panel Navigator Component                              │
│  └── PDF Export Component                                   │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                       │
│  ├── Template Engine (Simple JSON processing)              │
│  ├── Slot Management (Text/Image replacement)              │
│  ├── PDF Generation (jsPDF + DOM-to-Canvas)                │
│  └── Local Storage (Browser localStorage)                  │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── Template Library (Static JSON files)                  │
│  ├── Asset Storage (Static images)                         │
│  └── Project Storage (localStorage)                        │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Simplified Technology Stack

#### Core Technologies
- **Frontend**: React 18 with TypeScript (simplified, no complex state management)
- **Styling**: CSS Modules (no Tailwind needed)
- **Build Tool**: Vite (faster than Webpack for simple projects)
- **PDF Generation**: jsPDF + html2canvas (simpler than canvas-based approach)

#### Removed Complexities
- ❌ Fabric.js (no complex canvas needed)
- ❌ Redux/Zustand (simple useState sufficient)
- ❌ Image processing libraries
- ❌ Complex testing frameworks

#### Simple Dependencies
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "jspdf": "^2.5.0",
    "html2canvas": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0"
  }
}
```

## 2. Simplified Component Architecture

### 2.1 Core Components

#### Template Gallery Component
```typescript
interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
}

interface Template {
  id: string;
  name: string;
  category: 'birthday' | 'holiday' | 'thank-you' | 'get-well' | 'blank';
  thumbnail: string;
  panels: PanelData[];
}
```

#### Slot Editor Component
```typescript
interface SlotEditorProps {
  template: Template;
  currentPanel: number;
  projectData: ProjectData;
  onSlotUpdate: (slotId: string, value: string | File) => void;
}

interface TextSlot {
  id: string;
  placeholder: string;
  position: { x: number; y: number };
  maxLength: number;
  defaultFont: string;
  defaultSize: 'small' | 'medium' | 'large';
}

interface ImageSlot {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  shape: 'rectangle' | 'circle';
  defaultImage?: string;
}
```

#### PDF Export Component
```typescript
interface PDFExportProps {
  projectData: ProjectData;
  template: Template;
}

const generatePDF = async (project: ProjectData, template: Template) => {
  // Simple DOM-based PDF generation
  const pdf = new jsPDF('landscape', 'in', [11, 9]);
  // Render each panel to canvas and add to PDF
  // Much simpler than complex canvas manipulation
};
```

### 2.2 Simplified Data Models

#### Project Data (Simplified)
```typescript
interface ProjectData {
  id: string;
  name: string;
  templateId: string;
  lastModified: Date;
  slots: {
    [slotId: string]: SlotValue;
  };
}

interface SlotValue {
  type: 'text' | 'image';
  value: string; // text content or image data URL
  font?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}
```

#### Template Data (Static)
```typescript
interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  panels: {
    front: PanelDefinition;
    back: PanelDefinition;
    insideLeft: PanelDefinition;
    insideRight: PanelDefinition;
  };
}

interface PanelDefinition {
  background: string; // image path
  textSlots: TextSlot[];
  imageSlots: ImageSlot[];
}
```

## 3. Simplified Implementation Plan

### 3.1 Reduced Development Phases (9 weeks total)

#### Phase 1: Foundation (Weeks 1-2)
**Goal**: Basic template system and project structure

**Deliverables**:
- Project setup with React + Vite + TypeScript
- Template gallery with static JSON data
- Basic project data structure
- Simple template preview

**Technical Tasks**:
1. Initialize project with Vite React TypeScript template
2. Create basic component structure
3. Implement template gallery with grid layout
4. Create template data JSON files (5 initial templates)
5. Implement template selection and preview
6. Set up basic CSS styling
7. Add local storage utilities

**Complexity**: Low - Basic React components and static data

#### Phase 2: Slot Editor (Weeks 3-5)
**Goal**: Complete slot-based editing system

**Deliverables**:
- Text slot editing with font/color options
- Image slot upload and preview
- Panel navigation
- Real-time preview updates
- Project save/load functionality

**Technical Tasks**:
1. Implement text slot overlay and editing
2. Create font and color selection components
3. Add image upload with file validation
4. Implement image auto-fit to slots
5. Create panel navigation tabs
6. Add real-time preview updates
7. Implement project save/load to localStorage
8. Create additional templates (10 total)

**Complexity**: Medium - File handling and dynamic content

#### Phase 3: PDF Generation (Weeks 6-7)
**Goal**: High-quality PDF output for printing

**Deliverables**:
- PDF generation with proper layout
- Quarter-fold panel arrangement
- Print guidelines and fold lines
- Optimized file size and quality

**Technical Tasks**:
1. Implement DOM-to-canvas rendering for each panel
2. Create PDF layout logic for quarter-fold
3. Add fold line and margin indicators
4. Optimize image quality and file size
5. Implement print preview functionality
6. Add export options (with/without guidelines)
7. Test PDF output across different browsers

**Complexity**: Medium - PDF generation and layout calculation

#### Phase 4: Polish & Testing (Weeks 8-9)
**Goal**: Production-ready application with testing

**Deliverables**:
- Cross-browser compatibility
- Error handling and validation
- Performance optimization
- User interface polish
- Basic testing coverage

**Technical Tasks**:
1. Test and fix cross-browser issues
2. Add comprehensive error handling
3. Implement loading states and user feedback
4. Optimize performance (image loading, rendering)
5. Polish UI/UX with better styling
6. Add help text and user guidance
7. Implement basic unit tests for core functions
8. Test print output quality

**Complexity**: Low-Medium - Refinement and testing

### 3.2 Simplified Technical Implementation

#### Template Gallery (Simple Grid)
```typescript
const TemplateGallery = ({ onSelect }: TemplateGalleryProps) => {
  const [templates] = useState(STATIC_TEMPLATES);
  const [category, setCategory] = useState('all');

  const filteredTemplates = templates.filter(t => 
    category === 'all' || t.category === category
  );

  return (
    <div className="template-gallery">
      <CategoryFilter onChange={setCategory} />
      <div className="template-grid">
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id}
            template={template}
            onClick={() => onSelect(template)}
          />
        ))}
      </div>
    </div>
  );
};
```

#### Slot Editor (Click-to-Edit)
```typescript
const SlotEditor = ({ template, project, onUpdate }: SlotEditorProps) => {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const renderTextSlot = (slot: TextSlot) => (
    <div 
      className="text-slot"
      style={{
        position: 'absolute',
        left: slot.position.x,
        top: slot.position.y,
      }}
      onClick={() => setActiveSlot(slot.id)}
    >
      {project.slots[slot.id]?.value || slot.placeholder}
    </div>
  );

  const renderImageSlot = (slot: ImageSlot) => (
    <div 
      className="image-slot"
      style={{
        position: 'absolute',
        left: slot.position.x,
        top: slot.position.y,
        width: slot.size.width,
        height: slot.size.height,
      }}
      onClick={() => setActiveSlot(slot.id)}
    >
      <ImageUpload onUpload={(file) => onUpdate(slot.id, file)} />
    </div>
  );
};
```

#### PDF Generation (Simplified)
```typescript
const generatePDF = async (project: ProjectData, template: Template) => {
  const pdf = new jsPDF('landscape', 'in', [11, 9]);
  
  // Render each panel to canvas
  const panels = ['front', 'back', 'insideLeft', 'insideRight'];
  const canvases = await Promise.all(
    panels.map(panel => renderPanelToCanvas(template.panels[panel], project))
  );
  
  // Arrange in quarter-fold layout
  // Top row: insideRight, front
  // Bottom row: insideLeft, back
  pdf.addImage(canvases[2], 'PNG', 0.25, 0.25, 4.25, 5.5); // insideRight
  pdf.addImage(canvases[0], 'PNG', 4.75, 0.25, 4.25, 5.5); // front
  pdf.addImage(canvases[1], 'PNG', 0.25, 6, 4.25, 5.5);    // insideLeft
  pdf.addImage(canvases[3], 'PNG', 4.75, 6, 4.25, 5.5);    // back
  
  return pdf;
};
```

## 4. Simplified Quality Assurance

### 4.1 Reduced Testing Strategy

#### Essential Testing Only
- **Unit Tests**: Core functions only (template loading, slot updates, PDF generation)
- **Integration Tests**: Complete user workflow (template → edit → export)
- **Manual Testing**: Cross-browser compatibility and print output
- **No Complex Testing**: Skip advanced testing frameworks, focus on core functionality

#### Browser Testing (Simplified)
- **Primary**: Chrome (latest)
- **Secondary**: Firefox, Safari, Edge (latest versions)
- **Mobile**: Basic responsive testing on tablet only

### 4.2 Performance Targets (Relaxed)
- **Template Gallery**: Load in under 3 seconds
- **Slot Updates**: Immediate feedback
- **PDF Generation**: Under 8 seconds
- **Image Upload**: Progress for files over 2MB

## 5. Simplified Deployment

### 5.1 Static Hosting
- **Platform**: Netlify or Vercel (free tier)
- **Build**: Simple `npm run build` output
- **Assets**: All templates and images served statically
- **No Backend**: Completely client-side application

### 5.2 Development Workflow
```bash
# Simple development setup
npm install
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 6. Risk Mitigation (Simplified)

### 6.1 Technical Risks (Reduced)
- **PDF Quality**: Test early with real printers
- **Browser Compatibility**: Focus on modern browsers only
- **File Size**: Optimize images and limit template complexity
- **Performance**: Keep templates simple and lightweight

### 6.2 Scope Control
- **Feature Creep**: Stick strictly to template-slot editing
- **Template Complexity**: Limit to simple layouts only
- **Customization Depth**: Basic options only
- **Future-Proofing**: Design for easy expansion but don't build it yet

## 7. Success Metrics (Simplified)

### 7.1 MVP Success Criteria
- ✅ User can complete a card in under 5 minutes
- ✅ PDF prints correctly on home printers
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Template gallery loads quickly
- ✅ No critical bugs in main workflow

### 7.2 Technical Achievements
- 🎯 9-week development timeline
- 🎯 Single developer capable
- 🎯 Minimal maintenance overhead
- 🎯 Easy to extend for Phase 2

---

**Document Version**: 2.0 (Simplified MVP)  
**Last Updated**: August 9, 2025  
**Estimated Effort**: 60% reduction from original scope  
**Timeline**: 9 weeks vs 15 weeks original
