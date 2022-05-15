
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  loading: boolean;
  loadingText: string;
  signupForm: FormGroup;
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
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

  this.signupForm = this.fb.group({
      email: ['name@example.com', Validators.required],
      password: ['1234', Validators.required]
  });
  }


  signup() {
    this.loading = true;
    this.loadingText = 'در حال ورود...';
    // this.auth.signin(this.signinForm.value)
    //     .subscribe(res => {
    //         this.router.navigateByUrl('/dashboard/v1');
    //         this.loading = false;
    //     });
}
}
