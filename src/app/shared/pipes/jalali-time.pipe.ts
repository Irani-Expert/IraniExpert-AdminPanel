import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'jalali-moment';
@Pipe({
  name: 'jalali',
})
export class JalaliPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let MomentDate = moment(value, 'YYYY/MM/DD');
    return MomentDate.locale('fa').format('YYYY/M/D');
  }
}
