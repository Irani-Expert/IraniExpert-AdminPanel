import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventType',
})
export class EventTypePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    var result = '';
    switch (value) {
      case 0:
        result = 'مناسبت ها';
        break;
      case 1:
        result = 'شاخص خبر';
        break;
      case 2:
        result = 'رویداد خبر';
        break;
      default:
        result = '';
    }
    return result;
  }
}
