import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockUpdateRoutingModule } from './stock-update-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HealthProductStockApiService } from 'src/app/shared/apis/health-product-stock.api.service';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { MaskitoModule } from '@maskito/angular';
import { StockUpdateComponent } from './stock-update.component';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { PurchaseApiService } from 'src/app/shared/apis/purchase.api.service';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [StockUpdateComponent],
  imports: [
    MaskitoModule,
    CommonModule,
    StockUpdateRoutingModule,
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
  providers: [HealthProductApiService, HealthProductStockApiService, FeedApiService, SupplierApiService, PurchaseApiService]
})
export class StockUpdateModule { }
