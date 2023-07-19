import { NumberSymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'RemainingTimePipe',
})
export class RemainingTimePipe implements PipeTransform {
  transform(minutes: NumberSymbol): unknown {
    const hours = Math.floor(minutes / 60);
    const minutesLeft = minutes % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${
      minutesLeft < 10 ? '0' : ''
    }${minutesLeft}:00`;
  }
}
