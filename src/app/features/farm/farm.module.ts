import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmRoutingModule } from './farm-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FarmApiService } from 'src/app/shared/apis/farm.api.service';
import { MY_FORMATS } from '../report/report.module';
import { FarmDetailsComponent } from './farm-details/farm-details.component';
import { FarmListComponent } from './farm-list/farm-list.component';


@NgModule({
  declarations: [FarmDetailsComponent, FarmListComponent],
  imports: [
    CommonModule,
    FarmRoutingModule,
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
  providers: [FarmApiService, {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class FarmModule { }
