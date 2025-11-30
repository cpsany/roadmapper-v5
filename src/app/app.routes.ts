import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoadmapComponent } from './components/roadmap/roadmap.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.currentUser()) {
        return true;
    }

    return router.parseUrl('/login');
};

const adminGuard = () => {
    const router = inject(Router);
    const token = localStorage.getItem('admin_token');
    if (token) return true;
    return router.parseUrl('/admin/login');
};

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin/login',
        component: AdminLoginComponent
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
    },
    {
        path: '',
        component: RoadmapComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
