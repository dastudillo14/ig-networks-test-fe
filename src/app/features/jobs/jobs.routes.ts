import { Routes } from '@angular/router';
import { applicantGuard } from '../../core/guards/applicant.guard';
import { adminGuard } from '../../core/guards/admin.guard';

export const JOBS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/job-list/job-list.component').then(m => m.JobListComponent)
    },
    {
        path: 'create',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/job-form/job-form.component').then(m => m.JobFormComponent)
    },
    {
        path: 'edit/:id',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/job-form/job-form.component').then(m => m.JobFormComponent)
    },
    {
        path: ':id/apply',
        canActivate: [applicantGuard],
        loadComponent: () => import('./pages/job-apply/job-apply.component').then(m => m.JobApplyComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/job-list-admin/job-list-admin.component').then(m => m.JobListAdminComponent),
        canActivate: [adminGuard]
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/job-detail/job-detail.component').then(m => m.JobDetailComponent)
    },
]; 