import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ApplicationI } from '../../../../core/models/application.model';
import { TagModule } from 'primeng/tag';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TagModule,
    SafeHtmlPipe
  ],
  templateUrl: './application-detail.component.html',
  styles: [`
    .detail-row {
      margin-bottom: 1rem;
    }
    .detail-label {
      font-weight: bold;
      color: #666;
    }
    .detail-value {
      color: #333;
    }
  `]
})
export class ApplicationDetailComponent {
  @Input() application!: ApplicationI;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeModal() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
} 