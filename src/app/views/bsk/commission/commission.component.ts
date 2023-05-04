import { Component, OnInit } from '@angular/core';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
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

  user: UserInfoModel;

  page = {
    size: 6,
    pageToGo: 3,
    totalElements: 0,
    currentPage: 1,
  };
  constructor(
    private _commission: CommissionService,
    private auth: AuthenticateService
  ) {
    this.user = this.auth.currentUserValue;
  }

  ngOnInit(): void {
    this._commission.getMyCommission(this.user.userID, 4).subscribe((thing) => {
      this.data = thing.data;
      if (thing.data.header) {
        this.isLoaded = true;
      }
      if(thing.data.orders!=null){
        this.page.totalElements = thing.data.orders.length;

      }
    });
  }
  setPage(_pageNumber: number) {
    this.page.currentPage = _pageNumber;
  }
}
