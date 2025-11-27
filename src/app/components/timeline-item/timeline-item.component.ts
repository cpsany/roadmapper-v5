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
             isContinuation ? 'continuation' : ''
           ]"
           [attr.data-title]="item.title"
           [attr.data-desc]="item.description">
        {{ item.title }}
        <lucide-icon *ngIf="item.isHighValue" name="star" [size]="12" class="star-icon"></lucide-icon>
        <lucide-icon *ngIf="item.isRevenueMaker" name="dollar-sign" [size]="12" class="star-icon"></lucide-icon>
      </div>
      
      <div class="resource-row">
        <!-- Show resources only on the start segment or if it's a long item? 
             Mock shows resources on all segments, but sometimes 0F/0B.
             Let's just show them all for now or mock the logic. -->
        <span *ngIf="hasResource('FE')" class="resource-badge fe">1F</span>
        <span *ngIf="hasResource('BE')" class="resource-badge be">1B</span>
        <span *ngIf="hasResource('ML')" class="resource-badge ml">1M</span>
        <span *ngIf="hasResource('UX')" class="resource-badge ux">1U</span>
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

  constructor() {
    // Register icons
    // In newer lucide-angular, we might need to use the module pick in imports
    // or provide icons.
    // Let's try the imports approach in the decorator.
  }

  // Mock resource check
  hasResource(type: string): boolean {
    if (this.categoryId === 'smart-img') return ['FE', 'BE'].includes(type);
    if (this.categoryId === 'ai-related') return ['ML'].includes(type);
    if (this.categoryId === 'one-off') return ['FE'].includes(type);
    if (this.categoryId === 'one-off') return ['FE'].includes(type);
    return false;
  }
}
