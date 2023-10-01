import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EggRoutingModule } from './egg-routing.module';
import { EggSaleDetailsComponent } from './egg-sale-details/egg-sale-details.component';


@NgModule({
  declarations: [EggSaleDetailsComponent],
  imports: [
    CommonModule,
    EggRoutingModule
  ]
})
export class EggModule { }
