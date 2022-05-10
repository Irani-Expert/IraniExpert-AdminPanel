import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type'
})
export class TypePipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'بک تست';
        break;
      case 1:
        result = 'دیگر';
        break;
      case 2:
        result = 'صفحه اصلی بالا';
        break;

      case 3:
        result = 'صفحه اصلی وسط ';
        break;

      default:
        result = 'دیگر';
    }
    return result;
  }
}
