import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesInvoiceRoutingModule } from './sales-invoice-routing.module';
import { SalesInvoiceListComponent } from './sales-invoice-list/sales-invoice-list.component';
import { SalesInvoiceDetailsComponent } from './sales-invoice-details/sales-invoice-details.component';


@NgModule({
  declarations: [SalesInvoiceListComponent, SalesInvoiceDetailsComponent],
  imports: [
    CommonModule,
    SalesInvoiceRoutingModule
  ]
})
export class SalesInvoiceModule { }
