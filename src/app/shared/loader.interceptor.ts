import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticateService } from './services/auth/authenticate.service';
import { UsersService } from '../views/sec/user-mangement/users.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private _authService: AuthenticateService;
  constructor(
    private loader: NgxSpinnerService,
    private _userService: UsersService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let dontSpin: boolean;
    dontSpin =
      req.url.includes('https://dl.iraniexpert.com/fileUploader') ||
      req.url.includes('/IndicatorValue/AddUpdate') ||
      req.url.includes('https://climax.iraniexpert.ir/api/Test/TelegramCal');
    if (!dontSpin) {
      this.loader.show();
      // if (AppComponent.isLoggedIn) {
      //   this.checkUserPermission();
      // }
      return next.handle(req).pipe(finalize(() => this.loader.hide()));
    } else {
      return next.handle(req);
    }
  }
  // checkUserPermission() {
  //   // if (currentUser.token != undefined) {
  //   this._userService.getUserByToken().subscribe((res) => {
  //     if (!res) {
  //       localStorage.clear();
  //       this._authService.logout();
  //     }
  //   });
  //   // }
  // }
}
