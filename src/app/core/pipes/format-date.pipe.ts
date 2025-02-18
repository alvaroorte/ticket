import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from '@core/environments/environment.development';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: string | null, ...args: unknown[]): string {
    if (!value) return "";
    return this.datePipe.transform(value, environment.formatDate) as string;
  }
}

@Pipe({
  name: 'formatDateWhitHour'
})
export class FormatDateWithHourPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: string | null, ...args: unknown[]): string {
    if (!value) return "";
    return this.datePipe.transform(value, environment.formatDateWithHours) as string;
  }
}
