import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItem, LaneCategory } from '../../models/roadmap.model';
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
  selector: 'app-timeline-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [],
  template: `
    <div class="task-cell">
      <div class="task-bar" 
           [ngClass]="[
             categoryId || '', 
             item.isHighValue ? 'high-value' : '',
             isContinuation ? 'continuation' : '',
             continuesLeft ? 'continues-left' : '',
             continuesRight ? 'continues-right' : ''
           ]"
           [attr.data-title]="item.title"
           [attr.data-desc]="item.description">
        {{ item.title }}
        <lucide-icon *ngIf="item.isHighValue" name="star" [size]="12" class="star-icon"></lucide-icon>
        <lucide-icon *ngIf="item.isRevenueMaker" name="dollar-sign" [size]="12" class="star-icon"></lucide-icon>
      </div>
      
      <div class="resource-row">
        <span *ngIf="hasAllocation('frontend')" class="resource-badge fe">{{ getAllocation('frontend') }}F</span>
        <span *ngIf="hasAllocation('backend')" class="resource-badge be">{{ getAllocation('backend') }}B</span>
        <span *ngIf="hasAllocation('ml')" class="resource-badge ml">{{ getAllocation('ml') }}M</span>
        <span *ngIf="hasAllocation('ux')" class="resource-badge ux">{{ getAllocation('ux') }}U</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      padding: 4px 0;
    }

    .task-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      align-items: center;
    }

    .task-bar {
      width: calc(100% - 8px);
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      line-height: 1.3;
      min-height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border: 1px solid transparent;
    }

    .task-bar:hover {
      transform: scale(1.03);
      z-index: 20;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    /* Category Styles */
    .task-bar.smart-img { background: var(--smart-img-bg); border-color: var(--smart-img); color: var(--smart-img); }
    .task-bar.ai-related { background: var(--ai-related-bg); border-color: var(--ai-related); color: var(--ai-related); }
    .task-bar.one-off { background: var(--one-off-bg); border-color: var(--one-off); color: var(--one-off); }
    .task-bar.ongoing { background: var(--ongoing-bg); border-color: var(--ongoing); color: var(--ongoing); }
    .task-bar.revenue { background: var(--revenue-bg); border-color: var(--revenue); color: var(--revenue); }

    .task-bar.continuation {
      border-style: dashed;
      border-width: 1px;
    }

    .task-bar.continues-left::before {
      content: '';
      position: absolute;
      left: -12px; /* Extend to cover gap */
      top: 50%;
      width: 12px;
      border-top: 2px dotted;
      border-top-color: inherit; /* Match category color */
      transform: translateY(-50%);
      z-index: 5;
    }

    .task-bar.continues-right::after {
      content: '';
      position: absolute;
      right: -12px; /* Extend to cover gap */
      top: 50%;
      width: 12px;
      border-top: 2px dotted;
      border-top-color: inherit; /* Match category color */
      transform: translateY(-50%);
      z-index: 5;
    }

    .task-bar.high-value::after {
      /* content: ' ★'; Removed to avoid double star with icon */
    }

    .star-icon {
      margin-left: 4px;
      width: 10px;
      height: 10px;
    }

    .resource-row {
      display: flex;
      gap: 3px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .resource-badge {
      width: 22px;
      height: 18px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
    }

    .resource-badge.fe { background: rgba(88, 166, 255, 0.2); color: var(--fe-color); }
    .resource-badge.be { background: rgba(63, 185, 80, 0.2); color: var(--be-color); }
    .resource-badge.ml { background: rgba(247, 129, 102, 0.2); color: var(--ml-color); }
    .resource-badge.ux { background: rgba(163, 113, 247, 0.2); color: var(--ux-color); }
  `]
})
export class TimelineItemComponent {
  @Input({ required: true }) item!: TimelineItem;
  @Input() categoryId?: string;
  @Input() isStart = false;
  @Input() isEnd = false;
  @Input() isContinuation = false;
  @Input() continuesLeft = false;
  @Input() sprintNumber?: number;

  getAllocation(roleId: string): number {
    if (!this.sprintNumber || !this.item.resourceAllocation) return 0;
    return this.item.resourceAllocation[this.sprintNumber]?.[roleId] || 0;
  }

  hasAllocation(roleId: string): boolean {
    return this.getAllocation(roleId) > 0;
  }
}
