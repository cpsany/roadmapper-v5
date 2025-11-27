import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ResourceRole } from '../../models/roadmap.model';

@Component({
    selector: 'app-resource-toolbar',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="toolbar">
      <div class="toolbar-title">Roles</div>
      <div class="role-list">
        <div *ngFor="let role of roles" 
             class="role-item" 
             draggable="true" 
             (dragstart)="onDragStart($event, role)">
          <div class="role-avatar">{{ role.charAt(0) }}</div>
          <span class="role-name">{{ role }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .toolbar {
      width: 80px;
      background: var(--bg-panel);
      border-left: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px 0;
      align-items: center;
    }

    .toolbar-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 16px;
      text-transform: uppercase;
    }

    .role-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      align-items: center;
    }

    .role-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: grab;
      padding: 8px;
      border-radius: 8px;
      transition: background 0.2s;
      width: 64px;
      
      &:hover {
        background: var(--bg-card);
      }
      
      &:active {
        cursor: grabbing;
      }
    }

    .role-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 12px;
    }
    
    .role-name {
      font-size: 10px;
      color: var(--text-secondary);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceToolbarComponent {
    roles: ResourceRole[] = ['FE', 'BE', 'ML', 'DevOps', 'QA', 'Design', 'Product'];

    onDragStart(event: DragEvent, role: ResourceRole) {
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', role);
            event.dataTransfer.effectAllowed = 'copy';
        }
    }
}
