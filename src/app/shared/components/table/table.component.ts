import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipe } from '../../../core/pipes/custom.pipe';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DatePickerModule,
    PaginatorModule,
    CardModule,
    TooltipModule,
    CustomPipe,
    TagModule,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() columns: any[] = [];
  @Input() list: any[] = [];
  @Input() actions: any[] = [];
  @Input() useFilter: boolean = false;
  @Input() usePagination: boolean = false;
  @Input() totalRows: number = 0;
  @Input() limit: number = 10;
  @Input() page: number = 1;

  @Output() onAction = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<any>();
  @Output() onFilter = new EventEmitter<
    { column: any; value: any } | { column: any; value: any }[]
  >();

  rowsShow: any[] = [];
  first: number = 0;
  filterTimeout: any;

  ngOnInit() {
    this.rowsShow = this.list;
    this.updatePaginationState();
  }

  private updatePaginationState() {
    this.first = (this.page - 1) * this.limit;
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  actionClick(action: string, item: any) {
    this.onAction.emit({ action, item });
  }

  onFilterChange(event: any, column: any) {
    // Clear any existing timeout
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    // Set a new timeout to debounce the filter
    this.filterTimeout = setTimeout(() => {
      const value = event.target?.value || event;
      column.filter.value = value; // Update the filter value in the column
      this.onFilter.emit({ column, value });
    }, 300); // 300ms debounce
  }

  onDateRangeChange(event: any, column: any) {
    if (event?.[0] && event?.[1]) {
      // Clear any existing timeout
      if (this.filterTimeout) {
        clearTimeout(this.filterTimeout);
      }

      this.filterTimeout = setTimeout(() => {
        // Handle both single date and range selection
        const value = Array.isArray(event) ? event : [event, event];
        const columnName = column.name;
        const filters = [];

        // Start date filter
        const startDateColumn = { ...column, name: columnName + '__gte' };
        filters.push({
          column: startDateColumn,
          value: this.formatDate(value[0]),
        });

        // End date filter
        const endDateColumn = { ...column, name: columnName + '__lte' };
        filters.push({  
          column: endDateColumn,
          value: this.formatDate(value[1]),
        });

        // Actualizar el valor del filtro en la columna
        column.filter.value = value;

        this.onFilter.emit(filters);
      }, 300); // 300ms debounce
    }
  }

  clearFilter(column: any) {
    if (column.name.includes('date') || column.name.includes('_at')) {
      const columnName = column.name;
      const filters = [];
      const startDateColumn = { ...column, name: columnName + '__gte' };
      filters.push({
        column: startDateColumn,
        value: '',
      });
      const endDateColumn = { ...column, name: columnName + '__lte' };
      filters.push({
        column: endDateColumn,
        value: '',
      });
      this.onFilter.emit(filters);
      column.filter.value = ''; // Clear the filter value in the column

    }else{
      column.filter.value = ''; // Clear the filter value in the column
      this.onFilter.emit({ column, value: '' });
    }
  }

  handlePageChange(event: any) {
    if (
      !event ||
      typeof event.first !== 'number' ||
      typeof event.rows !== 'number'
    ) {
      return;
    }

    this.first = event.first;
    const newPage = Math.floor(event.first / event.rows) + 1;
    if (!isNaN(newPage)) {
      this.page = newPage;
      this.onPageChange.emit({
        first: this.first,
        rows: event.rows,
        page: this.page,
      });
    }
  }

  getDropdownOptions(col: any) {
    return [{ name: 'All', value: '' }, ...(col.filter.data || [])];
  }

  onClear(event: any) {
    if (event) {
      const column = event.column;
      if (column && column.filter) {
        column.filter.value = null;
        this.onFilter.emit({ column, value: null });
      }
    }
  }
  formatDate(date: Date): string {
    if (!date) return '';

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0'); // month is 0-based
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
