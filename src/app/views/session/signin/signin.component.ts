
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  guid: "";
  loginResult:boolean;
  public form: FormGroup;
  constructor(private fb: FormBuilder,private _route: ActivatedRoute, private _router: Router, private authService: AuthService, private _titleService: Title, private route: ActivatedRoute) {
    this._titleService.setTitle("جذب و استخدام | ورود");
  }

   ngOnInit() {
    let loginResult: boolean;
    this.route.params.subscribe(
      async params => {
      //  await this.authService.getUserPermission(params['Guid'],params['OrgId']).then(response=>{
      //     environment.userGuid=params['Guid'];
      //     this._router.navigate(['']).then(()=>{
      //       window.location.reload();
      //     });

        // })
      }
    );
  }


  // async getUserpermissions(guid): Promise<any> {
  //   return  await this.authService.getUserPermission(guid)
  //   .toPromise()
  //   .then((res) => {
  //     this.loginResult = res;
  //   });
  // }

  // getEducationList(guid): Observable<boolean> {
  //   return this.authService.getUserPermission(guid)
  // }
}
