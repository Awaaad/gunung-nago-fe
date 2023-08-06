import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CageRoutingModule } from './cage-routing.module';
import { CageListComponent } from './cage-list/cage-list.component';


@NgModule({
  declarations: [CageListComponent],
  imports: [
    CommonModule,
    CageRoutingModule
  ]
})
export class CageModule { }
