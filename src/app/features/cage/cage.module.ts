import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CageRoutingModule } from './cage-routing.module';
import { CageSurveyListComponent } from './cage-survey-list/cage-survey-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CageDetailsComponent } from './cage-details/cage-details.component';
import { CageApiService } from './service/api/cage.api.service';
import { CageListComponent } from './cage-list/cage-list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [CageSurveyListComponent, CageDetailsComponent, CageListComponent],
  imports: [
    CommonModule,
    CageRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [CageApiService]
})
export class CageModule { }
