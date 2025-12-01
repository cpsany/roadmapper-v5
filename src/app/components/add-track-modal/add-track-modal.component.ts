import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lane } from '../../models/roadmap.model';

@Component({
    selector: 'app-add-track-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-track-modal.component.html',
    styleUrls: ['./add-track-modal.component.css']
})
export class AddTrackModalComponent implements OnInit {
    @Input() track: Lane | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<{ id?: string; name: string; category: string; categoryId: string; description: string }>();

    name = '';
    description = '';
    selectedCategoryId = 'smart-img';
    isEditMode = false;

    categories = [
        { id: 'smart-img', name: 'Smart Image', class: 'smart-img' },
        { id: 'ai-related', name: 'AI / ML', class: 'ai-related' },
        { id: 'one-off', name: 'One-off', class: 'one-off' },
        { id: 'ongoing', name: 'Ongoing', class: 'ongoing' }
    ];

    ngOnInit() {
        if (this.track) {
            this.isEditMode = true;
            this.name = this.track.name;
            this.description = this.track.description || '';
            this.selectedCategoryId = this.track.categoryId || 'smart-img';
        }
    }

    selectCategory(categoryId: string) {
        this.selectedCategoryId = categoryId;
    }

    onSave() {
        if (this.name.trim()) {
            const selectedCat = this.categories.find(c => c.id === this.selectedCategoryId);
            this.save.emit({
                id: this.track?.id,
                name: this.name,
                category: selectedCat ? selectedCat.name : 'Smart Image',
                categoryId: this.selectedCategoryId,
                description: this.description
            });
            this.reset();
        }
    }

    onCancel() {
        this.close.emit();
        this.reset();
    }

    reset() {
        this.name = '';
        this.description = '';
        this.selectedCategoryId = 'smart-img';
        this.isEditMode = false;
    }
}
