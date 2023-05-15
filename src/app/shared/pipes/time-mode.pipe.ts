import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeMode',
})
export class TimeModePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    var result = '';
    switch (value) {
      case 0:
        result = 'تاربخ و ساعت';
        break;
      case 1:
        result = 'تجربی';
        break;
      case 2:
        result = 'تاریخ';
        break;
      case null:
        result = 'نامشخص';
        break;
      default:
        result = '';
    }
    return result;
  }
}
