import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiplier',
})
export class MultiplierPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    var result = '';
    switch (value) {
      case 0:
        result = 'هیچ';
        break;
      case 1:
        result = 'هزار';
        break;
      case 2:
        result = 'تریلیون';
        break;
      case 3:
        result = 'میلیون';
        break;
      case 3:
        result = 'میلیارد ';
        break;
      default:
        result = '';
    }
    return result;
  }
}
