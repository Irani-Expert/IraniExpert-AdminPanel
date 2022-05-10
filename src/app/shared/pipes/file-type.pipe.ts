import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
})
export class FileTypePipe implements PipeTransform {
  transform(value: number): string {
    var result = '';
    switch (value) {
      case 0:
        result = 'عکس';
        break;
      case 1:
        result = 'ویدیو';
        break;
      case 2:
        result = 'فایل PDF';
        break;
      default:
        result = 'دیگر';
    }
    return result;
  }
}
