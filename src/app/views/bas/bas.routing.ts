import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/services/auth/auth.guard";
import { GroupComponent } from "./group/group.component";



const routes: Routes = [
  {
    path: 'group/:pageIndex',
    component: GroupComponent,
    canActivate: [AuthGuard]
  }
,
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class BasRoutingModule { }
