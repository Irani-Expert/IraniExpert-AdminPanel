import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sector',
})
export class SectorPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    var result = '';
    switch (value) {
      case 0:
        result = 'بازار';
        break;
      case 1:
        result = 'پول';
        break;
      case 2:
        result = 'تعطیلات';
        break;
      case 3:
        result = 'بازرگانی';
        break;
      case 4:
        result = 'قیمت ها';
        break;
      case 5:
        result = 'شغل ها';
        break;
      case 6:
        result = 'دولت ها';
        break;
      case 7:
        result = 'مشتریان';
        break;
      case 8:
        result = 'کسب و کار';
        break;
      case 9:
        result = 'مسکن';
        break;
      case 10:
        result = 'تولید داخلی';
        break;
      default:
        result = '';
    }
    return result;
  }
}
