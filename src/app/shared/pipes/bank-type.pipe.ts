import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bankType',
})
export class BankTypePipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'ناشناخته';
        break;
      case 1:
        result = 'پاسارگاد';
        break;
      case 2:
        result = 'بیتکوین';
        break;
      case 3:
        result = 'تتر';
        break;
    }
    return result;
  }
}
