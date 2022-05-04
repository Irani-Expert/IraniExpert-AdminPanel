import { SessionRoutingModule } from './session.routing';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import{MatIconModule} from '@angular/material/icon';
import{MatCardModule} from '@angular/material/card';
import{MatInputModule} from '@angular/material/input';
import{MatCheckboxModule} from '@angular/material/checkbox';
import{MatButtonModule} from '@angular/material/button';

// import{MatIconModule,MatCardModule,MatInputModule,MatCheckboxModule,MatButtonModule} from '@angular/material'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';

import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  imports: [
    CommonModule,
    SessionRoutingModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NotFoundComponent,
    ErrorComponent,
    LockscreenComponent,
    SigninComponent,
    SignUpComponent,
  ]
})

export class SessionModule {}
