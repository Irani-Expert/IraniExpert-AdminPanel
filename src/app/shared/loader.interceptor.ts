import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfoModel } from './models/userInfoModel';
import { AuthenticateService } from './services/auth/authenticate.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private _authService: AuthenticateService;
  constructor(private loader: NgxSpinnerService) {}


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loader.show();
this.checkUserPermission()
    return next.handle(req).pipe(
      delay(10),
      finalize(() => this.loader.hide())
    );
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
            this._authService.logout()
          }
        });
    }
  }
}
