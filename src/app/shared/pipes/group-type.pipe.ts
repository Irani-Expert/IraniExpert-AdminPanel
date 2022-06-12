import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupType',
})
export class GroupTypePipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'تنظیمات';
        break;
      case 1:
        result = 'مقالات';
        break;
      case 2:
        result = 'سوالات متداول';
        break;
    }
    return result;
  }
}
