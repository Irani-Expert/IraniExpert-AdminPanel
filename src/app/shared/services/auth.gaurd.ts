import { NgxSpinnerService } from 'ngx-spinner';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private _spinner: NgxSpinnerService) { }
  private sessionVariables: Map<string, string> = new Map<string, string>();

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let permissions = route.data.permission as string;
    return this.authService.isAuthenticated(permissions)
      .then(
        (authenticated: boolean) => {
          if (authenticated) {
            return true;

          } else {
            this.router.navigate(['/session/403']);
          }
        }
      );
  }

  canActivateChild(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
