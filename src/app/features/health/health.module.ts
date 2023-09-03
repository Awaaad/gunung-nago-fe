import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthRoutingModule } from './health-routing.module';
import { HealthDetailsComponent } from './health-details/health-details.component';
import { HealthListComponent } from './health-list/health-list.component';
import { HealthStockComponent } from './health-stock/health-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HealthProductApiService } from 'src/app/shared/api/health-product.api.service';
import { HealthProductStockApiService } from 'src/app/shared/api/health-product-stock.api.service';


@NgModule({
  declarations: [HealthDetailsComponent, HealthListComponent, HealthStockComponent],
  imports: [
    CommonModule,
    HealthRoutingModule,
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
  providers: [HealthProductApiService, HealthProductStockApiService]
})
export class HealthModule { }
