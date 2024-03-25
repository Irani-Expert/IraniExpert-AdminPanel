import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { delay, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfoModel } from './models/userInfoModel';
import { AuthenticateService } from './services/auth/authenticate.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private _authService: AuthenticateService;
  constructor(private loader: NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let dontSpin: boolean;
    dontSpin =
      req.url.includes('https://dl.iraniexpert.com/fileUploader') ||
      req.url.includes('/IndicatorValue/AddUpdate') ||
      req.url.includes('https://climax.iraniexpert.ir/api/Test/TelegramCal');
    if (!dontSpin) {
      this.loader.show();
      //this.checkUserPermission()
      return next.handle(req).pipe(
        delay(100),
        finalize(() => this.loader.hide())
      );
    } else {
      return next.handle(req);
    }
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
