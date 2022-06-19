import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentStatus',
})
export class PaymentStatusPipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'شروع سفارش';
        break;
      case 1:
        result = 'آماده سفارش';
        break;
      case 2:
        result = 'درانتظار پرداخت';
        break;
      case 3:
        result = 'پرداخت شده';
        break;
      case 4:
        result = 'در انتظار تائید';
        break;
      case 98:
        result = 'خطا در اعتبار سنجی';
        break;
        case 99:
        result = 'با خطا مواجه شده';
        break;
    }
    return result;
  }
}
