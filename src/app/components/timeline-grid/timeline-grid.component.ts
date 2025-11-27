import { Component, computed, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../../services/roadmap.service';
import { TimelineItemComponent } from '../timeline-item/timeline-item.component';
import { TimelineItem, Lane, Roadmap } from '../../models/roadmap.model';
import { parseISO, isWithinInterval, areIntervalsOverlapping } from 'date-fns';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-timeline-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, TimelineItemComponent, LucideAngularModule],
  templateUrl: './timeline-grid.component.html',
  styleUrls: ['./timeline-grid.component.css']
})
export class TimelineGridComponent {
  @Input({ required: true }) roadmap!: Roadmap;
  @Output() taskClick = new EventEmitter<{ item: TimelineItem, laneId: string }>();

  private roadmapService = inject(RoadmapService);

  lanes = this.roadmapService.lanes;
  sprints = this.roadmapService.sprints;

  gridTemplateColumns = computed(() => {
    const sprintCount = this.sprints().length;
    return `repeat(${sprintCount}, var(--sprint-width))`;
  });

  formatDate(iso: string): string {
    const d = parseISO(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  }

  formatCategory(cat?: string): string {
    if (!cat) return '';
    return cat.replace('-', ' ');
  }

  getItemsForSprint(lane: Lane, sprint: any): TimelineItem[] {
    return lane.items.filter(item => {
      if (!item.startDate || !item.endDate) return false;
      const itemStart = parseISO(item.startDate);
      const itemEnd = parseISO(item.endDate);
      const sprintStart = parseISO(sprint.start);
      const sprintEnd = parseISO(sprint.end);

      return areIntervalsOverlapping(
        { start: itemStart, end: itemEnd },
        { start: sprintStart, end: sprintEnd }
      );
    });
  }

  isItemStart(item: TimelineItem, sprint: any): boolean {
    if (!item.startDate) return false;
    const itemStart = parseISO(item.startDate);
    const sprintStart = parseISO(sprint.start);
    const sprintEnd = parseISO(sprint.end);
    return isWithinInterval(itemStart, { start: sprintStart, end: sprintEnd });
  }

  isItemEnd(item: TimelineItem, sprint: any): boolean {
    if (!item.endDate) return false;
    const itemEnd = parseISO(item.endDate);
    const sprintStart = parseISO(sprint.start);
    const sprintEnd = parseISO(sprint.end);
    return isWithinInterval(itemEnd, { start: sprintStart, end: sprintEnd });
  }

  // Editing State
  editingLaneId: string | null = null;
  tempLaneTitle = '';
  hoveredCell: { laneId: string, sprintNumber: number } | null = null;

  @Output() addTrack = new EventEmitter<void>();

  addLane() {
    this.addTrack.emit();
  }

  deleteLane(laneId: string) {
    if (confirm('Are you sure you want to delete this track?')) {
      this.roadmapService.deleteLane(laneId);
    }
  }

  moveLane(laneId: string, direction: number) {
    // TODO: Implement move logic in service
    // For now, we can just log or implement a simple swap in service
    console.log('Move lane', laneId, direction);
    this.roadmapService.moveLane(laneId, direction);
  }

  startEditingLane(lane: Lane) {
    this.editingLaneId = lane.id;
    this.tempLaneTitle = lane.name;
  }

  saveLaneTitle(lane: Lane) {
    if (this.editingLaneId === lane.id && this.tempLaneTitle.trim()) {
      this.roadmapService.updateLane(lane.id, { name: this.tempLaneTitle });
      this.editingLaneId = null;
    } else {
      this.editingLaneId = null;
    }
  }

  // Task Management
  addTask(laneId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    console.log('Adding task to lane:', laneId);

    const lane = this.lanes().find(l => l.id === laneId);
    const categoryId = lane?.categoryId || 'smart-img';
    const type = this.mapCategoryToType(categoryId);

    // Default to first sprint start if available, otherwise now
    const firstSprint = this.sprints()[0];
    const startDateObj = firstSprint ? parseISO(firstSprint.start) : new Date();
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + 1);

    this.roadmapService.addItemToLane(laneId, {
      title: 'New Task',
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString(),
      resourceIds: [],
      dependencyIds: [],
      operationalCost: 0,
      type: type
    });
  }

  addTaskToSprint(laneId: string, sprint: any, event: Event) {
    event.stopPropagation();
    console.log('Adding task to sprint:', sprint.number, 'lane:', laneId);

    const lane = this.lanes().find(l => l.id === laneId);
    const categoryId = lane?.categoryId || 'smart-img';
    const type = this.mapCategoryToType(categoryId);

    const startDateObj = parseISO(sprint.start);
    const endDateObj = parseISO(sprint.end);

    this.roadmapService.addItemToLane(laneId, {
      title: 'New Task',
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString(),
      resourceIds: [],
      dependencyIds: [],
      operationalCost: 0,
      type: type
    });
  }

  private mapCategoryToType(categoryId: string): 'smart-img' | 'ai-related' | 'one-off' | 'ongoing' | 'revenue' {
    const map: { [key: string]: string } = {
      'Smart Image': 'smart-img',
      'AI / ML': 'ai-related',
      'One-off': 'one-off',
      'Ongoing': 'ongoing',
      'Revenue': 'revenue'
    };
    // If categoryId is already the code (e.g. 'smart-img'), use it. If it's the name ('Smart Image'), map it.
    return (map[categoryId] || categoryId || 'smart-img') as any;
  }

  // Basic Drag Support (Updates whole item)
  onItemMouseDown(event: MouseEvent, item: TimelineItem, laneId: string) {
    // For MVP, we'll just log or allow simple prompt-based move if needed, 
    // or implement full drag later. The cell-based drag is complex.
    // Let's disable drag for this step to ensure rendering is perfect first.
    console.log('Clicked item:', item.title);
  }
}
