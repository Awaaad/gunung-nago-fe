import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FeedDetailsComponent } from './feed-details/feed-details.component';
import { FeedListComponent } from './feed-list/feed-list.component';
import { FeedStockComponent } from './feed-stock/feed-stock.component';
import { FeedApiService } from 'src/app/shared/api/feed.api.service';
import { FeedStockApiService } from 'src/app/shared/api/feed-stock.api.service';


@NgModule({
  declarations: [FeedDetailsComponent, FeedListComponent, FeedStockComponent],
  imports: [
    CommonModule,
    FeedRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule
  ],
  providers: [FeedApiService, FeedStockApiService]
})
export class FeedModule { }
