import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointOfSaleRoutingModule } from './point-of-sale-routing.module';
import { PointOfSaleComponent } from './point-of-sale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EggRoutingModule } from '../egg/egg-routing.module';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { MY_FORMATS } from '../report/report.module';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { SurveyApiService } from 'src/app/shared/apis/survey.api.service';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { FlockStockApiService } from 'src/app/shared/apis/flock-stock.api.service';
import { PointOfSaleApiService } from 'src/app/shared/apis/point-of-sale.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { ReturnApiService } from 'src/app/shared/apis/return.api.service';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { FeedStockApiService } from 'src/app/shared/apis/feed-stock.api.service';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [PointOfSaleComponent],
  imports: [
    CommonModule,
    PointOfSaleRoutingModule,
    CommonModule,
    EggRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  providers: [SalesInvoiceApiService, CustomerApiService, ManureStockApiService, CageApiService, FlockApiService, SurveyApiService, EggStockApiService,
    FlockStockApiService, PointOfSaleApiService, ReturnApiService, FeedApiService, FeedStockApiService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class PointOfSaleModule { }
