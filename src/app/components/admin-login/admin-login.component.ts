import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">
          <div class="logo-icon admin">A</div>
          <h1>Admin Portal</h1>
        </div>
        <p class="subtitle">Log in to manage users and projects</p>
        
        <form (submit)="onSubmit($event)">
          <div class="form-group">
            <label for="username">Admin Username</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username" 
              required
              autofocus>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              required>
          </div>
          
          <button type="submit" class="btn-primary" [disabled]="!username || !password">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .login-card {
      background: var(--bg-secondary);
      padding: 40px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      width: 100%;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      color: var(--bg-primary);
    }

    .logo-icon.admin {
        background: linear-gradient(135deg, #f78166, #d2a8ff);
    }

    h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }

    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 32px;
      font-size: 14px;
    }

    .form-group {
      text-align: left;
      margin-bottom: 24px;
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

    input:focus {
      outline: none;
      border-color: var(--ai-related);
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
      transition: opacity 0.2s;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class AdminLoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    username = '';
    password = '';

    onSubmit(event: Event) {
        event.preventDefault();
        if (this.username && this.password) {
            this.authService.adminLogin(this.username, this.password).subscribe({
                next: (res) => {
                    if (res.success) {
                        // Store admin token (mock)
                        localStorage.setItem('admin_token', res.token);
                        this.router.navigate(['/admin']);
                    }
                },
                error: (err) => {
                    alert('Admin Login Failed: ' + (err.error?.error || 'Unknown error'));
                }
            });
        }
    }
}
