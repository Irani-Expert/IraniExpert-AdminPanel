import { BreadcrumbModel } from './../../../shared/models/breadcrumb.model';
import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BreadcrumbListModel } from 'src/app/shared/models/breadcrumb.model';
import { echartStyles } from '../../../shared/echart-styles';
import { UserCountModel } from './userInfo.model';
import { UsersService } from '../../sec/user-mangement/users.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ToastrService } from 'ngx-toastr';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';

@Component({
  selector: 'app-dashboad-default',
  templateUrl: './dashboad-default.component.html',
  styleUrls: ['./dashboad-default.component.css'],
})
export class DashboadDefaultComponent implements OnInit {
  breadCrumbList: BreadcrumbListModel = new BreadcrumbListModel();
  userprofile: UserCountModel = new UserCountModel();
  userModel:UserInforamationModel=new UserInforamationModel();

  constructor(private _userService:UsersService,
    private toastr:ToastrService) {
    this.breadCrumbList.title = 'خانه';
    this.breadCrumbList.breadcrumbs = new Array<BreadcrumbModel>();
    let breadCrumb = new BreadcrumbModel();
    breadCrumb.title = 'خانه';
    breadCrumb.link = '/dashboard/v1';
    this.breadCrumbList.breadcrumbs.push(breadCrumb);
  }

  ngOnInit() {
    this.getUserInfo();
    this.getUser();
  }
  getUserInfo(){
    this._userService.getUserInfo().subscribe(
      (res: Result<UserCountModel>) => {
        this.userprofile = res.data;
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

  getUser() {
    this._userService.getUserByToken().subscribe(
      (res: UserInforamationModel) => {
        this.userModel = res;
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
