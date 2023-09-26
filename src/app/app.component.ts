import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticateService } from './shared/services/auth/authenticate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Result } from './shared/models/Base/result.model';
import { UserInforamationModel } from './shared/models/userInforamationModel';
import { UsersService } from './views/sec/user-mangement/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  token = '';
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private _userService: UsersService,
    private toastr: ToastrService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
    let token = '';
    token = localStorage.getItem('token');

    if (token !== '' && token != null) {
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
  }
}
