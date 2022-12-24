import { Component, OnInit } from '@angular/core';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';
import { UsersService } from '../../sec/user-mangement/users.service';
import { referraluserModel } from './referral-user.model';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/views/bsk/order/order.service';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';

@Component({
  selector: 'app-referral-user',
  templateUrl: './referral-user.component.html',
  styleUrls: ['./referral-user.component.scss']
})
export class ReferralUserComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: referraluserModel[] = new Array<referraluserModel>();
refralcode:string;
  constructor(private _userService:UsersService
    ,   private toastr:ToastrService,
    public _orderService: OrderService,
    ) { }

  ngOnInit(): void {
    this.getUser();
    this.subUsers();
  }
  getUser() {
    this._userService.getUserByToken().subscribe(
      (res: UserInforamationModel) => {
        this.refralcode = res.referralCode;
        debugger
      },
      (_error) => {
        this.toastr.error(
          'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
          null,
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
      }
    );
  }
  subUsers(){
   
    this._orderService.getreferralUser(this.refralcode).subscribe(
      (res: Result<Paginate<referraluserModel[]>>) => {
        
        this.rows = res.data.items;
        debugger
      },
      (_error) => {
        this.toastr.error(
          'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
          null,
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
      }
    );
  }
}
