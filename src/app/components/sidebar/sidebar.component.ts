import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapService } from '../../services/roadmap.service';
import { LucideAngularModule } from 'lucide-angular';
import { Lane } from '../../models/roadmap.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="sidebar">
      <div class="header">
        <span class="sidebar-title">Tracks ({{ lanes().length }})</span>
        <div class="header-actions">
            <button class="icon-btn" title="Add Track" (click)="addTrack.emit()">
                <lucide-icon name="plus" [size]="16"></lucide-icon>
            </button>
            <button class="icon-btn" title="Collapse all">
                <lucide-icon name="menu" [size]="16"></lucide-icon>
            </button>
        </div>
      </div>
      
      <div class="track-list">
        <div *ngFor="let lane of lanes()" class="track-item" [class.selected]="false" [class.mini-track]="isMiniView">
          <div class="track-item-header">
            <span class="track-drag-handle">⋮⋮</span>
            <span class="track-category-badge" [ngClass]="getCategoryClass(lane.category)">
                {{ lane.category || 'Smart Image' }}
            </span>
          </div>
          <div class="track-name">{{ lane.name }}</div>
          <div class="track-objective">{{ lane.description || 'No objective defined.' }}</div>
          
          <div class="track-item-actions">
            <button class="btn-icon" title="Add task" (click)="addItem(lane.id)">+</button>
            <button class="btn-icon" title="Edit" (click)="editTrack.emit(lane)">✎</button>
            <button class="btn-icon" title="Delete" (click)="deleteLane(lane.id)">🗑</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 300px;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-default);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: auto; /* Allow height to grow */
      min-height: 100%;
      z-index: 30;
    }

    .header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--timeline-header-height);
      box-sizing: border-box;
      position: sticky;
      top: 0;
      z-index: 20;
      background: var(--bg-secondary);
    }

    .sidebar-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .track-list {
      flex: 1;
      overflow: visible; /* Remove internal scroll */
    }

    .track-item {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-muted);
      cursor: pointer;
      transition: all 0.15s;
      transition: all 0.15s;
      position: relative;
      height: 88px; /* Fixed height to match Grid */
      box-sizing: border-box;
      background: var(--bg-primary); /* Default to dark (primary) to match Grid base */
    }

    .track-item:nth-child(odd) {
      background: var(--bg-secondary); /* Alternating lighter (secondary) */
    }

    .track-item.mini-track {
        height: 150px; /* Increased height for Mini View vertical tasks */
    }

    .track-item:hover {
      background: var(--bg-tertiary);
    }

    .track-item.selected {
      background: var(--bg-active);
      border-left: 2px solid var(--accent-blue);
    }

    .track-item-header {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
    }

    .track-drag-handle {
      color: var(--text-muted);
      cursor: grab;
      padding: 2px;
      font-size: 10px;
    }

    .track-drag-handle:hover {
      color: var(--text-secondary);
    }

    .track-category-badge {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 2px 6px;
      border-radius: 3px;
    }

    /* Category Colors */
    .track-category-badge.smart-img { background: rgba(63, 185, 80, 0.15); color: var(--smart-img); }
    .track-category-badge.ai-related { background: rgba(88, 166, 255, 0.15); color: var(--ai-related); }
    .track-category-badge.one-off { background: rgba(247, 129, 102, 0.15); color: var(--one-off); }
    .track-category-badge.ongoing { background: rgba(163, 113, 247, 0.15); color: var(--ongoing); }
    .track-category-badge.revenue { background: rgba(240, 193, 75, 0.15); color: var(--revenue); }

    .track-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .track-objective {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .track-item-actions {
      display: flex;
      gap: 4px;
      margin-top: 8px;
      opacity: 0;
      transition: opacity 0.15s;
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: var(--bg-tertiary);
      padding: 2px;
      border-radius: 4px;
    }

    .track-item:hover .track-item-actions {
      opacity: 1;
    }

    .btn-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 12px;
    }

    .btn-icon:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
    
    .icon-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
    }
  `]
})
export class SidebarComponent {
  private roadmapService = inject(RoadmapService);
  lanes = this.roadmapService.lanes;

  @Input() isMiniView = false;

  @Output() addTrack = new EventEmitter<void>();
  @Output() editTrack = new EventEmitter<Lane>();

  addLane() {
    // Handled by Toolbar
  }

  deleteLane(id: string) {
    if (confirm('Are you sure you want to delete this track?')) {
      this.roadmapService.deleteLane(id);
    }
  }

  addItem(laneId: string) {
    this.roadmapService.addItem(laneId, 0);
  }

  getCategoryClass(category: string | undefined): string {
    if (!category) return 'smart-img';
    const map: { [key: string]: string } = {
      'Smart Image': 'smart-img',
      'AI / ML': 'ai-related',
      'One-off': 'one-off',
      'Ongoing': 'ongoing'
    };
    return map[category] || 'smart-img';
  }
}
