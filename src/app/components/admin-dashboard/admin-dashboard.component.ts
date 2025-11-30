import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="admin-container">
      <header class="admin-header">
        <div class="logo">
            <div class="logo-icon admin">A</div>
            <h1>Admin Dashboard</h1>
        </div>
        <button class="btn btn-ghost" (click)="logout()">Logout</button>
      </header>

      <main class="admin-content">
        <div class="card create-user-card">
            <h2>Create New User</h2>
            <p class="subtitle">Create a user and assign them to a project.</p>

            <form (submit)="onCreateUser($event)">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" [(ngModel)]="newUser.username" name="username" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="text" [(ngModel)]="newUser.password" name="password" required>
                </div>
                <div class="form-group">
                    <label>Project ID</label>
                    <input type="text" [(ngModel)]="newUser.projectId" name="projectId" placeholder="e.g. vision-2026" required>
                </div>
                
                <button type="submit" class="btn-primary" [disabled]="!isValid()">
                    <lucide-icon name="plus" [size]="16"></lucide-icon> Create User
                </button>
            </form>

            <div *ngIf="successMessage" class="success-message">
                <lucide-icon name="check" [size]="16"></lucide-icon> {{ successMessage }}
            </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .admin-container {
        min-height: 100vh;
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .admin-header {
        height: 64px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        background: var(--bg-secondary);
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .logo-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 16px;
        color: var(--bg-primary);
    }

    .logo-icon.admin {
        background: linear-gradient(135deg, #f78166, #d2a8ff);
    }

    h1 {
        font-size: 18px;
        font-weight: 600;
    }

    .admin-content {
        padding: 40px;
        max-width: 600px;
        margin: 0 auto;
    }

    .card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 32px;
    }

    h2 {
        margin: 0 0 8px 0;
        font-size: 20px;
    }

    .subtitle {
        color: var(--text-secondary);
        margin-bottom: 24px;
        font-size: 14px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: 8px;
    }

    input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 14px;
        box-sizing: border-box;
    }

    .btn-primary {
        width: 100%;
        padding: 12px;
        border-radius: 6px;
        border: none;
        background: var(--text-primary);
        color: var(--bg-primary);
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-ghost {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 14px;
    }

    .success-message {
        margin-top: 16px;
        padding: 12px;
        background: rgba(63, 185, 80, 0.15);
        color: #3fb950;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
    }
  `]
})
export class AdminDashboardComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    newUser = {
        username: '',
        password: '',
        projectId: ''
    };

    successMessage = '';

    isValid() {
        return this.newUser.username && this.newUser.password && this.newUser.projectId;
    }

    onCreateUser(event: Event) {
        event.preventDefault();
        if (this.isValid()) {
            this.authService.createUser(this.newUser).subscribe({
                next: () => {
                    this.successMessage = `User ${this.newUser.username} created for project ${this.newUser.projectId}`;
                    this.newUser = { username: '', password: '', projectId: '' };
                    setTimeout(() => this.successMessage = '', 3000);
                },
                error: (err) => {
                    alert('Failed to create user: ' + (err.error?.error || 'Unknown error'));
                }
            });
        }
    }

    logout() {
        localStorage.removeItem('admin_token');
        this.router.navigate(['/admin/login']);
    }
}
