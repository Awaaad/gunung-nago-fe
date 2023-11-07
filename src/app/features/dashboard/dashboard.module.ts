import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { IonicModule } from '@ionic/angular';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { PurchaseInvoiceApiService } from 'src/app/shared/apis/purchase-invoice.api.service';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    IonicModule
  ],
  providers: [PurchaseInvoiceApiService, SalesInvoiceApiService, FlockApiService, EggStockApiService]
})
export class DashboardModule { }
