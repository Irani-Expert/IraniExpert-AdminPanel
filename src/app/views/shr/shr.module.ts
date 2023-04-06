import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNeedComponent } from './user-need/user-need.component';
import { ShrRoutingModule } from './shr.routing';
import { UserWantsPipe } from 'src/app/shared/pipes/user-wants.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UserCommentComponent } from './user-comment/user-comment.component';
import { AllCommentComponent } from './all-comment/all-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { NotesComponent } from './notes/notes.component';
import { JalaliPipe } from 'src/app/shared/pipes/jalali-time.pipe';

@NgModule({
  declarations: [
    UserNeedComponent,
    JalaliPipe,
    UserWantsPipe,
    UserCommentComponent,
    AllCommentComponent,
    NotesComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ShrRoutingModule,
    NgbModule,
    NgxPaginationModule,
    SharedPipesModule,
    SharedDirectivesModule,
    PerfectScrollbarModule,
    FormsModule,
  ],
})
export class ShrModule {}
