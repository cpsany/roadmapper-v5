import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-track-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-track-modal.component.html',
    styleUrls: ['./add-track-modal.component.css']
})
export class AddTrackModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<{ name: string; category: string; categoryId: string; description: string }>();

    name = '';
    description = '';
    selectedCategoryId = 'smart-img';

    categories = [
        { id: 'smart-img', name: 'Smart Image', class: 'smart-img' },
        { id: 'ai-related', name: 'AI / ML', class: 'ai-related' },
        { id: 'one-off', name: 'One-off', class: 'one-off' },
        { id: 'ongoing', name: 'Ongoing', class: 'ongoing' }
    ];

    selectCategory(categoryId: string) {
        this.selectedCategoryId = categoryId;
    }

    onSave() {
        if (this.name.trim()) {
            const selectedCat = this.categories.find(c => c.id === this.selectedCategoryId);
            this.save.emit({
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
    }
}
