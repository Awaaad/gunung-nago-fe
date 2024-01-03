import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlockRoutingModule } from './flock-routing.module';
import { FlockListComponent } from './flock-list/flock-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FlockDetailsComponent } from './flock-details/flock-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FlockApiService } from '../../shared/apis/flock.api.service';
import { FlockSaleApiService } from '../../shared/apis/flock-sale.api.service';
import { FlockSaleDetailsComponent } from './flock-sale-details/flock-sale-details.component';
import { SurveyApiService } from '../../shared/apis/survey.api.service';
import { CageApiService } from '../../shared/apis/cage.api.service';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ConstantHelper } from 'src/app/shared/helpers/constant.helper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlockStockComponent } from './flock-stock/flock-stock.component';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { FlockStockApiService } from 'src/app/shared/apis/flock-stock.api.service';
import { FlockTransferComponent } from './flock-transfer/flock-transfer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlockCageCategoryTransferComponent } from './flock-cage-category-transfer/flock-cage-category-transfer.component';
import { FlockStockDetailsComponent } from './flock-stock-details/flock-stock-details.component';
import { MatRadioModule } from '@angular/material/radio';
import { FlockStockEditDetailsComponent } from './flock-stock-edit-details/flock-stock-edit-details.component';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
export const MY_FORMATS = ConstantHelper.dateFormat;

@NgModule({
  declarations: [FlockListComponent, FlockStockEditDetailsComponent, FlockDetailsComponent, FlockSaleDetailsComponent, FlockStockComponent, FlockTransferComponent, FlockCageCategoryTransferComponent, FlockStockDetailsComponent],
  imports: [
    CommonModule,
    FlockRoutingModule,
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
    DragDropModule,
    MatRadioModule
  ],
  providers: [ManureStockApiService, HealthProductApiService, EggCategoryApiService, FlockApiService, FlockSaleApiService, SurveyApiService, CageApiService, CustomerApiService, SupplierApiService, FlockStockApiService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class FlockModule { }
