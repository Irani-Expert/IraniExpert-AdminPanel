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

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loader: NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loader.show();

    return next.handle(req).pipe(
      delay(10),
      finalize(() => this.loader.hide())
    );
  }
}
