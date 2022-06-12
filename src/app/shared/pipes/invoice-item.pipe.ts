import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceItem'
})
export class InvoiceItemPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
