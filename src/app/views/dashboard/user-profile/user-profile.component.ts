import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';
import { UsersModel } from '../../sec/user-mangement/users.model';
import { UsersService } from '../../sec/user-mangement/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  addForm: FormGroup;
  addUpdate:UserInforamationModel=new UserInforamationModel();
  isEdit:boolean=true;
  constructor(private _formBuilder:FormBuilder
    ,private _userService:UsersService
    ,private toastr:ToastrService) {

    this.addForm = this._formBuilder.group({
      lastName: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      username: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phoneNumber: [null, Validators.compose([Validators.required])],
      referralCode: [null, Validators.compose([Validators.required])],
    });

  }

  ngOnInit(): void {
    this._userService
    .getUserByToken()
    .subscribe(
      (res: UserInforamationModel) => {
        this.addUpdate = res;
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
