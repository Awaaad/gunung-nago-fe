import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CageRoutingModule } from './cage-routing.module';
import { CageSurveyListComponent } from './cage-survey-list/cage-survey-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CageDetailsComponent } from './cage-details/cage-details.component';
import { CageApiService } from './service/api/cage.api.service';


@NgModule({
  declarations: [CageSurveyListComponent, CageDetailsComponent],
  imports: [
    CommonModule,
    CageRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CageApiService]
})
export class CageModule { }
