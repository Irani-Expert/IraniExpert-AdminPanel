import { InvoiceModel } from '../../models/invoice.model';
import { lastValueFrom, map } from 'rxjs';
import { InvoiceService } from '../../services/invoice.service';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { OnInit } from '@angular/core';

export class Invoice {
  statusOption = [
    {
      value: 3,
      title: 'پرداخت شده',
    },
    // {
    //   value: 98,
    //   title: 'پرداخت ناموفق',
    // },
    {
      value: 99,
      title: 'رد سفارش',
    },
  ];
  private invoiceItem = new InvoiceModel();
  constructor(
    public invoiceService: InvoiceService,
    private orderID: number,
    public auth: AuthenticateService
  ) {}

  async getFromApi() {
    const getResult = this.invoiceService.getInvoice(this.orderID).pipe(
      map((res) => {
        this.invoiceService.invoiceItemSubject.next(res.data[0]);
        return res.success;
      })
    );
    return await lastValueFrom(getResult);
  }
  get _invoiceItem() {
    return this.invoiceItem;
  }
  set _invoiceItem(item: InvoiceModel) {
    this.invoiceItem = item;
  }
  set changeStatus(status: number) {
    this.invoiceItem.status = status;
  }
  async update() {
    const updateResult = this.invoiceService
      .update(this._invoiceItem.id, this._invoiceItem, 'Invoice')
      .pipe(
        map((res) => {
          return res;
        })
      );
    return await lastValueFrom(updateResult);
  }
}
