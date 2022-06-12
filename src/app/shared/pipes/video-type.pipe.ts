import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videoType',
})
export class VideoTypePipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'خانه';
        break;
      case 1:
        result = 'بک تست';
        break;
      case 2:
        result = 'آموزش';
        break;
      case 99:
        result = 'دیگر';
        break;
    }
    return result;
  }
}
