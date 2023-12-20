import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedListComponent } from './feed-list/feed-list.component';
import { FeedDetailsComponent } from './feed-details/feed-details.component';
import { FeedStockComponent } from './feed-stock/feed-stock.component';
import { FeedAllocationComponent } from './feed-allocation/feed-allocation.component';
import { FeedSaleDetailsComponent } from './feed-sale-details/feed-sale-details.component';
import { FeedStockDetailsComponent } from './feed-stock-details/feed-stock-details.component';

const routes: Routes = [
  {
    path: 'feed-list',
    component: FeedListComponent
  },
  {
    path: 'feed-details',
    component: FeedDetailsComponent
  },
  {
    path: 'feed-stock',
    component: FeedStockComponent
  },
  {
    path: 'feed-stock-details/:id',
    component: FeedStockDetailsComponent
  },
  {
    path: 'feed-allocation',
    component: FeedAllocationComponent
  },
  {
    path: 'feed-sale-details',
    component: FeedSaleDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedRoutingModule { }
