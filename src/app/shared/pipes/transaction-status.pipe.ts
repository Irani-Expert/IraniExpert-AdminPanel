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
        result = 'در انتظار پرداخت';
        break;
      case 2:
        result = ' تایید شده';
        break;
      case 3:
        result = 'لغو شده پس از پرداخت';
        break;
      case 4:
        result = 'لغو شده پس از استفاده';
        break;
      case 5:
        result = 'خطا در پرداخت';
        break;
      case 6:
        result = 'درانتظار تایید';
        break;
      case 7:
        result = 'خطا در اعتبارسنجی';
        break;
        case 8:
        result = 'نهایی ';
        break;
      case 9:
        result = 'لغو شده';
        break;
    }
    return result;
  }
}
