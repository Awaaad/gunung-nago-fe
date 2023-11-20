import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesInvoiceListComponent } from './sales-invoice-list/sales-invoice-list.component';
import { SalesInvoiceDetailsComponent } from './sales-invoice-details/sales-invoice-details.component';
import { SalesInvoiceCustomerCreditListComponent } from './sales-invoice-customer-credit-list/sales-invoice-customer-credit-list.component';

const routes: Routes = [
  {
    path: 'sales-invoice-list',
    component: SalesInvoiceListComponent
  },
  {
    path: 'sales-invoice-details/:salesInvoiceId',
    component: SalesInvoiceDetailsComponent
  },
  {
    path: 'sales-invoice-customer-credit-list/:customerId',
    component: SalesInvoiceCustomerCreditListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesInvoiceRoutingModule { }
