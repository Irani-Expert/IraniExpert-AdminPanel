import { Injectable, Input } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticateService
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      // if (currentUser.privileges.find((item) => item !== privilege)) {
      //   return false;
      // }
      // logged in so return true

      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/sessions/signin'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
