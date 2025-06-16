import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    
    // Reset time part to compare only dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (inputDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (inputDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      const diffInDays = Math.floor((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Published ${diffInDays} days ago`;
    }
  }
} 