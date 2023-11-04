// {
//     "success": true,
//     "message": "",
//     "data": [
//       {
//         "title": "ماکسیمم بالانس",
//         "value": 0
//       },
//       {
//         "title": "پرافیت بیس",
//         "value": 1
//       },
//       {
//         "title": "محدودیت زمانی",
//         "value": 2
//       },
//       {
//         "title": "اعتماد",
//         "value": 3
//       },
//       {
//         "title": "تریدر",
//         "value": 4
//       },
//       {
//         "title": "تجاری",
//         "value": 5
//       }
//     ],
//     "errors": []
//   }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'planType',
})
export class PlanTypePipe implements PipeTransform {
  transform(_value: number) {
    var result = '';
    switch (_value) {
      case 0:
        result = 'ماکسیمم بالانس';
        break;
      case 1:
        result = 'پرافیت بیس';
        break;
      case 2:
        result = 'محدودیت زمانی';
        break;
      case 3:
        result = 'اعتماد';
        break;
      case 4:
        result = 'تریدر';
        break;
      case 5:
        result = 'تجاری';
        break;

      default:
        result = '';
    }
    return result;
  }
}
