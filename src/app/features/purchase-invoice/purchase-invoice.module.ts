import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { PurchaseInvoiceListComponent } from './purchase-invoice-list/purchase-invoice-list.component';
import { PurchaseInvoiceDetailsComponent } from './purchase-invoice-details/purchase-invoice-details.component';


@NgModule({
  declarations: [PurchaseInvoiceListComponent, PurchaseInvoiceDetailsComponent],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule
  ]
})
export class PurchaseInvoiceModule { }
