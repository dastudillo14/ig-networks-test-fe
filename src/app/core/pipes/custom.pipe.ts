import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom',
  standalone: true
})
export class CustomPipe implements PipeTransform {
  transform(value: any, type: string): any {
    switch (type) {
      case 'date':        
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      case 'percentage':
        return `${value}%`;
      case 'status':
        return value.name;
      case 'text':
        return value;
      case 'boolean':
        return value ? 'Active' : 'Inactive';
      default:
        return value;
    }
  }
} 