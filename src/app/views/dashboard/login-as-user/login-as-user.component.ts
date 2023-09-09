import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';

@Component({
  selector: 'app-login-as-user',
  templateUrl: './login-as-user.component.html',
  styleUrls: ['./login-as-user.component.scss'],
})
export class LoginAsUserComponent implements OnInit {
  token: string ='';
  constructor(
    private _route: ActivatedRoute,
    private auth: AuthenticateService,
    private router: Router
  ) {
    this._route.queryParams.subscribe(params => {
      this.token = params['token'];
  }) ?? null;
  }

  ngOnInit(): void {
    this.auth.checkUserPermission(this.token).subscribe((res) => {
      if (res) this.router.navigateByUrl('/dashboard/v1');
      else if (!res) {
        this.router.navigate(['/sessions/signin']);
      }
    });
  }
}
