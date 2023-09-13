import { Component } from '@angular/core';
import * as moment from 'jalali-moment';
import { OrdersModel, TableModel } from '../../models/orders-new.model';
import { OrderService } from '../../services/order.service';
import { Page } from 'src/app/shared/models/Base/page';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  isHijri: boolean = false;
  isCode: boolean = false;
  page: Page = new Page();
  filter: FilterModel = new FilterModel();
  headers = [
    'کد رهگیری',
    'تاریخ ثبت',
    'شماره حساب',
    'نام خریدار',
    'محصول',
    'جزئیات',
  ];
  headerValue: 'کد رهگیری' | 'شناسه' = 'کد رهگیری';
  table: TableModel<OrdersModel[]>;
  constructor(private orderService: OrderService) {
    this.table = {
      headers: this.headers,
      data: new Array<OrdersModel>(),
    };
  }

  async ngOnInit() {
    console.log(this.headers);

    await this.getOrders();
  }
  // ngAfterViewInit() {}
  async getOrders() {
    return this.orderService
      .getOrdersNew(this.page, this.filter)
      .pipe(
        map((res) => {
          if (res.success) {
            this.orderService.ordersSubject.next(res.data.items);

            return true;
          } else {
            return false;
          }
        })
      )
      .subscribe({
        next: (val) => {
          if (val) {
            this.orderService.ordersValue.forEach((item) => {
              item.hijriCreateDate = moment(item.createDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD');
            });
          }
        },
        complete: () => {
          this.table.data = this.orderService.ordersValue;
        },
      });
  }
  changeHeaderValue(type: number) {
    // 0 == falsy == id => code
    // 1 == gregorian => hijri shamsi
    if (!type) {
      this.isCode = !this.isCode;
      this.headerValue == 'کد رهگیری'
        ? (this.headerValue = 'شناسه')
        : (this.headerValue = 'کد رهگیری');
      this.table.headers[0] = this.headerValue;
    } else this.isHijri = !this.isHijri;
  }
}
