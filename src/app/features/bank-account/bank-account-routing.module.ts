import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAccountDetailsComponent } from './bank-account-details/bank-account-details.component';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';

const routes: Routes = [
  {
    path: 'bank-account-list',
    component: BankAccountListComponent
  },
  {
    path: 'bank-account-details',
    component: BankAccountDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule { }
