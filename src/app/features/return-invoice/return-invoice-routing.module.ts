import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnInvoiceComponent } from './return-invoice.component';

const routes: Routes = [
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
