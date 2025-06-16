import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { JobService } from '../../../../core/services/job.service';
import { JobI } from '../../../../core/models/job.model';
import { ResultI } from '../../../../core/models/result.model';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PAGE_SIZE } from '../../../../core/consts/page.const';
import { HelperService } from '../../../../core/services/helper.service';
import { CategoryI } from '../../../../core/models/category.model';
import { ActionI, ColumnI } from '../../../../core/models/column.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-job-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './job-list-admin.component.html',
  styleUrl: './job-list-admin.component.css'
})
export class JobListAdminComponent implements OnInit {
  jobs: JobI[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  currentPage: number = 1;
  rows: number = PAGE_SIZE;
  categories: CategoryI[] = [];
  filters: any = {};
  
  actions: ActionI[] = [
    {
      name: 'Edit',
      icon: 'pi pi-pencil',
      class:'info'
    },
    {
      name: 'Delete',
      icon: 'pi pi-trash',
      class:'danger'
    }
  ];

  columns: ColumnI[] = [
    {
      name: 'title',
      header: 'Job Title',
      filter: { type: 'text' }
    },
    {
      name: 'location',
      header: 'Location',
      filter: { type: 'text' }
    },
    {
      name: 'created_by.username',
      header: 'Created By',
      filter: { type: 'text' }
    },
    {
      name: 'active',
      header: 'Status', 
      pipe: 'boolean',
      filter: { type: 'select', value: '', name:'active', data: [{name: 'Active', value: true}, {name: 'Inactive', value: false}] }
    },
    {
      name: 'created_at',
      header: 'Created Date',
      pipe: 'date',
      filter: { type: 'date' }
    }
  ];

  jobService = inject(JobService);
  helperService = inject(HelperService);
  router = inject(Router);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  
  ngOnInit() {
    this.loadJobs();
    this.loadCategories();
  }

  private fetchJobs(page: number = 1, filters?: any) {
    this.loading = true;
    this.jobService.searchJobs(page, filters).subscribe({
      next: (response: ResultI<JobI[]>) => {
        this.jobs = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading jobs'
        });
        this.loading = false;
      }
    });
  }

  loadJobs() {
    this.fetchJobs();
  }

  onFilterChange(event: {column: any, value: any} | {column: any, value: any}[]) {
    if(Array.isArray(event)){ 
      event.forEach((item) => {
        const column = item.column?.filter?.name || item.column?.name?.replace('.', '_');
        this.filters[column] = item.value;    
      });
    }else{
      const column = event.column?.filter?.name || event.column?.name?.replace('.', '_');
      this.filters[column] = event.value;    
    }
    this.currentPage = 1;
    this.fetchJobs(this.currentPage, this.filters);
  }

  onPageChange(event: any) {
    this.currentPage = event.page ?? this.currentPage;
    this.fetchJobs(this.currentPage);
  }

  loadCategories() {
    this.helperService.getCategories().subscribe({
      next: (response: ResultI<CategoryI[]>) => {
        this.categories = response.results;
        this.columns.push({ 
          header: 'Category', 
          name: 'category.name', 
          pipe: 'text',
          filter: { type: 'select', value: '', name:'category', data: this.categories.map(category => ({ name: category.name, value: category.id })) }
        });
      }
    });
  }

  createJob() {
    this.router.navigate(['/jobs/create']);
  }

  onActionClick(event: any) {
    const { action, item } = event;
    if (action === 'Edit') {
      this.router.navigate(['/jobs/edit', item.id]);
    } else if (action === 'Delete') {
      this.onDelete(item.id);
    }
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this job?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.jobService.deleteJob(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Job deleted successfully'
            });
            this.loadJobs();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error deleting job'
            });
          }
        });
      }
    });
  }
}
