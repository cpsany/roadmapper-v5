import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Map, Search, Plus, Minus, Settings, Minimize2, Maximize2, Eye } from 'lucide-angular';
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

    @Output() toggleMiniView = new EventEmitter<boolean>();
    isMiniView = false;

    onSearch(event: any) {
        console.log('Search:', event.target.value);
    }

    toggleView() {
        this.isMiniView = !this.isMiniView;
        this.toggleMiniView.emit(this.isMiniView);
    }

    toggleTheme() {
        console.log('Toggle Theme');
    }
}
