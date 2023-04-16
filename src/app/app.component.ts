import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfoModel } from './shared/models/userInfoModel';
import { AuthenticateService } from './shared/services/auth/authenticate.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Result } from './shared/models/Base/result.model';
import { UserInforamationModel } from './shared/models/userInforamationModel';
import { UsersService } from './views/sec/user-mangement/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private _authService: AuthenticateService;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private _userService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
    this._userService
      .getUserByToken()
      .subscribe((res: Result<UserInforamationModel>) => {
        if (!res.success) {
          localStorage.removeItem('currentUser');
          this.toastr.error(res.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          setTimeout(() => {
            this.router.navigate(['/sessions/signin']);
          }, 1000);
        }
      });
  }
  // checkUserPermission() {
  //   let currentUser: UserInfoModel = JSON.parse(
  //     localStorage.getItem('currentUser') ?? '{}'
  //   );
  //   if (currentUser.token != undefined) {
  //     this._authService
  //       .checkUserPermission(currentUser.token)
  //       .subscribe((res) => {
  //         if (!res) {
  //           localStorage.clear();
  //           this._authService.logout();
  //         }
  //       });
  //   }
  // }
}
