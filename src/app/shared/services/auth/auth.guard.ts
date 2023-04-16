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
import { NavigationService } from '../navigation.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticateService,
    private navService: NavigationService,
    private toastr: ToastrService
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    let valid: boolean = false;
    if (currentUser) {
      let index: number;
      let indexOfElement = this.navService.defaultMenu.findIndex(
        (item) => item.state == state.url
      );
      index = currentUser.privileges.findIndex(
        (priv) => priv == this.navService.defaultMenu[indexOfElement].privilege
      );
      if (index == -1) {
        this.toastr.error('', 'عدم دسترسی به بخش مورد نظر', {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
        valid = false;
      } else {
        valid = true;
      }
      return valid;
    }

    this.router.navigate(['/sessions/signin'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
