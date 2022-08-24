import { state } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Result } from '../../models/Base/result.model';
import { UserInfoModel } from '../../models/userInfoModel';
import { UserModel } from '../../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private currentUserSubject: BehaviorSubject<UserInfoModel>;
  public currentUser: Observable<UserInfoModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.currentUserSubject = new BehaviorSubject<UserInfoModel>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserInfoModel {
    return this.currentUserSubject.value;
  }

  login(user: UserModel) {
    return this.http
      .post<Result<UserInfoModel>>(
        `${environment.api.baseUrl}/auth/sign-in`,
        user
      )
      .pipe(
        map((user) => {
          if (user.success) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user.data));
            this.currentUserSubject.next(user.data);
            return user;
          } else {
            this.toastr.error('نام کاربری یا رمز عبور اشتباه است ', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            return null;
          }
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/sessions/signin']);
  }
}
