import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentStatus',
})
export class PaymentStatusPipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'Init';
        break;
      case 1:
        result = 'آماده پرداخت';
        break;
      case 2:
        result = 'درحال پرداخت';
        break;
      case 3:
        result = 'پرداخت شده';
        break;
      case 98:
        result = 'خطا در اعتبارسنجی';
        break;
      case 99:
        result = 'با خطا مواجه شده';
        break;
    }
    return result;
  }
}
