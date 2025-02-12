import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productType',
})
export class ProductTypePipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'اکسپرت';
        break;
      case 1:
        result = 'اندیکاتور';
        break;
      case 2:
        result = 'کمکی';
        break;
      default:
        result = '';
    }
    return result;
  }
}
