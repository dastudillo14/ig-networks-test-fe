import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { JOBS_ROUTES } from './features/jobs/jobs.routes';
import { APPLICATIONS_ROUTES } from './features/applications/applications.routes';
import { MainLayoutComponent } from './shared/layout/main-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        children: AUTH_ROUTES
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'jobs',
                children: JOBS_ROUTES
            },
            {
                path: 'applications',
                children: APPLICATIONS_ROUTES
            },
            {
                path: '',
                redirectTo: 'jobs',
                pathMatch: 'full'
            }
        ]
    }
];
