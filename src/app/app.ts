import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineGridComponent } from './components/timeline-grid/timeline-grid.component';
import { ResourcePanelComponent } from './components/resource-panel/resource-panel.component';
import { ResourceToolbarComponent } from './components/resource-toolbar/resource-toolbar.component';
import { LucideAngularModule } from 'lucide-angular';
import { RoadmapService } from './services/roadmap.service';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TaskDetailPanelComponent } from './components/task-detail-panel/task-detail-panel.component';
import { AddTrackModalComponent } from './components/add-track-modal/add-track-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { TimelineItem } from './models/roadmap.model';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TimelineGridComponent, ResourcePanelComponent, ResourceToolbarComponent, ToolbarComponent, TaskDetailPanelComponent, AddTrackModalComponent,
    SettingsModalComponent, LucideAngularModule],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="logo">
          <div class="logo-icon">R</div>
          Roadmap Maker
        </div>
        <div class="roadmap-selector">
          <span class="roadmap-title">{{ roadmap().title }}</span>
          <lucide-icon name="arrow-down" [size]="12" class="dropdown-icon"></lucide-icon>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost"><lucide-icon name="undo" [size]="14"></lucide-icon> Undo</button>
          <button class="btn btn-ghost"><lucide-icon name="redo" [size]="14"></lucide-icon> Redo</button>
          <button class="btn btn-secondary" (click)="openSettings()"><lucide-icon name="settings" [size]="14"></lucide-icon> Settings</button>
          <button class="btn btn-secondary"><lucide-icon name="download" [size]="14"></lucide-icon> Export</button>
          <button class="btn btn-primary"><lucide-icon name="check" [size]="14"></lucide-icon> Saved</button>
        </div>
      </header>

      <app-toolbar (addTrack)="addTrack()"></app-toolbar>

      <!-- Legend Bar -->
      <div class="legend-bar">
        <div class="legend-section">
          <span class="legend-section-title">Categories</span>
          <div class="legend-item"><span class="legend-dot smart-img"></span> Smart Image</div>
          <div class="legend-item"><span class="legend-dot ai-related"></span> AI / ML</div>
          <div class="legend-item"><span class="legend-dot one-off"></span> One-off</div>
          <div class="legend-item"><span class="legend-dot ongoing"></span> Ongoing</div>
          <div class="legend-item"><span class="legend-dot ongoing"></span> Ongoing</div>
        </div>
        <div class="legend-section">
            <span class="legend-section-title">Properties</span>
            <div class="legend-item"><lucide-icon name="star" [size]="10"></lucide-icon> High Value</div>
            <div class="legend-item"><lucide-icon name="dollar-sign" [size]="10"></lucide-icon> Revenue Maker</div>
        </div>
        <div class="legend-section">
          <span class="legend-section-title">Resources</span>
          <div class="resource-badge-legend">
            <span class="fe">F</span> Frontend
          </div>
          <div class="resource-badge-legend">
            <span class="be">B</span> Backend
          </div>
          <div class="resource-badge-legend">
            <span class="ml">M</span> ML
          </div>
          <div class="resource-badge-legend">
            <span class="ux">U</span> UX/UI
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <app-sidebar (addTrack)="addTrack()"></app-sidebar>
        
        <div class="main-content">
            <app-timeline-grid 
              [roadmap]="roadmap()"
              (taskClick)="onTaskClick($event)"
              (addTrack)="addTrack()"
            ></app-timeline-grid>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="footer-stats">
        <div class="stat-item">
          <span class="stat-value">{{ lanes().length }}</span> Tracks
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ sprints().length }}</span> Sprints
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ getTotalTaskCount() }}</span> Tasks
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ getTotalWeeks() }}</span> weeks
        </div>
        <div class="save-status">
          <span class="save-dot"></span> Auto-saved 2 minutes ago
        </div>
      </div>

      <app-task-detail-panel 
        *ngIf="selectedItem()" 
        [item]="selectedItem()!" 
        [laneId]="selectedLaneId()!"
        (close)="closeDetailPanel()">
    </app-task-detail-panel>

    <app-add-track-modal
        *ngIf="showAddTrackModal()"
        (close)="onCloseTrackModal()"
        (save)="onSaveTrack($event)">
    </app-add-track-modal>

      <app-settings-modal
        *ngIf="showSettings()"
        [settings]="settings()"
        (close)="showSettings.set(false)"
      ></app-settings-modal>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-primary);
    }

    /* Header */
    .header {
      height: var(--header-height);
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 16px;
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 15px;
      color: var(--text-primary);
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--ai-related), var(--smart-img));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      color: var(--bg-primary);
    }

    .roadmap-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .roadmap-selector:hover {
      border-color: var(--ai-related);
    }

    .roadmap-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .dropdown-icon {
      color: var(--text-muted);
    }

    .header-actions {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      border: none;
      font-family: inherit;
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
    }

    .btn-ghost:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: var(--bg-hover);
    }

    .btn-primary {
      background: var(--ai-related);
      color: var(--bg-primary);
    }

    .btn-primary:hover {
      background: #79b8ff;
    }

    /* Legend Bar */
    .legend-bar {
      height: var(--legend-height);
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 20px;
      flex-shrink: 0;
    }

    .legend-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .legend-section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-right: 4px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .legend-item:hover {
      background: var(--bg-tertiary);
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }

    .legend-dot.smart-img { background: var(--smart-img); }
    .legend-dot.ai-related { background: var(--ai-related); }
    .legend-dot.one-off { background: var(--one-off); }
    .legend-dot.ongoing { background: var(--ongoing); }
    .legend-dot.revenue { background: var(--revenue); }

    .resource-badge-legend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .resource-badge-legend span {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
    }

    .resource-badge-legend .fe { background: rgba(88, 166, 255, 0.2); color: var(--fe-color); }
    .resource-badge-legend .be { background: rgba(63, 185, 80, 0.2); color: var(--be-color); }
    .resource-badge-legend .ml { background: rgba(247, 129, 102, 0.2); color: var(--ml-color); }
    .resource-badge-legend .ux { background: rgba(163, 113, 247, 0.2); color: var(--ux-color); }
    
    .content-wrapper {
        flex: 1;
        display: flex;
        overflow-y: auto; /* Enable vertical scrolling for the entire wrapper */
        overflow-x: hidden;
        position: relative;
        --timeline-header-height: 72px; /* Standardize header height */
    }

    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: visible; /* Allow content to expand */
        position: relative;
        min-width: 0; /* Prevent flex overflow issues */
    }

    .roadmap-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: visible;
      position: relative;
    }

    app-timeline-grid {
      flex: 1;
      overflow-x: auto; /* Allow horizontal scrolling */
      overflow-y: visible; /* Let content-wrapper handle vertical scrolling */
      /* Ensure grid takes available space */
    }

    /* Footer Stats */
    .footer-stats {
      height: 32px;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 24px;
      flex-shrink: 0;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .stat-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .save-status {
      margin-left: auto;
      font-size: 11px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .save-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--smart-img);
    }
  `]
})
export class App {
  private roadmapService = inject(RoadmapService);

  // Expose service for debugging
  constructor() {
    (window as any).roadmapService = this.roadmapService;
  }

  lanes = this.roadmapService.lanes;
  roadmap = this.roadmapService.roadmap;
  sprints = this.roadmapService.sprints;
  settings = this.roadmapService.settings;

  // Selection State
  selectedItem = signal<TimelineItem | null>(null);
  selectedLaneId = signal<string | null>(null);
  showSettings = signal<boolean>(false);

  openSettings() {
    this.showSettings.set(true);
  }

  onTaskClick(event: { item: TimelineItem, laneId: string }) {
    this.selectedItem.set(event.item);
    this.selectedLaneId.set(event.laneId);
  }

  closeDetailPanel() {
    this.selectedItem.set(null);
    this.selectedLaneId.set(null);
  }

  // Add Track Modal State
  showAddTrackModal = signal(false);

  addTrack() {
    this.showAddTrackModal.set(true);
  }

  onSaveTrack(trackData: { name: string; category: string; categoryId: string; description: string }) {
    this.roadmapService.addLane(trackData.name, trackData.category, trackData.categoryId, trackData.description);
    this.showAddTrackModal.set(false);
  }

  onCloseTrackModal() {
    this.showAddTrackModal.set(false);
  }

  getCategoryCount(category: string): number {
    return this.lanes().filter(l => l.categoryId === category).length;
  }

  getTotalTaskCount(): number {
    return this.lanes().reduce((acc, lane) => acc + lane.items.length, 0);
  }

  getTotalWeeks(): number {
    return this.sprints().length * this.settings().sprintDurationWeeks;
  }
}
