import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { JobI } from '../../../../core/models/job.model';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, TimeAgoPipe, SafeHtmlPipe],
  template: `
    <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer h-[280px] flex flex-col" (click)="onViewDetails()">
      <div class="flex-1 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {{ job.category.name | titlecase }}
            </span>
            <span class="text-sm text-gray-500">
              {{ job.created_at | timeAgo }}
            </span>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">{{ job.title }}</h2>
          <p class="text-gray-600 text-sm">{{ job.location }}</p>
        </div>

        <p class="text-gray-600 line-clamp-3 min-h-[4.5rem]" [innerHTML]="job.description | html  " ></p>
      </div>

      <div class="flex justify-end mt-4">
        <p-button 
          label="View Details" 
          icon="pi pi-arrow-right" 
          styleClass="p-button-text p-button-sm"
          (onClick)="onViewDetails()"
        ></p-button>
      </div>
    </div>
  `,
  styles: []
})
export class JobCardComponent {
  @Input() job!: JobI;
  @Output() viewDetails = new EventEmitter<JobI>();

  onViewDetails() {
    this.viewDetails.emit(this.job);
  }
} 