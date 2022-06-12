import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionStatus',
})
export class TransactionStatusPipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'سفارش جدید';
        break;
      case 1:
        result = 'منتظر پرداخت';
        break;
      case 2:
        result = ' در انتظار تایید';
        break;
      case 3:
        result = 'منحل شده پس از پرداخت';
        break;
      case 4:
        result = 'منحل شده پس از استفاده';
        break;
      case 5:
        result = 'خطا در پراخت';
        break;
      case 6:
        result = 'ادعای پرداخت';
        break;
      case 7:
        result = 'خطا در اعتبارسنجی';
        break;
    }
    return result;
  }
}
