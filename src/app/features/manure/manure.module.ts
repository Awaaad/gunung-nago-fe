import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManureRoutingModule } from './manure-routing.module';
import { ManureSaleDetailsComponent } from './manure-sale-details/manure-sale-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManureSaleApiService } from 'src/app/shared/apis/manure-sale.api.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MY_FORMATS } from '../report/report.module';
import { ManureStockComponent } from './manure-stock/manure-stock.component';
import { ManureListComponent } from './manure-list/manure-list.component';
import { ManureDetailsComponent } from './manure-details/manure-details.component';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ManureSaleDetailsComponent, ManureStockComponent, ManureListComponent, ManureDetailsComponent
  ],
  imports: [
    CommonModule,
    ManureRoutingModule,
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
  ],
  providers: [CageApiService, CustomerApiService, ManureStockApiService, ManureSaleApiService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class ManureModule { }
