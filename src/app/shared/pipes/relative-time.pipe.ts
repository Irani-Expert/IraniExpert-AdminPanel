import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date): string {
    if (!(value instanceof Date)) value = new Date(value);

    let seconds: number = Math.floor(
      (new Date().getTime() - value.getTime()) / 1000
    );
    let interval: number = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' سال پیش';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' ماه پیش';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' روز پیش';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' ساعت پیش';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' دقیقه پیش';
    }
    return Math.floor(seconds) + ' ثانیه پیش';
  }
}
