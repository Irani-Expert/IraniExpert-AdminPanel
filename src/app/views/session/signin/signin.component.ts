import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ResolveEnd,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(700, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class SigninComponent implements OnInit {
  backUrl: string = '';
  loading: boolean;
  loadingText: string;
  signinForm: FormGroup;
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthenticateService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (
        event instanceof RouteConfigLoadStart ||
        event instanceof ResolveStart
      ) {
        this.loadingText = 'Loading Dashboard Module...';

        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }
    });

    this.signinForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  signin() {
    this.loading = true;
    this.loadingText = 'در حال ورود...';
    this.auth.login(this.signinForm.value).subscribe(
      (res) => {
        this.router.navigateByUrl('dashboard/v1');
        this.loading = false;
        if (!res.success) {
          this.loading = false;
          this.toastr.error(res.message, null, {
            positionClass: 'toast-top-left',
          });
        }
      },
      (err) => {
        this.loading = false;
        this.toastr.error('لطفا دوباره تلاش کنید', null, {
          positionClass: 'toast-top-left',
        });
      }
    );
  }
}
