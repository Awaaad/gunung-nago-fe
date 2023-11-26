import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EggRoutingModule } from './egg-routing.module';
import { EggSaleDetailsComponent } from './egg-sale-details/egg-sale-details.component';
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
import { EggSaleApiService } from 'src/app/shared/apis/egg-sale.api.service';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { EggTransferComponent } from './egg-transfer/egg-transfer.component';
import { EggStockComponent } from './egg-stock/egg-stock.component';
import { EggReportComponent } from './egg-report/egg-report.component';
import { ReportApiService } from 'src/app/shared/apis/report.api.service';
import { EggCategoryDetailsComponent } from './egg-category-details/egg-category-details.component';
import { EggCategoryListComponent } from './egg-category-list/egg-category-list.component';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';


@NgModule({
  declarations: [EggSaleDetailsComponent, EggTransferComponent, EggStockComponent, EggReportComponent, EggCategoryDetailsComponent, EggCategoryListComponent],
  imports: [
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
  ],
  providers: [CustomerApiService, EggCategoryApiService, EggStockApiService, EggSaleApiService, SecurityApiService, ReportApiService]
})
export class EggModule { }
