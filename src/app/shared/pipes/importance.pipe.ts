import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'importance',
})
export class ImportancePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    var result = '';
    switch (value) {
      case 0:
        result = 'نامشخص';
        break;
      case 1:
        result = 'پایین';
        break;
      case 2:
        result = 'بالا';
        break;
      case 3:
        result = 'متوسط';
        break;
      default:
        result = '';
    }
    return result;
  }
}
