import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapService } from '../../services/roadmap.service';
import { Resource, ResourceRole } from '../../models/roadmap.model';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-resource-panel',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Manage Resources</h2>
          <button class="close-btn" (click)="close()">
            <lucide-icon name="x" [size]="20"></lucide-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="resource-list">
            <div *ngFor="let res of resources()" class="resource-item">
              <div class="res-avatar">{{ res.name.charAt(0) }}</div>
              <div class="res-info">
                <div class="res-name">{{ res.name }}</div>
                <div class="res-role">{{ res.role }}</div>
              </div>
              <div class="res-rate">\${{ res.hourlyRate }}/hr</div>
              <button class="icon-btn delete" (click)="deleteResource(res.id)">
                <lucide-icon name="trash-2" [size]="16"></lucide-icon>
              </button>
            </div>
          </div>

          <div class="add-form">
            <h3>Add New Resource</h3>
            <div class="form-group">
              <input type="text" placeholder="Name" [(ngModel)]="newName">
              <select [(ngModel)]="newRole">
                <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
              </select>
              <input type="number" placeholder="Rate/hr" [(ngModel)]="newRate">
              <button class="add-btn" (click)="addResource()" [disabled]="!newName || !newRate">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: var(--bg-panel);
      width: 500px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      overflow: hidden;
    }

    .modal-header {
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      &:hover { color: var(--text-primary); background: rgba(255,255,255,0.1); }
    }

    .modal-body {
      padding: 24px;
    }

    .resource-list {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 24px;
    }

    .resource-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: var(--bg-card);
      border-radius: 8px;
      margin-bottom: 8px;
      border: 1px solid var(--border-color);
    }

    .res-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-right: 12px;
    }

    .res-info {
      flex: 1;
    }

    .res-name { font-weight: 500; }
    .res-role { font-size: 12px; color: var(--text-secondary); }
    .res-rate { font-family: monospace; color: var(--accent-success); margin-right: 16px; }

    .icon-btn.delete {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      &:hover { color: var(--accent-danger); }
    }

    .add-form {
      background: var(--bg-dark);
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--border-color);

      h3 { margin: 0 0 12px 0; font-size: 14px; color: var(--text-secondary); }
    }

    .form-group {
      display: flex;
      gap: 8px;

      input, select {
        background: var(--bg-panel);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: 8px;
        border-radius: 4px;
        outline: none;
        &:focus { border-color: var(--accent-primary); }
      }

      input[type="text"] { flex: 2; }
      select { flex: 1; }
      input[type="number"] { flex: 1; }

      .add-btn {
        background: var(--accent-primary);
        color: white;
        border: none;
        padding: 0 16px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        &:disabled { opacity: 0.5; cursor: not-allowed; }
        &:hover:not(:disabled) { filter: brightness(1.1); }
      }
    }
  `]
})
export class ResourcePanelComponent {
    private roadmapService = inject(RoadmapService);
    resources = this.roadmapService.resources;

    roles: ResourceRole[] = ['FE', 'BE', 'ML', 'DevOps', 'QA', 'Design', 'Product'];

    newName = '';
    newRole: ResourceRole = 'FE';
    newRate: number | null = null;

    @Output() closeModal = new EventEmitter<void>();

    close() {
        this.closeModal.emit();
    }

    // We need Output for close
    // But I can't add it easily without importing Output/EventEmitter.
    // I'll add imports.

    addResource() {
        if (this.newName && this.newRate) {
            this.roadmapService.addResource({
                role: this.newRole,
                name: this.newName,
                hourlyRate: this.newRate
            });
            this.newName = '';
            this.newRate = null;
        }
    }

    deleteResource(id: string) {
        // Implement delete in service
        this.roadmapService.deleteResource(id);
    }
}

// I need to add Output/EventEmitter to imports and class.
// I'll do it in a separate replace call or rewrite the file correctly now.
// I'll rewrite the file correctly now.
