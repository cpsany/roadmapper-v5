import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimelineItem, Resource } from '../../models/roadmap.model';
import { RoadmapService } from '../../services/roadmap.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-task-detail-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './task-detail-panel.component.html',
    styleUrls: ['./task-detail-panel.component.css']
})
export class TaskDetailPanelComponent {
    @Input({ required: true }) item!: TimelineItem;
    @Input({ required: true }) laneId!: string;
    @Output() close = new EventEmitter<void>();

    private roadmapService = inject(RoadmapService);
    resources = this.roadmapService.resources;

    // Local state for editing
    editingItem = signal<TimelineItem | null>(null);

    sprints = this.roadmapService.sprints;

    // Computed for UI
    startSprintNumber = signal<number | null>(null);
    endSprintNumber = signal<number | null>(null);

    // Resource Allocation Grid Helper
    // Returns array of sprint numbers in range
    get sprintRange(): number[] {
        const start = this.startSprintNumber();
        const end = this.endSprintNumber();
        if (!start || !end) return [];

        const range: number[] = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    }

    ngOnChanges() {
        if (this.item) {
            this.editingItem.set({ ...this.item });
            this.initializeSprintRange();
            this.initializeAllocation();
        }
    }

    initializeSprintRange() {
        const item = this.editingItem();
        if (!item) return;

        const startDate = item.startDate ? new Date(item.startDate) : new Date();
        const endDate = item.endDate ? new Date(item.endDate) : new Date();

        // Find matching sprints
        const startSprint = this.sprints().find(s => new Date(s.start) <= startDate && new Date(s.end) >= startDate);
        const endSprint = this.sprints().find(s => new Date(s.start) <= endDate && new Date(s.end) >= endDate);

        if (startSprint) this.startSprintNumber.set(startSprint.number);
        if (endSprint) this.endSprintNumber.set(endSprint.number);
    }

    initializeAllocation() {
        const item = this.editingItem();
        if (!item) return;

        // Ensure allocation object exists
        if (!item.resourceAllocation) {
            item.resourceAllocation = {};
        }
    }

    onSprintChange() {
        const startNum = this.startSprintNumber();
        const endNum = this.endSprintNumber();

        if (startNum && endNum && startNum <= endNum) {
            const startSprint = this.sprints().find(s => s.number === startNum);
            const endSprint = this.sprints().find(s => s.number === endNum);

            if (startSprint && endSprint) {
                const current = this.editingItem();
                if (current) {
                    this.editingItem.set({
                        ...current,
                        startDate: startSprint.start,
                        endDate: endSprint.end
                    });
                }
            }
        }
    }

    // Fixed Roles for Allocation
    roles = [
        { id: 'frontend', name: 'Frontend', badge: 'F', class: 'frontend' },
        { id: 'backend', name: 'Backend', badge: 'B', class: 'backend' },
        { id: 'ml', name: 'ML', badge: 'M', class: 'ml' },
        { id: 'ux', name: 'UX/UI', badge: 'U', class: 'ux' }
    ];

    getAllocation(sprintNum: number, roleId: string): number {
        const item = this.editingItem();
        return item?.resourceAllocation?.[sprintNum]?.[roleId] || 0;
    }

    updateAllocation(sprintNum: number, roleId: string, value: number) {
        const item = this.editingItem();
        if (!item) return;

        const newAllocation = { ...item.resourceAllocation };
        if (!newAllocation[sprintNum]) newAllocation[sprintNum] = {};

        newAllocation[sprintNum][roleId] = value;

        this.editingItem.set({
            ...item,
            resourceAllocation: newAllocation
        });
    }

    incrementAllocation(sprintNum: number, roleId: string) {
        const currentVal = this.getAllocation(sprintNum, roleId);
        // Increment logic: 0 -> 1 -> 2 ...
        // If it's a decimal (manual entry), round up to next integer? Or just add 1?
        // Let's just add 1 for simplicity as requested "keep increment the value".
        const newVal = Math.floor(currentVal) + 1;
        this.updateAllocation(sprintNum, roleId, newVal);
    }
    save() {
        if (this.editingItem()) {
            this.roadmapService.updateItem(this.laneId, this.item.id, this.editingItem()!);
            this.close.emit();
        }
    }

    // Delete confirmation state
    showDeleteConfirm = signal(false);

    delete() {
        this.showDeleteConfirm.set(true);
    }

    confirmDelete() {
        console.log('User confirmed delete (custom modal)');
        this.roadmapService.deleteItem(this.laneId, this.item.id);
        this.close.emit();
    }

    cancelDelete() {
        this.showDeleteConfirm.set(false);
    }

    toggleResource(resourceId: string) {
        const current = this.editingItem();
        if (!current) return;

        const hasResource = current.resourceIds.includes(resourceId);
        let newResourceIds;

        if (hasResource) {
            newResourceIds = current.resourceIds.filter(id => id !== resourceId);
        } else {
            newResourceIds = [...current.resourceIds, resourceId];
        }

        this.editingItem.set({ ...current, resourceIds: newResourceIds });
    }

    hasResource(resourceId: string): boolean {
        // Keep existing logic for now, or maybe derive from allocation?
        // For now, let's keep the chip selection as "Active Resources" which then show up in the grid
        return this.editingItem()?.resourceIds.includes(resourceId) || false;
    }
}
