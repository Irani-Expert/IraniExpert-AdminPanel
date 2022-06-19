import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isConfirmed'
})
export class IsConfirmedPipe implements PipeTransform {

  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'رد شده';
        break;
      case 1:
        result = 'قبول شده';
        break;
    }
    return result;
  }

}
