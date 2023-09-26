import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableHeader',
})
export class TableHeaderPipe implements PipeTransform {
  transform(value: string[], type = 'split') {
    value = value.slice();
    for (let counter = 0; counter < value.length; ) {
      if (type == 'split') {
        if (this.splitterAlone(value[counter])) {
          value.splice(counter, 1);
          counter;
        } else {
          counter++;
        }
      } else {
        if (this.splitterAndChanger(value, counter)) {
          value.splice(counter, 1);
          counter;
        } else {
          counter++;
        }
      }
    }

    return value;
  }
  splitterAndChanger(value: string[], counter: number) {
    let isSplited = false;
    switch (value[counter]) {
      case 'id':
        value[counter] = 'شناسه';
        break;
      case 'tableType':
        isSplited = true;
        break;
      case 'rowID':
        isSplited = true;
        break;
      case 'count':
        value[counter] = 'تعداد';
        break;
      case 'unitPrice':
        value[counter] = 'قیمت واحد';
        break;
      case 'totalPrice':
        value[counter] = 'قیمت کل';
        break;
      case 'discountPrice':
        value[counter] = 'مبلغ تخفیف';
        break;
      case 'toPayPrice':
        value[counter] = 'مبلغ نهایی';
        break;
    }
    return isSplited;
  }
  splitterAlone(value: string) {
    if (value == 'tableType') {
      return true;
    }
    if (value == 'rowID') {
      return true;
    } else {
      return false;
    }
  }
  changeNameAlone(value: string) {
    switch (value) {
      case 'id':
        value = 'شناسه';
        break;
      case 'tableType':
        value = 'نوع داده';
        break;
      case 'rowID':
        value = 'شناسه والد';
        break;
      case 'count':
        value = 'تعداد';
        break;
      case 'unitPrice':
        value = 'قیمت واحد';
        break;
      case 'totalPrice':
        value = 'قیمت کل';
        break;
      case 'discountPrice':
        value = 'مبلغ تخفیف';
        break;
      case 'toPayPrice':
        value = 'مبلغ نهایی';
        break;
    }
    return value;
  }
}
