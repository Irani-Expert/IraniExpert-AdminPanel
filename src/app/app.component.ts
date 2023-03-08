import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfoModel } from './shared/models/userInfoModel';
import { AuthenticateService } from './shared/services/auth/authenticate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private _authService: AuthenticateService;
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
  }
  checkUserPermission() {
    let currentUser: UserInfoModel = JSON.parse(
      localStorage.getItem('currentUser') ?? '{}'
    );
    if (currentUser.token != undefined) {
      this._authService
        .checkUserPermission(currentUser.token)
        .subscribe((res) => {
          if (!res) {
            localStorage.clear();
            this._authService.logout();
          }
        });
    }
  }
}
