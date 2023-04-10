import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserInforamationModel } from 'src/app/shared/models/userInforamationModel';
import { UsersService } from '../../sec/user-mangement/users.service';
import { UpdatePasswordModel } from '../user-profile/updatePassword.model';
import { UserProfileService } from './user-profile.service';
import { referralModel } from 'src/app/shared/models/referralModel';
import { UserReferralModel } from 'src/app/shared/models/userReferralModel.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  referral: referralModel;
  userReferral: UserReferralModel = new UserReferralModel();

  isDataFetched: boolean = false;
  addForm: FormGroup;
  passwordForm: FormGroup;
  addUpdate: UserInforamationModel;
  isEdit: boolean = true;
  password: UpdatePasswordModel = new UpdatePasswordModel();
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _userInfoService: UserProfileService
  ) {
    this.addForm = this._formBuilder.group({
      lastName: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      username: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phoneNumber: [null, Validators.compose([Validators.required])],
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
    this._userService
      .getUserByToken()
      .subscribe((res: Result<UserInforamationModel>) => {
        this.addUpdate = res.data;
        this.isEdit = true;
        this.isDataFetched = true;
      });
  }

  async updateUser() {
    this._userService
      .updateUser(this.addUpdate.userID, this.addUpdate)
      .subscribe((data) => {
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
      });
    this.getUser();
  }

  openPasswordModal(content: any) {
    this.modalService
      .open(content, {
        size: 'md',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result: boolean) => {
          if (result === true) {
            this.passwordChange(this.password);
            this.addForm.reset();
            this.getUser();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset;
        }
      );
  }

  async passwordChange(password: UpdatePasswordModel) {
    password.id = this.addUpdate.userID;
    this._userService.changePassword(this.password).subscribe((data) => {
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
    });
  }

  getReferral(modal: NgbModal, modal2: NgbModal) {
    //
    this._userInfoService.getParentLevelOne(this.addUpdate.userID).subscribe(
      (res) => {
        if (res.data.firstname) {
          this.referral = res.data;

          this.modalService.open(modal, {
            size: 'lg',
          });
        } else {
          this.sendUserReferralCreate(modal2);
        }
      },
      (error) => {
        this.toastr.error(error.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    );
  }

  sendUserReferralChange(modal: NgbModal) {
    this.modalService
      .open(modal, {
        size: 'lg',
      })
      .result.then(
        () => {
          //تایید

          this.userReferral.id = 0;
          this.userReferral.orderID = 0;
          this.userReferral.isActive = true;
          this.userReferral.firstName = this.addUpdate.firstName;
          this.userReferral.lastName = this.addUpdate.lastName;
          this.userReferral.email = this.addUpdate.email;
          this.userReferral.phoneNumber = this.addUpdate.phoneNumber;
          this.userReferral.userWant = 4;

          this._userInfoService.postUserReferral(this.userReferral).subscribe(
            (res) => {
              if (res.success) {
                this.toastr.success(res.message, null, {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                });
              }
            },
            (error) => {
              this.toastr.error(error.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          );

          this.userReferral = new UserReferralModel();
        },
        () => {
          //انصراف

          this.userReferral = new UserReferralModel();
        }
      );
  }

  sendUserReferralCreate(modal: NgbModal) {
    this.modalService
      .open(modal, {
        size: 'lg',
      })
      .result.then(
        () => {
          //تایید

          this.userReferral.id = 0;
          this.userReferral.orderID = 0;
          this.userReferral.isActive = true;
          this.userReferral.firstName = this.addUpdate.firstName;
          this.userReferral.lastName = this.addUpdate.lastName;
          this.userReferral.email = this.addUpdate.email;
          this.userReferral.phoneNumber = this.addUpdate.phoneNumber;
          this.userReferral.userWant = 4;

          this._userInfoService.postUserReferral(this.userReferral).subscribe(
            (res) => {
              if (res.success) {
                this.toastr.success(res.message, null, {
                  closeButton: true,
                  positionClass: 'toast-top-left',
                });
              }
            },
            (error) => {
              this.toastr.error(error.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          );

          this.userReferral = new UserReferralModel();
        },
        () => {
          //انصراف
          this.userReferral = new UserReferralModel();
        }
      );
  }
}
