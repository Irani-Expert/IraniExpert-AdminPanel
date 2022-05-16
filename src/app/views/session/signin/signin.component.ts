
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  signinForm: FormGroup;
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth:AuthenticateService
) { }

   ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
          this.loadingText = 'Loading Dashboard Module...';

          this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
          this.loading = false;
      }
  });

  this.signinForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
  });
  }


  signin() {
    this.loading = true;
    this.loadingText = 'در حال ورود...';
    this.auth.login(this.signinForm.value)
        .subscribe(res => {
            this.router.navigateByUrl('/dashboard/v1');
            this.loading = false;
        });
}
}
