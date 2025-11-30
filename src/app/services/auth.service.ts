import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';

export interface User {
    username: string;
    projectId: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);
    private http = inject(HttpClient);

    currentUser = signal<User | null>(this.loadUserFromStorage());

    login(username: string, password?: string) {
        // For MVP, we simulate login by assigning a project ID based on username
        // In production, this would call /api/login
        const projectId = 'project-' + username.toLowerCase().replace(/[^a-z0-9]/g, '');
        const user: User = { username, projectId };

        this.currentUser.set(user);
        localStorage.setItem('roadmap_user', JSON.stringify(user));
        this.router.navigate(['/']);
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem('roadmap_user');
        this.router.navigate(['/login']);
    }

    private loadUserFromStorage(): User | null {
        const stored = localStorage.getItem('roadmap_user');
        return stored ? JSON.parse(stored) : null;
    }

    get projectId(): string | null {
        return this.currentUser()?.projectId || null;
    }
}
