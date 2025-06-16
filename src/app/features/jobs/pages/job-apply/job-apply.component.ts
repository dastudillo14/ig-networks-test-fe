import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JobService } from '../../../../core/services/job.service';
import { REGEX_CONST } from '../../../../core/consts/regex.const';

@Component({
  selector: 'app-job-apply',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FileUploadModule,
    EditorModule,
    ToastModule,
  ],
  templateUrl: './job-apply.component.html',
  styles: [],
  providers: [MessageService],
})
export class JobApplyComponent {
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  jobService = inject(JobService);
  messageService = inject(MessageService);

  formGroup!: FormGroup;
  loading = false;
  jobId!: string;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link'], // No incluyas 'image'
    ],
  };
  experienceOptions = [
    { label: 'Menos de 1 año', value: '0-1' },
    { label: '1-3 años', value: '1-3' },
    { label: '3-5 años', value: '3-5' },
    { label: '5-10 años', value: '5-10' },
    { label: 'Más de 10 años', value: '10+' },
  ];

  constructor() {
    this.jobId = this.route.snapshot.params['id'];
    if (localStorage.getItem('redirectUrl')) {
      localStorage.removeItem('redirectUrl');
    }
    this.jobId = this.route.snapshot.params['id'];
    this.jobService.getJobById(+this.jobId).subscribe({
      next: (job) => {
        this.loading = false;
      },
      error: (error) => {
        this.router.navigate(['/jobs']);
        this.loading = false;
      },
    });
    this.createForm();
  }

  goBack() {
    this.router.navigate(['/jobs', this.jobId]);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      resume_link: ['', [Validators.required, Validators.pattern(REGEX_CONST.LINK_REGEX)]],
      experience_years: ['',[Validators.required]],
      experience_detail: ['',[Validators.required]],
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.jobService.applyToJob( {...this.formGroup.value, jobpost: +this.jobId}).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Application submitted successfully',
        });
        setTimeout(() => {
          this.router.navigate(['/jobs']);
        }, 1500);
        
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error ?? 'Error submitting application',
          life: 3000,
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
