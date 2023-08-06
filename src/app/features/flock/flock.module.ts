import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlockRoutingModule } from './flock-routing.module';
import { FlockListComponent } from './flock-list/flock-list.component';


@NgModule({
  declarations: [FlockListComponent],
  imports: [
    CommonModule,
    FlockRoutingModule
  ]
})
export class FlockModule { }
