import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnInvoiceComponent } from './return-invoice.component';
import { ReturnInvoiceListComponent } from './return-invoice-list/return-invoice-list.component';
import { ReturnInvoiceDetailsComponent } from './return-invoice-details/return-invoice-details.component';

const routes: Routes = [
  {
    path: 'return-invoice-list',
    component: ReturnInvoiceListComponent
  },
  {
    path: 'return-invoice-details/:id',
    component: ReturnInvoiceDetailsComponent
  },
  {
    path: ':id',
    component: ReturnInvoiceComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnInvoiceRoutingModule { }
