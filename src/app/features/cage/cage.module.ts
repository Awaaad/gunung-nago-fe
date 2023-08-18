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
import { MatTooltipModule } from '@angular/material/tooltip';
import { SurveyApiService } from '../survey/service/api/survey.api.service';
import { ModalModule } from 'src/app/shared/modals/modal.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../report/report.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FlockApiService } from '../flock/service/api/flock.api.service';


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
    MatTooltipModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule
  ],
  providers: [CageApiService, SurveyApiService, FlockApiService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class CageModule { }
