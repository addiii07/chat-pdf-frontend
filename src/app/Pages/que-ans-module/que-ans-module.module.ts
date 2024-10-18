import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { QueAnsModuleRoutingModule } from './que-ans-module-routing.module';
import { QuesAnsComponent } from './ques-ans/ques-ans.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    QuesAnsComponent
  ],
  imports: [
    CommonModule,
    QueAnsModuleRoutingModule,
    NgxSpinnerModule,
    FormsModule 
  ]
})
export class QueAnsModuleModule { }
