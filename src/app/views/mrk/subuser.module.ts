import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
// import { JalaliPipe } from 'src/app/shared/pipes/jalali-time.pipe';
import { SubuserRoutingModule } from './subuser.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {OrganizationChartModule} from 'primeng/organizationchart';
import { HttpClientModule } from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import { SubUserComponent } from './sub-user/sub-user.component';
import {AccordionModule} from 'primeng/accordion';
import { DragScrollModule } from 'ngx-drag-scroll';
//accordion and accordion tab
import {MenuItem} from 'primeng/api';    
@NgModule({
  declarations: [SubUserComponent,],
  imports: [
    AccordionModule,
    DragScrollModule,
    CommonModule,
    SubuserRoutingModule,
    NgbModule,
    FormsModule,
    ToastModule,
    ReactiveFormsModule,
    OrganizationChartModule,
    HttpClientModule,

 
  ]
})
export class SubuserModule { }
