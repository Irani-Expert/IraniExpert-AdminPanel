import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';
import { UserModel } from 'src/app/shared/models/userModel';
import { UsersModel } from '../../sec/user-mangement/users.model';
import { UsersService } from '../../sec/user-mangement/users.service';
import { UpdatePasswordModel } from './UpdatePassword.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  addForm: FormGroup;
  passwordForm: FormGroup;
  addUpdate: UserInforamationModel = new UserInforamationModel();
  isEdit: boolean = true;
  password:UpdatePasswordModel=new UpdatePasswordModel();
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.addForm = this._formBuilder.group({
      lastName: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      username: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phoneNumber: [null, Validators.compose([Validators.required])],
      referralCode: [null, Validators.compose([Validators.required])],
    });
    this.passwordForm = this._formBuilder.group({
      oldPassword: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this._userService.getUserByToken().subscribe(
      (res: UserInforamationModel) => {
        this.addUpdate = res;
        this.isEdit=true;
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
  async updateUser() {
    await this._userService
      .updateUser(this.addUpdate.id, this.addUpdate)
      .toPromise()
      .then(
        (data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        },
        (_error) => {
          this.toastr.error('خطا مجدد تلاش فرمایید', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      );
    this.getUser();
  }
  openPasswordModal(content: any){
    this.modalService
      .open(content, {
        size: 'md',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result: boolean) => {
          if (result===true) {
            this.passwordChange(this.password);
            this.addForm.reset();
            this.getUser()
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset;
        }
      );
  }
 async passwordChange(password:UpdatePasswordModel){
    password.id=this.addUpdate.id
    await this._userService
    .changePassword(this.password)
    .toPromise()
    .then(
      (data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      },
      (_error) => {
        this.toastr.error('خطا مجدد تلاش فرمایید', null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    );
  }
}
