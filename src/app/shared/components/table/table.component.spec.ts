//NOTE: This is a test file for the TableComponent.
//It is not a test for the TableComponent itself, but for the methods that are used in the TableComponent.
//It is not a test for the TableComponent itself, but for the methods that are used in the TableComponent. 
//!IMPORTANT: IT WAS CREATED BY CURSOR AI - GPT-4.1
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
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
import { RouterTestingModule } from '@angular/router/testing';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const mockColumn = {
    name: 'test',
    filter: { type: 'text', value: '' }
  };

  const mockDateColumn = {
    name: 'created_at',
    filter: { type: 'date', value: '' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CalendarModule,
        PaginatorModule,
        CardModule,
        TooltipModule,
        CustomPipe,
        TagModule,
        DatePickerModule,
        TableComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getNestedValue', () => {
    it('should return nested value from object', () => {
      const obj = { user: { name: 'John' } };
      expect(component.getNestedValue(obj, 'user.name')).toBe('John');
    });

    it('should return null for non-existent path', () => {
      const obj = { user: { name: 'John' } };
      expect(component.getNestedValue(obj, 'user.age')).toBeNull();
    });
  });

  describe('actionClick', () => {
    it('should emit action event', () => {
      spyOn(component.onAction, 'emit');
      const action = 'edit';
      const item = { id: 1 };
      
      component.actionClick(action, item);
      
      expect(component.onAction.emit).toHaveBeenCalledWith({ action, item });
    });
  });

  describe('onFilterChange', () => {
    it('should emit filter event with text value', () => {
      spyOn(component.onFilter, 'emit');
      const event = { target: { value: 'test' } };
      
      component.onFilterChange(event, mockColumn);
      
      // Wait for debounce
      setTimeout(() => {
        expect(component.onFilter.emit).toHaveBeenCalledWith({
          column: mockColumn,
          value: 'test'
        });
      }, 400);
    });
  });

  describe('onDateRangeChange', () => {
    it('should emit filter event with date range', () => {
      spyOn(component.onFilter, 'emit');
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const event = [startDate, endDate];
      
      component.onDateRangeChange(event, mockDateColumn);
      
      // Wait for debounce
      setTimeout(() => {
        expect(component.onFilter.emit).toHaveBeenCalledWith([
          {
            column: { ...mockDateColumn, name: 'created_at__gte' },
            value: '2024-01-01'
          },
          {
            column: { ...mockDateColumn, name: 'created_at__lte' },
            value: '2024-01-31'
          }
        ]);
      }, 400);
    });
  });

  describe('clearFilter', () => {
    it('should clear text filter', () => {
      spyOn(component.onFilter, 'emit');
      mockColumn.filter.value = 'test';
      
      component.clearFilter(mockColumn);
      
      expect(component.onFilter.emit).toHaveBeenCalledWith({
        column: mockColumn,
        value: ''
      });
      expect(mockColumn.filter.value).toBe('');
    });

    it('should clear date filter', () => {
      spyOn(component.onFilter, 'emit');
      mockDateColumn.filter.value = '';
      
      component.clearFilter(mockDateColumn);
      
      expect(component.onFilter.emit).toHaveBeenCalledWith([
        {
          column: { ...mockDateColumn, name: 'created_at__gte' },
          value: ''
        },
        {
          column: { ...mockDateColumn, name: 'created_at__lte' },
          value: ''
        }
      ]);
      expect(mockDateColumn.filter.value).toBe('');
    });
  });

  describe('handlePageChange', () => {
    it('should emit page change event', () => {
      spyOn(component.onPageChange, 'emit');
      const event = { first: 10, rows: 10 };
      
      component.handlePageChange(event);
      
      expect(component.onPageChange.emit).toHaveBeenCalledWith({
        first: 10,
        rows: 10,
        page: 2
      });
    });

    it('should not emit for invalid event', () => {
      spyOn(component.onPageChange, 'emit');
      
      component.handlePageChange(null);
      
      expect(component.onPageChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('getDropdownOptions', () => {
    it('should return dropdown options with All option', () => {
      const column = {
        filter: {
          data: [
            { name: 'Option 1', value: '1' },
            { name: 'Option 2', value: '2' }
          ]
        }
      };
      
      const options = component.getDropdownOptions(column);
      
      expect(options).toEqual([
        { name: 'All', value: '' },
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]);
    });
  });

});
