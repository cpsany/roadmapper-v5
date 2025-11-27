# Roadmap Maker App - Product Specification

## Overview

A dynamic, browser-based roadmap planning application that allows teams to create, manage, and visualize product roadmaps with sprint-based timelines and resource allocation tracking.

---

## Core Concepts & Terminology

| Term | Description |
|------|-------------|
| **Roadmap** | A complete planning document containing tracks, sprints, and settings |
| **Track** | A horizontal row representing a feature area or initiative (e.g., "Bulk Analysis", "AI Smart Templates") |
| **Objective** | The goal/description for a track - what it aims to achieve |
| **Task Item** | A unit of work within a track that spans one or more sprints (e.g., "Vector Embed v1") |
| **Sprint** | A fixed time period (configurable, default 3 weeks) |
| **Resource Allocation** | Per-sprint assignment of team members by role (FE, BE, ML, UX) |
| **Category** | Classification for tracks (Smart Image, AI/ML, One-off, Ongoing, Revenue, etc.) |

---

## Data Model

### 1. Roadmap
```typescript
interface Roadmap {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: RoadmapSettings;
  tracks: Track[];
  categories: Category[];
}
```

### 2. Roadmap Settings
```typescript
interface RoadmapSettings {
  // Sprint Configuration
  sprintPrefix: string;           // e.g., "S-"
  sprintStartNumber: number;      // e.g., 199
  sprintDurationWeeks: number;    // e.g., 3
  sprintStartDate: Date;          // e.g., "2026-01-12"
  numberOfSprints: number;        // e.g., 12
  
  // Display Options
  showQuarterMarkers: boolean;
  showResourceTotals: boolean;
  showDependencyArrows: boolean;
  theme: 'dark' | 'light';
  
  // Resource Types (customizable)
  resourceTypes: ResourceType[];
  
  // Company/Branding
  companyName?: string;
  companyLogo?: string;
}
```

### 3. Resource Type
```typescript
interface ResourceType {
  id: string;
  code: string;          // e.g., "FE", "BE", "ML", "UX"
  name: string;          // e.g., "Frontend", "Backend"
  color: string;         // e.g., "#58a6ff"
  bgColor: string;       // e.g., "rgba(88, 166, 255, 0.2)"
}
```

### 4. Category
```typescript
interface Category {
  id: string;
  name: string;          // e.g., "Smart Image", "AI / ML"
  color: string;         // e.g., "#3fb950"
  bgColor: string;       // e.g., "rgba(63, 185, 80, 0.15)"
  order: number;         // Display order in legend
}
```

### 5. Track
```typescript
interface Track {
  id: string;
  roadmapId: string;
  categoryId: string;
  name: string;                    // e.g., "Bulk Analysis"
  objective: string;               // Detailed description
  order: number;                   // Vertical position
  isCollapsed: boolean;            // UI state
  tasks: TaskItem[];
  dependsOn?: string[];            // Track IDs this depends on
}
```

### 6. Task Item
```typescript
interface TaskItem {
  id: string;
  trackId: string;
  name: string;                    // e.g., "Vector Embed v1"
  shortName?: string;              // Abbreviated for display, e.g., "VE v1"
  description?: string;            // Detailed description
  startSprint: number;             // Sprint index (0-based)
  endSprint: number;               // Sprint index (0-based)
  isHighValue: boolean;            // Show star indicator
  isMilestone: boolean;            // Diamond marker instead of bar
  status: TaskStatus;
  sprintAllocations: SprintAllocation[];
  dependsOn?: string[];            // Task IDs this depends on
  color?: string;                  // Override category color
  tags?: string[];                 // Custom tags
  notes?: string;                  // Internal notes
}

type TaskStatus = 'planned' | 'in-progress' | 'completed' | 'blocked' | 'at-risk';
```

### 7. Sprint Allocation
```typescript
interface SprintAllocation {
  sprintIndex: number;
  resources: ResourceCount[];
  isContinuation: boolean;         // Show dashed border
  notes?: string;                  // Sprint-specific notes
}

interface ResourceCount {
  resourceTypeId: string;
  count: number;
}
```

---

## Feature Specification

### Phase 1: Core MVP

#### 1.1 Roadmap Management
- [ ] Create new roadmap with name and settings
- [ ] Edit roadmap settings (sprint config, duration, start date)
- [ ] Delete roadmap with confirmation
- [ ] Duplicate roadmap
- [ ] List all saved roadmaps

#### 1.2 Track Management
- [ ] Add new track with category, name, and objective
- [ ] Edit track details inline
- [ ] Delete track with confirmation
- [ ] Reorder tracks via drag-and-drop
- [ ] Collapse/expand track rows
- [ ] Assign category to track

#### 1.3 Category Management
- [ ] Default categories pre-populated (Smart Image, AI/ML, One-off, Ongoing, Revenue)
- [ ] Add custom categories
- [ ] Edit category name and colors
- [ ] Delete unused categories
- [ ] Reorder categories in legend

#### 1.4 Task Item Management
- [ ] Add task item to track
- [ ] Set task name and short name
- [ ] Set start and end sprint (click-drag on grid)
- [ ] Edit task details in modal/sidebar
- [ ] Delete task item
- [ ] Mark as high-value (star indicator)
- [ ] Set task status

#### 1.5 Resource Allocation
- [ ] Add/edit resource counts per sprint for a task
- [ ] Show resource badges under task bars
- [ ] Configure resource types (FE, BE, ML, UX, etc.)
- [ ] Show ramp-up/ramp-down visually

#### 1.6 Sprint Configuration
- [ ] Set sprint prefix and starting number
- [ ] Set sprint duration (weeks)
- [ ] Set start date
- [ ] Auto-calculate sprint date ranges
- [ ] Set number of sprints to display
- [ ] Show quarter markers (Q1, Q2, Q3, Q4)

#### 1.7 Visualization
- [ ] Render roadmap grid with tracks and sprints
- [ ] Color-coded task bars by category
- [ ] Sticky header (sprint timeline)
- [ ] Sticky sidebar (track names/objectives)
- [ ] Hover tooltips with task details
- [ ] Continuation bars (dashed) for multi-sprint tasks
- [ ] High-value star indicators
- [ ] Resource badges per sprint

#### 1.8 Data Persistence
- [ ] Save to IndexedDB (local browser storage)
- [ ] Auto-save on changes
- [ ] Manual save button
- [ ] Last saved timestamp display

---

### Phase 2: Enhanced Features

#### 2.1 Dependency Management
- [ ] Define task-to-task dependencies
- [ ] Define track-to-track dependencies
- [ ] Visualize dependencies with arrows/lines
- [ ] Highlight dependency chain on hover
- [ ] Circular dependency detection and warning

#### 2.2 Resource Analytics
- [ ] Resource utilization summary per sprint
- [ ] Total resources per track
- [ ] Resource conflicts/over-allocation warnings
- [ ] Resource heatmap view
- [ ] Capacity planning calculator

#### 2.3 Advanced Task Features
- [ ] Task status workflow (planned → in-progress → completed)
- [ ] Milestone markers (diamond shape)
- [ ] Task tags and filtering
- [ ] Task notes/comments
- [ ] Link to external resources (Jira, docs)
- [ ] Task templates

#### 2.4 Timeline Features
- [ ] Zoom in/out (show fewer/more sprints)
- [ ] Scroll to today/current sprint
- [ ] Quarter/month summary view
- [ ] Fiscal year alignment option
- [ ] Custom date format settings

#### 2.5 Filtering & Search
- [ ] Filter by category
- [ ] Filter by status
- [ ] Filter by resource type
- [ ] Filter by tags
- [ ] Search tasks by name
- [ ] Show/hide empty tracks

#### 2.6 Themes & Customization
- [ ] Dark/Light theme toggle
- [ ] Custom color schemes
- [ ] Font size adjustment
- [ ] Compact vs. comfortable view
- [ ] Custom CSS injection (advanced)

---

### Phase 3: Collaboration & Export

#### 3.1 Import/Export
- [ ] Export to JSON file
- [ ] Import from JSON file
- [ ] Export to PNG/SVG image
- [ ] Export to PDF
- [ ] Export to CSV (task list)
- [ ] Import from CSV

#### 3.2 Sharing
- [ ] Generate shareable read-only link (via URL encoding)
- [ ] Embed code for websites
- [ ] Present mode (full-screen, no editing)

#### 3.3 Templates
- [ ] Save roadmap as template
- [ ] Load from template
- [ ] Pre-built industry templates
- [ ] Community template gallery (future)

#### 3.4 Version History
- [ ] Auto-save versions
- [ ] View version history
- [ ] Restore previous version
- [ ] Compare versions (diff view)

#### 3.5 Multi-Roadmap Features
- [ ] Roadmap folders/organization
- [ ] Cross-roadmap dependencies
- [ ] Portfolio view (multiple roadmaps)

---

## User Interface Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                  │
│  ┌─────────────┬──────────────────────────────────────┬───────────────┐ │
│  │ Logo/Name   │ Roadmap Title (editable)             │ Actions Menu  │ │
│  └─────────────┴──────────────────────────────────────┴───────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│  TOOLBAR                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ + Add Track │ Settings │ Filter │ Search │ Zoom │ Theme │ Export   ││
│  └─────────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────────┤
│  LEGEND BAR                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ [●] Smart Image  [●] AI/ML  [●] One-off  [●] Ongoing  [●] Revenue  ││
│  │ [F] Frontend  [B] Backend  [M] ML  [U] UX/UI                        ││
│  └─────────────────────────────────────────────────────────────────────┘│
├───────────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR          │  GRID                                                │
│  (Sticky)         │  (Scrollable)                                        │
│  ┌───────────────┐│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐ │
│  │ Track/        ││  │S-199│S-200│S-201│S-202│S-203│S-204│S-205│S-206│ │
│  │ Objective     ││  │Jan  │Feb  │Feb  │Mar  │Apr  │Apr  │May  │Jun  │ │
│  ├───────────────┤│  ├─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┤ │
│  │ Track 1       ││  │ [Task Bar]        [Task Bar]                   │ │
│  │ Objective...  ││  │                                                 │ │
│  ├───────────────┤│  ├─────────────────────────────────────────────────┤ │
│  │ Track 2       ││  │      [Task Bar]              [Task Bar]        │ │
│  │ Objective...  ││  │                                                 │ │
│  ├───────────────┤│  ├─────────────────────────────────────────────────┤ │
│  │ Track 3       ││  │ [Task]    [Task]    [Task]                     │ │
│  │ Objective...  ││  │                                                 │ │
│  └───────────────┘│  └─────────────────────────────────────────────────┘ │
├───────────────────┴─────────────────────────────────────────────────────┤
│  FOOTER / STATS BAR                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ 18 Tracks │ 12 Sprints │ 45 Tasks │ Last saved: 2 mins ago         ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Header Component
- Logo/App name (left)
- Roadmap title with inline editing (center)
- Actions menu: Save, Export, Settings, Help (right)
- Roadmap selector dropdown

#### 2. Toolbar Component
- **+ Add Track** button (opens modal)
- **Settings** button (opens settings panel)
- **Filter** dropdown (category, status, tags)
- **Search** input field
- **Zoom** slider or buttons (+/-)
- **Theme** toggle (dark/light)
- **Export** dropdown (PNG, PDF, JSON)
- **Undo/Redo** buttons

#### 3. Legend Component
- Category color indicators (clickable to filter)
- Resource type indicators
- Toggleable visibility

#### 4. Sidebar Component (Track List)
- Track category badge
- Track name (editable inline)
- Track objective (expandable)
- Drag handle for reordering
- Quick actions: Edit, Delete, Add Task
- Collapse/expand toggle

#### 5. Grid Component
- Sprint headers (sticky top)
- Sprint date ranges
- Quarter markers (Q1, Q2, Q3, Q4)
- Today indicator line
- Grid cells for each track × sprint intersection

#### 6. Task Bar Component
- Colored bar based on category
- Task name label
- High-value star indicator
- Status indicator (color/icon)
- Hover tooltip with details
- Click to select/edit
- Drag edges to resize (change sprint span)
- Drag to move across sprints

#### 7. Resource Badges Component
- Displayed below task bars
- Shows FE/BE/ML/UX counts
- Color-coded by resource type
- Editable on click

#### 8. Task Detail Panel (Slide-out)
- Task name input
- Short name input
- Description textarea
- Sprint range selector
- Resource allocation per sprint (table/grid)
- Status dropdown
- High-value checkbox
- Dependencies selector
- Tags input
- Notes textarea
- Delete button

#### 9. Settings Panel
- **General**: Roadmap name, description
- **Sprints**: Prefix, start number, duration, start date, count
- **Categories**: Manage categories
- **Resources**: Manage resource types
- **Display**: Theme, show/hide options
- **Data**: Import, Export, Clear

#### 10. Modals
- Add/Edit Track Modal
- Add/Edit Category Modal
- Add/Edit Resource Type Modal
- Confirm Delete Modal
- Import/Export Modal
- Keyboard Shortcuts Help Modal

---

## Interactions & UX

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save roadmap |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl/Cmd + N` | Add new track |
| `Delete/Backspace` | Delete selected item |
| `Escape` | Close modal/deselect |
| `Arrow keys` | Navigate grid |
| `Enter` | Edit selected item |
| `T` | Toggle theme |

### Drag & Drop Behaviors
1. **Track Reordering**: Drag track sidebar to reorder vertically
2. **Task Moving**: Drag task bar to move to different sprints
3. **Task Resizing**: Drag task bar edges to extend/shrink duration
4. **Task Creation**: Click-drag on empty grid cells to create new task

### Context Menus (Right-click)
- **On Track**: Edit, Delete, Duplicate, Add Task, Move Up/Down
- **On Task**: Edit, Delete, Duplicate, Mark High-Value, Change Status
- **On Grid Cell**: Add Task Here, Paste Task

### Inline Editing
- Double-click track name to edit
- Double-click task bar to edit name
- Click resource badge to edit count

---

## Technical Architecture

### Tech Stack (Recommended)
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand or Redux Toolkit
- **Styling**: Tailwind CSS + CSS Variables
- **Drag & Drop**: @dnd-kit/core
- **Database**: IndexedDB via Dexie.js
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Modals/Tooltips**: Radix UI primitives
- **Export**: html2canvas (PNG), jsPDF (PDF)

### Project Structure
```
src/
├── components/
│   ├── Header/
│   ├── Toolbar/
│   ├── Legend/
│   ├── Sidebar/
│   │   ├── TrackList.tsx
│   │   └── TrackItem.tsx
│   ├── Grid/
│   │   ├── RoadmapGrid.tsx
│   │   ├── SprintHeader.tsx
│   │   ├── GridCell.tsx
│   │   └── TaskBar.tsx
│   ├── Panels/
│   │   ├── TaskDetailPanel.tsx
│   │   └── SettingsPanel.tsx
│   ├── Modals/
│   │   ├── AddTrackModal.tsx
│   │   ├── CategoryModal.tsx
│   │   └── ConfirmModal.tsx
│   └── shared/
│       ├── ResourceBadge.tsx
│       ├── CategoryBadge.tsx
│       └── Tooltip.tsx
├── hooks/
│   ├── useRoadmap.ts
│   ├── useTracks.ts
│   ├── useTasks.ts
│   ├── useKeyboardShortcuts.ts
│   └── useAutoSave.ts
├── store/
│   ├── roadmapStore.ts
│   ├── uiStore.ts
│   └── historyStore.ts
├── db/
│   ├── database.ts
│   └── migrations.ts
├── utils/
│   ├── sprintCalculator.ts
│   ├── exportUtils.ts
│   └── colorUtils.ts
├── types/
│   └── index.ts
├── constants/
│   └── defaults.ts
└── App.tsx
```

### IndexedDB Schema (Dexie.js)
```typescript
// db/database.ts
import Dexie, { Table } from 'dexie';

export class RoadmapDB extends Dexie {
  roadmaps!: Table<Roadmap>;
  tracks!: Table<Track>;
  tasks!: Table<TaskItem>;
  categories!: Table<Category>;
  resourceTypes!: Table<ResourceType>;
  settings!: Table<RoadmapSettings>;

  constructor() {
    super('RoadmapMakerDB');
    
    this.version(1).stores({
      roadmaps: '++id, name, createdAt, updatedAt',
      tracks: '++id, roadmapId, categoryId, order',
      tasks: '++id, trackId, startSprint, endSprint, status',
      categories: '++id, name, order',
      resourceTypes: '++id, code',
      settings: '++id, roadmapId'
    });
  }
}

export const db = new RoadmapDB();
```

### State Management (Zustand)
```typescript
// store/roadmapStore.ts
interface RoadmapStore {
  // State
  currentRoadmap: Roadmap | null;
  tracks: Track[];
  tasks: TaskItem[];
  selectedTaskId: string | null;
  
  // Actions
  loadRoadmap: (id: string) => Promise<void>;
  saveRoadmap: () => Promise<void>;
  addTrack: (track: Partial<Track>) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
  reorderTracks: (fromIndex: number, toIndex: number) => void;
  addTask: (trackId: string, task: Partial<TaskItem>) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  
  // Computed
  getTrackById: (id: string) => Track | undefined;
  getTasksByTrack: (trackId: string) => TaskItem[];
  getTaskById: (id: string) => TaskItem | undefined;
}
```

---

## Default Data

### Default Categories
```typescript
const defaultCategories: Category[] = [
  { id: '1', name: 'Smart Image', color: '#3fb950', bgColor: 'rgba(63, 185, 80, 0.15)', order: 1 },
  { id: '2', name: 'AI / ML', color: '#58a6ff', bgColor: 'rgba(88, 166, 255, 0.15)', order: 2 },
  { id: '3', name: 'One-off', color: '#f78166', bgColor: 'rgba(247, 129, 102, 0.15)', order: 3 },
  { id: '4', name: 'Ongoing', color: '#a371f7', bgColor: 'rgba(163, 113, 247, 0.15)', order: 4 },
  { id: '5', name: 'Revenue', color: '#f0c14b', bgColor: 'rgba(240, 193, 75, 0.15)', order: 5 },
];
```

### Default Resource Types
```typescript
const defaultResourceTypes: ResourceType[] = [
  { id: '1', code: 'FE', name: 'Frontend', color: '#58a6ff', bgColor: 'rgba(88, 166, 255, 0.2)' },
  { id: '2', code: 'BE', name: 'Backend', color: '#3fb950', bgColor: 'rgba(63, 185, 80, 0.2)' },
  { id: '3', code: 'ML', name: 'ML Engineer', color: '#f78166', bgColor: 'rgba(247, 129, 102, 0.2)' },
  { id: '4', code: 'UX', name: 'UX/UI', color: '#a371f7', bgColor: 'rgba(163, 113, 247, 0.2)' },
];
```

### Default Settings
```typescript
const defaultSettings: RoadmapSettings = {
  sprintPrefix: 'S-',
  sprintStartNumber: 199,
  sprintDurationWeeks: 3,
  sprintStartDate: new Date('2026-01-12'),
  numberOfSprints: 12,
  showQuarterMarkers: true,
  showResourceTotals: true,
  showDependencyArrows: false,
  theme: 'dark',
  resourceTypes: defaultResourceTypes,
};
```

---

## Implementation Phases

### Phase 1: MVP (2-3 weeks)
**Goal**: Basic functional roadmap with CRUD operations

- [ ] Project setup (React + TypeScript + Tailwind)
- [ ] IndexedDB setup with Dexie.js
- [ ] Basic layout (header, sidebar, grid)
- [ ] Roadmap CRUD (create, read, update, delete)
- [ ] Track CRUD with drag-to-reorder
- [ ] Task CRUD with click-to-create on grid
- [ ] Task bar rendering with category colors
- [ ] Resource allocation (basic)
- [ ] Sprint configuration
- [ ] Auto-save to IndexedDB
- [ ] Dark theme

### Phase 2: Enhanced UX (1-2 weeks)
**Goal**: Polish interactions and add productivity features

- [ ] Drag-to-resize task bars
- [ ] Drag-to-move task bars
- [ ] Inline editing (track names, task names)
- [ ] Keyboard shortcuts
- [ ] Undo/Redo
- [ ] Search and filter
- [ ] Tooltips and hover states
- [ ] Task detail slide-out panel
- [ ] Light theme + toggle

### Phase 3: Advanced Features (2-3 weeks)
**Goal**: Power-user features and export capabilities

- [ ] Dependency arrows
- [ ] Resource analytics dashboard
- [ ] Task status workflow
- [ ] Milestones
- [ ] Export to PNG/PDF/JSON
- [ ] Import from JSON
- [ ] Version history
- [ ] Templates

### Phase 4: Polish & Optimization (1 week)
**Goal**: Performance and edge cases

- [ ] Performance optimization (virtualization for large roadmaps)
- [ ] Responsive design improvements
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Error handling and validation
- [ ] Empty states
- [ ] Onboarding/tutorial

---

## Future Considerations

### Cloud Sync (Future)
- User authentication
- Cloud database (Firebase, Supabase)
- Real-time collaboration
- Team workspaces

### Integrations (Future)
- Jira import/sync
- GitHub issues import
- Google Sheets export
- Slack notifications
- Calendar integration

### Mobile (Future)
- Responsive mobile view
- Touch-friendly interactions
- PWA support

---

## Success Metrics

1. **Usability**: User can create a complete roadmap in < 10 minutes
2. **Performance**: Grid renders 20 tracks × 12 sprints in < 100ms
3. **Reliability**: Auto-save works without data loss
4. **Adoption**: Users return to edit roadmaps multiple times

---

## Open Questions

1. Should we support multiple roadmaps per "workspace" in MVP?
2. How granular should version history be (every change vs. periodic snapshots)?
3. Should resource counts support decimals (e.g., 0.5 FE)?
4. What's the maximum number of sprints/tracks we should support?
5. Should we add a "presentation mode" for stakeholder reviews?

---

*Document Version: 1.0*
*Last Updated: 2026-01-XX*
*Author: Claude + Sandy*
