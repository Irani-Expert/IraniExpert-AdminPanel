import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  token: string;
  constructor(private authenticationService: AuthenticateService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    if (
      this.authenticationService.currentUserValue == null ||
      this.authenticationService.currentUserValue == undefined
    ) {
      this.token = 'anonymous';
    } else {
      this.token = this.authenticationService.currentUserValue.token;
      localStorage.setItem(
        'token',
        this.authenticationService.currentUserValue.token
      );
    }

    const isLoggedIn = this.token;
    const isApiUrl = request.url.startsWith(environment.api.baseUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          // 'Content-Type': 'application/json',
          Authorization: 'Bearer anonymous',
        },
      });
    }

    return next.handle(request);
  }
}
