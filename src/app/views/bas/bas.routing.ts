import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GroupComponent } from "./group/group.component";



const routes: Routes = [
  {
    path: 'group',
    component: GroupComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class BasRoutingModule { }
