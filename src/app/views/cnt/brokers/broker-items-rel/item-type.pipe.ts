import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemType',
})
export class ItemType implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'رگوله';
        break;
      case 1:
        result = 'پلتفرم معامله‎گری';
        break;
      case 2:
        result = 'بیمه';
        break;
      case 3:
        result = 'نحوه انتقال پول';
        break;
      case 4:
        result = 'رگوله برای ایرانیان';
        break;
      default:
        result = '';
    }
    return result;
  }
}
