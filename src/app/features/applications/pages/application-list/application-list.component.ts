import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ApplicationI } from '../../../../core/models/application.model';
import { ApplicationService } from '../../../../core/services/application.service';
import { Router } from '@angular/router';
import { ResultI } from '../../../../core/models/result.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { CategoryI } from '../../../../core/models/category.model';
import { StatusI } from '../../../../core/models/status.model';
import { HelperService } from '../../../../core/services/helper.service';
import { ColumnI } from '../../../../core/models/column.model';
import { PAGE_SIZE } from '../../../../core/consts/page.const';
import { UserService } from '../../../../core/services/user.service';
import { ApplicationDetailComponent } from '../../components/application-detail/application-detail.component';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableComponent,
    ApplicationDetailComponent
  ],
  templateUrl: './application-list.component.html',
  styles: []
})
export class ApplicationListComponent {
  applicationService = inject(ApplicationService);
  helperService = inject(HelperService);
  userService = inject(UserService);

  applications: ApplicationI[] = [];
  router = inject(Router);
  loading = false;
  categories: CategoryI[] = [];
  statusList: StatusI[] = [];
  isAdmin = this.userService.isAdmin();
  // Pagination properties
  totalRecords = 0;
  rows = PAGE_SIZE;
  first = 0;
  page = 1;
  filters: any = {};

  selectedApplication: ApplicationI | null = null;
  showDetailModal = false;

  // Table configuration
  columns: ColumnI[] = [
    { 
      header: 'Job Title', 
      name: 'jobpost.title', 
      pipe: 'text',
      filter: { type: 'text', placeholder: 'Search by job title' }
    },
    {
      name: 'resume_link',
      header: 'Resume Link',
      filter: { type: 'text', placeholder: 'Search by resume link' }
    },
    { 
      header: 'Location', 
      name: 'jobpost.location', 
      pipe: 'text',
      filter: { type: 'text', placeholder: 'Search by location' }
    },
    {
      name: 'applicant.username',
      header: 'Applicant',
      filter: { type: 'text', placeholder: 'Search by applicant' },
      show: this.isAdmin
    },   
    { 
      header: 'Applied Date', 
      name: 'submission_date', 
      pipe: 'date',
      filter: { type: 'date' }
    }
  ];

  actions = [
    { name: 'View Details', icon: 'pi pi-eye', class: 'p-button-rounded p-button-text' }
  ];

  ngOnInit() {
    this.loadApplications();
    this.loadCategories();
    this.loadStatusList();
  }

  loadApplications(event?: any, filters?: any) {
    this.loading = true;
    const page = event?.page || this.page;
    this.page = page;
    this.applicationService.getApplications(page, filters).subscribe({
      next: (response: ResultI<ApplicationI[]>) => {
        this.applications = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.helperService.getCategories().subscribe({
      next: (response: ResultI<CategoryI[]>) => {
        this.categories = response.results;
        this.columns.push({ 
          header: 'Category', 
          name: 'jobpost.category.name', 
          pipe: 'text',
          filter: { 
            type: 'select',  
            value: '', 
            name: 'jobpost_category', 
            placeholder: 'Select category',
            data: this.categories.map(category => ({ name: category.name, value: category.id })) 
          }
        });
      }
    });
  }

  loadStatusList() {
    this.helperService.getStatusList().subscribe({
      next: (response: ResultI<StatusI[]>) => {
        this.statusList = response.results;
        this.columns.push({ 
          header: 'Status', 
          name: 'status.description', 
          pipe: 'text',
          filter: { 
            type: 'select',  
            value: '', 
            name: 'status', 
            placeholder: 'Select status',
            data: this.statusList.map(status => ({ name: status.description, value: status.id })) 
          }
        });
      }
    });
  }

  onPageChange(event: any) {
    this.loadApplications(event);
  }

  onAction(event: any) {
    if (event.action === 'View Details') {
      this.viewDetails(event.item);
    }
  }

  viewDetails(application: ApplicationI): void {
    this.selectedApplication = application;
    this.showDetailModal = true;
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
    this.loadApplications(null, this.filters);
  }
} 