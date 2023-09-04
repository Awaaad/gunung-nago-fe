import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedListComponent } from './feed-list/feed-list.component';
import { FeedDetailsComponent } from './feed-details/feed-details.component';
import { FeedStockComponent } from './feed-stock/feed-stock.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedRoutingModule { }
