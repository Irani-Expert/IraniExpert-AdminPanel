
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from 'src/app/shared/services/auth.service';


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
    private auth: AuthService,
    private router: Router
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
      email: ['name@example.com', Validators.required],
      password: ['1234', Validators.required]
  });
  }


  signin() {
    this.loading = true;
    this.loadingText = 'در حال ورود...';
    // this.auth.signin(this.signinForm.value)
    //     .subscribe(res => {
    //         this.router.navigateByUrl('/dashboard/v1');
    //         this.loading = false;
    //     });
}
}
