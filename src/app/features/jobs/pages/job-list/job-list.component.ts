import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobService } from '../../../../core/services/job.service';
import { JobI } from '../../../../core/models/job.model';
import { ResultI } from '../../../../core/models/result.model';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DropdownModule } from 'primeng/dropdown';
import { CategoryI } from '../../../../core/models/category.model';
import { HelperService } from '../../../../core/services/helper.service';
import { PaginatorModule } from 'primeng/paginator';
import { PAGE_SIZE } from '../../../../core/consts/page.const';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    InputGroupModule,
    InputGroupAddonModule,
    JobCardComponent,
    DropdownModule,
    ReactiveFormsModule,
    PaginatorModule
  ],
  templateUrl: './job-list.component.html',
  styles: []
})
export class JobListComponent implements OnInit {
  jobs: JobI[] = [];
  loading: boolean = false;
  categories: CategoryI[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  rows: number = PAGE_SIZE;

  formFilters!: FormGroup;
  
  jobService = inject(JobService);
  router = inject(Router);
  fb = inject(FormBuilder);
  helperService = inject(HelperService);

  constructor() {}

  ngOnInit() {
    this.loadJobs();
    this.createFormFilters();
    this.loadCategories();
  }

  private fetchJobs(page: number = 1, filters?: any) {
    this.loading = true;

    this.jobService.searchJobs(page, {...filters, active: true}).subscribe({
      next: (response: ResultI<JobI[]>) => {
        this.jobs = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    });
  }

  loadJobs() {
    this.fetchJobs();
  }

  onSearch() {
    if (this.formFilters.value) {
      this.currentPage = 1; // Reset to first page when searching
      this.fetchJobs(this.currentPage, this.formFilters.value);
    } else {
      this.loadJobs();
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG uses 0-based index
    this.fetchJobs(this.currentPage, this.formFilters.value);
  }

  onViewDetails(job: JobI) {
    this.router.navigate(['/jobs', job.id]);
  }

  clearFilter(field: string) {
    this.formFilters.get(field)?.setValue('');
    this.onSearch();
  }

  createFormFilters(){
    this.formFilters = this.fb.group({
      title: [''],
      location: [''],
      category: ['']
    });
  }

  loadCategories(){
    this.helperService.getCategories().subscribe({
      next: (response: ResultI<CategoryI[]>) => {
        this.categories = response.results;
        this.categories = [{name: 'All', id: '', description: 'All', active: true}, ...this.categories];
      }
    });
  }
} 