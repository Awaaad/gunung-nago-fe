import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerStatementOfAccountComponent } from './customer-statement-of-account/customer-statement-of-account.component';

const routes: Routes = [
  {
    path: 'customer-list',
    component: CustomerListComponent
  },
  {
    path: 'customer-details',
    component: CustomerDetailsComponent
  },
  {
    path: 'customer-statement-of-account/:customerId',
    component: CustomerStatementOfAccountComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
