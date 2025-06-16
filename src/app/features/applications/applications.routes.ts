import { Routes } from '@angular/router';
import { authenticatedGuard } from '../../core/guards/authenticated.guard';

export const APPLICATIONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/application-list/application-list.component').then(m => m.ApplicationListComponent),
        canActivate: [authenticatedGuard]
    },
]; 