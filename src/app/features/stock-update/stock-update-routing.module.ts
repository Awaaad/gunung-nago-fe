import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockUpdateComponent } from './stock-update.component';

const routes: Routes = [
  {
    path: '',
    component: StockUpdateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockUpdateRoutingModule { }
