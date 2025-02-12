import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from './views/sec/user-mangement/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  token = '';
  static isLoggedIn = false;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private _userService: UsersService,
    private toastr: ToastrService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
    // let token = '';
    // token = localStorage.getItem('token');
    let subscriber = this.router.events
      .pipe(takeUntil(new Subject()))
      .subscribe({
        next: (event) => {
          if (event instanceof Scroll) {
            if (event.routerEvent instanceof NavigationEnd) {
              let url = event.routerEvent.urlAfterRedirects;
              if (url.includes('checkUserPermission')) {
                console.log('not The first time');
              } else {
                this.checkUser();
              }
            }
          }
        },
      });

    // if (token !== '' && token != null) {
    // this._userService
    //   .getUserByToken()
    //   .subscribe((res: Result<UserInforamationModel>) => {
    //     if (!res.success) {
    //       localStorage.removeItem('currentUser');
    //       this.toastr.error(res.message, null, {
    //         closeButton: true,
    //         positionClass: 'toast-top-left',
    //       });
    //       setTimeout(() => {
    //         this.router.navigate(['/sessions/signin']);
    //       }, 1000);
    //     }
    //   });
    // }
  }
  checkUser() {
    this._userService.getUserByToken().subscribe({
      next: (res) => {
        if (res.success) {
          AppComponent.isLoggedIn = true;
        }
        if (!res.success) {
          localStorage.removeItem('currentUser');
          this.toastr.error(res.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.router.navigate(['/sessions/signin']);
        }
      },
      error: (err) => {
        if (localStorage.getItem('currentUser')) {
          localStorage.removeItem('currentUser');
        }
        this.toastr.error(
          'دوباره تلاش کنید و در صورت خطا با پشتیبانی سایت ارتباط بگیرید',
          'مشکل در ارتباط با سرور!',
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
        this.router.navigate(['/sessions/signin']);
      },
    });
  }

  ngAfterViewInit() {}
}
