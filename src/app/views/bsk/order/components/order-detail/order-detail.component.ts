import { Component, Input } from '@angular/core';
type DetailHeader = { value: string | number; key: string };

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
  @Input('data') detailOrderArray = new Array<DetailHeader>();
}
