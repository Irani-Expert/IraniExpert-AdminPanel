import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';

 const SessionRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '404',
      component: NotFoundComponent
    }, {
      path: '401',
      component: ErrorComponent
    },  {
      path: 'lockscreen',
      component: LockscreenComponent
    }, {
      path: 'signin',
      component: SigninComponent
    }, {
      path: 'signup',
      component: SignupComponent
    },
  ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(SessionRoutes),
  ],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
