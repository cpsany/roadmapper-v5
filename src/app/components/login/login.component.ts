import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">
          <div class="logo-icon">RM</div>
          <h1>Roadmap Maker</h1>
        </div>
        <p class="subtitle">Enter your username to access your roadmap</p>
        
        <form (submit)="onSubmit($event)">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username" 
              placeholder="e.g. sandeep"
              required
              autofocus>
          </div>
          
          <button type="submit" class="btn-primary" [disabled]="!username">
            Continue
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
      background: linear-gradient(135deg, var(--ai-related), var(--smart-img));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      color: var(--bg-primary);
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
      background: var(--ai-related);
      color: var(--bg-primary);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #79b8ff;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
    private authService = inject(AuthService);
    username = '';

    onSubmit(event: Event) {
        event.preventDefault();
        if (this.username.trim()) {
            this.authService.login(this.username.trim());
        }
    }
}
