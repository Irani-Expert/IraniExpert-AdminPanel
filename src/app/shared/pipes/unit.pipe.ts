import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unit',
})
export class UnitPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    var result = '';
    switch (value) {
      case 0:
        result = 'شغل';
        break;
      case 1:
        result = ' دلار آمریکا';
        break;
      case 2:
        result = 'رهن';
        break;
      case 3:
        result = 'ساعت';
        break;
      case 4:
        result = 'ندارد';
        break;
      case 5:
        result = 'رای و اخذ رای';
        break;
      case 6:
        result = 'فوت مکعب';
        break;
      case 7:
        result = 'واحد پول';
        break;
      case 8:
        result = ' اسباب';
        break;
      case 9:
        result = 'ساختمان';
        break;
      case 10:
        result = 'بشکه';
        break;
      case 11:
        result = 'موقعیت';
        break;
      case 12:
        result = 'درصد';
        break;
      case 13:
        result = 'مردم';
        break;
      default:
        result = '';
    }
    return result;
  }
}
