import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuesAnsComponent } from './ques-ans/ques-ans.component';

const routes: Routes = [
  {
    path: '',
    component: QuesAnsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueAnsModuleRoutingModule { }
