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
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { FeedStockApiService } from 'src/app/shared/apis/feed-stock.api.service';
import { FeedAllocationComponent } from './feed-allocation/feed-allocation.component';
import { FlockFeedLineApiService } from 'src/app/shared/apis/flock-feed-line.api.service';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MaskitoModule } from '@maskito/angular';


@NgModule({
  declarations: [FeedDetailsComponent, FeedListComponent, FeedStockComponent, FeedAllocationComponent],
  imports: [
    MaskitoModule,
    CommonModule,
    FeedRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [FeedApiService, FeedStockApiService, FlockFeedLineApiService, SupplierApiService]
})
export class FeedModule { }
