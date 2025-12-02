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

    login(username: string, password?: string, projectId?: string) {
        if (!password || !projectId) {
            console.error('Missing password or projectId');
            return;
        }

        this.http.post<{ success: boolean, user: User }>('/api/login', { username, password, projectId })
            .pipe(
                tap(response => {
                    if (response.success) {
                        this.currentUser.set(response.user);
                        localStorage.setItem('roadmap_user', JSON.stringify(response.user));
                        this.router.navigate(['/']);
                    }
                }),
                catchError(error => {
                    console.error('Login failed', error);

                    // FALLBACK FOR LOCAL DEV (when API is not running)
                    if (error.status === 404) {
                        console.warn('API not found (404), using local mock login');
                        const mockUser: User = { username, projectId };
                        this.currentUser.set(mockUser);
                        localStorage.setItem('roadmap_user', JSON.stringify(mockUser));
                        this.router.navigate(['/']);
                        return of({ success: true, user: mockUser });
                    }

                    alert('Login failed: ' + (error.error?.error || 'Unknown error'));
                    return of(null);
                })
            ).subscribe();
    }

    adminLogin(username: string, password?: string) {
        return this.http.post<{ success: boolean, token: string }>('/api/admin/login', { username, password });
    }

    createUser(user: { username: string, password?: string, projectId: string }) {
        return this.http.post('/api/admin/create-user', user);
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
