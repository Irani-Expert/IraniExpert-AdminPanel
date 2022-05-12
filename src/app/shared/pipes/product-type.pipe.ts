import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productType'
})
export class ProductTypePipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'تجاری';
        break;
      case 1:
        result = 'تحصیلات';
        break;
        case 1:
          result = 'مشاوره';
          break;
      default:
        result = 'تجاری';
    }
    return result;
  }

}
