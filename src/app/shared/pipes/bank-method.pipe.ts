import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bankMethod',
})
export class BankMethodPipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'هتل';
        break;
      case 1:
        result = 'کلینیک';
        break;
    }
    return result;
  }
}
