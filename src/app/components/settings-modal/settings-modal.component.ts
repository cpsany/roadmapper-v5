import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapSettings } from '../../models/roadmap.model';
import { RoadmapService } from '../../services/roadmap.service';

@Component({
    selector: 'app-settings-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent {
    @Input({ required: true }) settings!: RoadmapSettings;
    @Output() close = new EventEmitter<void>();

    private roadmapService = inject(RoadmapService);

    // Local copy for editing
    editingSettings: RoadmapSettings = { ...this.settings };

    ngOnChanges() {
        if (this.settings) {
            this.editingSettings = { ...this.settings };
        }
    }

    save() {
        this.roadmapService.updateSettings(this.editingSettings);
        this.close.emit();
    }
}
