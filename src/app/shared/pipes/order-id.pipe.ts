import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderID',
})
export class OrderIdPipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'اولویت بسیار بالا';
        break;
      case 1:
        result = 'اولویت بالا';
        break;
      case 2:
        result = 'اولویت متوسط';
        break;

      case 3:
        result = 'اولویت پایین ';
        break;
      case 4:
        result = 'اولویت بسیار پایین ';
        break;
      default:
        result = 'مشخص نشده';
    }
    return result;
  }
}
