import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderID',
})
export class OrderIdPipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = ' بسیار بالا';
        break;
      case 1:
        result = ' بالا';
        break;
      case 2:
        result = ' متوسط';
        break;

      case 3:
        result = ' پایین ';
        break;
      case 4:
        result = ' بسیار پایین ';
        break;
      default:
        result = 'مشخص نشده';
    }
    return result;
  }
}
