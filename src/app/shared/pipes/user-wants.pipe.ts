import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userWants',
})
export class UserWantsPipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'دمو';
        break;
      case 1:
        result = 'مشاوره';
        break;
        case 2:
          result = 'مشارکت در سود';
          break;
    }
    return result;
  }
}
