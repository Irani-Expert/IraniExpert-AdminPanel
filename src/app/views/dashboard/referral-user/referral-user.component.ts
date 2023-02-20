import { Component, OnInit } from '@angular/core';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';
import { UsersService } from '../../sec/user-mangement/users.service';
import { referraluserModel } from './referral-user.model';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/views/bsk/order/order.service';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ordersModel } from 'src/app/shared/models/ordersModel';
import { HeaderModel } from 'src/app/shared/models/HeaderModel';

@Component({
  selector: 'app-referral-user',
  templateUrl: './referral-user.component.html',
  styleUrls: ['./referral-user.component.scss']
})
export class ReferralUserComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: referraluserModel
  orders:ordersModel[]=new Array<ordersModel>();
  header:HeaderModel
refralcode:string;
  constructor(private _userService:UsersService
    ,   private toastr:ToastrService,
    public _orderService: OrderService,
    ) { }

  ngOnInit(): void {
    this.getUser();

  }
  getUser() {
    this._userService.getUserByToken().subscribe(
      (res: UserInforamationModel) => {
        
        this.refralcode = res.id.toString();
        this.subUsers();
        
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

    this._orderService.getBysellingTypeQuery(this.refralcode,2).subscribe(
      (res: Result<referraluserModel>) => {
        
        this.rows = res.data;
       this.orders= this.rows.orders
this.header=this.rows.header
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
