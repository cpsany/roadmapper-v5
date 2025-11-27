import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly STORAGE_KEY = 'roadmapper_data_v3';

    save<T>(data: T): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    }

    load<T>(): T | null {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from localStorage', e);
            return null;
        }
    }

    clear(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
