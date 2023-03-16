import { Component, OnInit } from '@angular/core';
import { CommissionModel } from './commission.model';
import { CommissionService } from './commission.service';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionComponent implements OnInit {
  data: CommissionModel;
  isLoaded: boolean = false;

  page = {
    size: 6,
    pageNumber: 1,
    totalElements: 0,
  };
  constructor(private _commission: CommissionService) {}

  ngOnInit(): void {
    this._commission.getMyCommission(1148, 2).subscribe((thing) => {
      this.data = thing.data;
      this.isLoaded = true;
      this.page.totalElements = thing.data.orders.length;
    });
  }
  setPage(pageNumber: number) {
    this.page.pageNumber += 1;
  }
}
