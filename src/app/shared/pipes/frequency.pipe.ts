import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frequency',
})
export class FrequencyPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    var result = '';
    switch (value) {
      case 0:
        result = 'هفتگی';
        break;
      case 1:
        result = 'ماهانه';
        break;
      case 2:
        result = 'نامشخص';
        break;

      case 3:
        result = 'سه ماهه';
        break;
      default:
        result = '';
    }
    return result;
  }
}
