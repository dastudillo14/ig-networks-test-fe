import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JobService } from '../../../../core/services/job.service';
import { HelperService } from '../../../../core/services/helper.service';
import { CategoryI } from '../../../../core/models/category.model';
import { RequestJobI } from '../../../../core/models/job.model';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    EditorModule ,    
    DropdownModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css'
})
export class JobFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private helperService = inject(HelperService);
  private messageService = inject(MessageService);

  jobForm!: FormGroup;
  categories: CategoryI[] = [];
  isEditMode = false;
  jobId: number | null = null;
  loading = false;

  ngOnInit() {
    this.initForm();
    this.loadCategories();
    this.checkEditMode();
  }

  private initForm() {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', [Validators.required]],      
      category: [null, [Validators.required]],
      
      
    });
  }

  private loadCategories() {
    this.helperService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.results;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading categories'
        });
      }
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJobData();
    }
  }

  private loadJobData() {
    if (this.jobId) {
      this.loading = true;
      this.jobService.getJobById(this.jobId).subscribe({
        next: (job) => {
          this.jobForm.patchValue({
            title: job.title,
            description: job.description,
            location: job.location,
            
            category: job.category.id,
            
            active: job.active
          });
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading job data'
          });
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.loading = true;
      const jobData: RequestJobI = this.jobForm.value;

      const request = this.isEditMode && this.jobId
        ? this.jobService.updateJob(this.jobId, jobData)
        : this.jobService.createJob(jobData);

      request.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Job ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.router.navigate(['/jobs/admin']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error ${this.isEditMode ? 'updating' : 'creating'} job`
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.jobForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/jobs/admin']);
  }
}
