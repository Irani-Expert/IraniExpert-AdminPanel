import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkType'
})
export class LinkTypePipe implements PipeTransform {
    transform(value: number): string {
      var result = '';
      switch (value) {
        case 0:
          result = 'لینک داخلی';
          break;
        case 1:
          result = 'لینک خارجی';
          break;
        default:
          result = 'لینک داخلی';
      }
      return result;
    }

}
