import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthRoutingModule } from './health-routing.module';
import { HealthDetailsComponent } from './health-details/health-details.component';
import { HealthListComponent } from './health-list/health-list.component';
import { HealthStockComponent } from './health-stock/health-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { HealthProductStockApiService } from 'src/app/shared/apis/health-product-stock.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaskitoModule } from '@maskito/angular';
import { HealthStockDetailsComponent } from './health-stock-details/health-stock-details.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [HealthDetailsComponent, HealthListComponent, HealthStockComponent, HealthStockDetailsComponent],
  imports: [
    MaskitoModule,
    CommonModule,
    HealthRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
  providers: [HealthProductApiService, HealthProductStockApiService, SupplierApiService]
})
export class HealthModule { }
