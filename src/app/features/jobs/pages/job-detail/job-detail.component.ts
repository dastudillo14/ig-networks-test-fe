import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { JobI } from '../../../../core/models/job.model';
import { JobService } from '../../../../core/services/job.service';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { UserService } from '../../../../core/services/user.service';
import { NotFoundComponent } from '../../../../shared/components/not-found/not-found.component';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ProgressSpinnerModule,
    TimeAgoPipe,
    NotFoundComponent,
    SafeHtmlPipe
  ],
  templateUrl: './job-detail.component.html',
  styles: []
})
export class JobDetailComponent implements OnInit {
  job!: JobI;
  loading: boolean = false;

  jobNotFound: boolean = false;
  
  jobService = inject(JobService);
  router = inject(Router);
  userService = inject(UserService);
  
  constructor(private route: ActivatedRoute) {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.jobService.getJobById(params['id']).subscribe({
        next: (job) => {
          this.job = job;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading job:', error);
          this.jobNotFound = true;
          this.loading = false;
        }
      });
    }); 
  }

  goBack() {
    this.router.navigate(['/jobs']);
  }

  applyJob() {    
    if (this.userService.isAuthenticated() && this.userService.isApplicant()) {
      this.router.navigate([`/jobs/${this.job.id}/apply`]);
    } else {
      // Save the current URL to redirect after login
      localStorage.setItem('redirectUrl', `/jobs/${this.job.id}/apply`);
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }
} 