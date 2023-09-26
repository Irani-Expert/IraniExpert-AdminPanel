import { CurrencyPipe, DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TransactionStatusPipe } from 'src/app/shared/pipes/transaction-status.pipe';
type DetailHeader = { value: string | number; key: string };
@Pipe({
  name: 'orderDetail',
})
export class OrderDetailPipe implements PipeTransform {
  constructor(
    public datePipe: DatePipe,
    public transactionStatus: TransactionStatusPipe,
    public currency: CurrencyPipe
  ) {}
  switchValues(val: DetailHeader) {
    var isSpliced = false;
    switch (val.key) {
      case 'createDate':
        val.key = 'تاریخ ثبت';
        val.value = this.datePipe.transform(val.value, 'yyyy/M/d');
        break;
      case 'accountNumber':
        val.key = 'شماره حساب';
        break;
      case 'transactionStatus':
        val.key = 'وضعیت سفارش';
        typeof val.value == 'number'
          ? (val.value = this.transactionStatus.transform(val.value))
          : val.value;
        break;
      case 'description':
        if (!val.value) {
          isSpliced = true;
        } else {
          val.key = 'توضیحات';
        }
        break;
      case 'firstName':
        val.key = 'نام';
        break;
      case 'lastName':
        val.key = 'نام خانوادگی';
        break;
      case 'phoneNumber':
        val.key = 'شماره تماس';
        break;
      case 'bankResponse':
        val.key = 'پاسخ بانک';
        !val.value ? (val.value = 'نامشخص') : val.value;
        break;
      case 'code':
        val.key = 'کد';
        break;
      case 'totalPrice':
        val.key = 'قیمت مجموع';
        val.value = this.currency.transform(val.value, 'USD');
        break;
      case 'discountPrice':
        val.key = 'تخفیف';
        val.value = this.currency.transform(val.value, 'USD');
        break;
      case 'toPayPrice':
        val.key = 'پرداخت نهایی';
        val.value = this.currency.transform(val.value, 'USD');
        break;
      case 'startDate':
        if (!val.value) {
          isSpliced = true;
        } else {
          val.key = 'شروع لایسنس';
          val.value = this.datePipe.transform(val.value, 'yyyy/M/d');
        }

        break;
      case 'expireDate':
        if (!val.value) {
          isSpliced = true;
        } else {
          val.key = 'انقضاء لایسنس';
          val.value = this.datePipe.transform(val.value, 'yyyy/M/d');
        }

        break;
      case 'versionNumber':
        if (!val.value) {
          isSpliced = true;
        } else {
          val.key = 'ورژن لایسنس';
        }

        break;
      case 'licenseID':
        isSpliced = true;
        break;
      case 'peresentorFName':
        val.key = 'نام معرف';
        break;
      case 'peresentorLName':
        val.key = 'نام خانوادگی معرف';
        break;
    }
    return isSpliced;
  }
  transform(value: Array<DetailHeader>) {
    var counter = 0;
    for (; counter < value.length; ) {
      if (this.switchValues(value[counter])) {
        value.splice(counter, 1);
        counter;
      } else counter++;
    }
    return value;
  }
}
