import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Map, Search, Plus, Minus, Settings } from 'lucide-angular';
import { RoadmapService } from '../../services/roadmap.service';

@Component({
    selector: 'app-toolbar',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
    @Output() addTrack = new EventEmitter<void>();

    onAddTrackClick() {
        console.log('Toolbar: Add Track clicked');
        this.addTrack.emit();
    }

    zoomLevel = 100;

    onSearch(event: any) {
        console.log('Search:', event.target.value);
    }

    zoomIn() {
        this.zoomLevel = Math.min(200, this.zoomLevel + 10);
    }

    zoomOut() {
        this.zoomLevel = Math.max(50, this.zoomLevel - 10);
    }

    toggleTheme() {
        console.log('Toggle Theme');
    }
}
