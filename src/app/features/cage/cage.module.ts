import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CageRoutingModule } from './cage-routing.module';
import { CageListComponent } from './cage-list/cage-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CageListComponent],
  imports: [
    CommonModule,
    CageRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ]
})
export class CageModule { }
