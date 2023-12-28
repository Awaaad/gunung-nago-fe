import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReturnInvoiceComponent } from './return-invoice.component';
import { ReturnInvoiceRoutingModule } from './return-invoice-routing.module';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { ReturnApiService } from 'src/app/shared/apis/return.api.service';
import { PaymentApiService } from 'src/app/shared/apis/payment.api.service';
import { ReturnInvoiceDetailsComponent } from './return-invoice-details/return-invoice-details.component';
import { ReturnInvoiceListComponent } from './return-invoice-list/return-invoice-list.component';
import { FileApiService } from 'src/app/shared/apis/file.api.service';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';
import { FeedStockApiService } from 'src/app/shared/apis/feed-stock.api.service';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';

@NgModule({
  declarations: [ReturnInvoiceComponent, ReturnInvoiceListComponent, ReturnInvoiceDetailsComponent],
  imports: [
    CommonModule,
    ReturnInvoiceRoutingModule,
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
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  providers: [SalesInvoiceApiService, FlockApiService, EggCategoryApiService, FeedStockApiService, TranslateService, ReturnApiService, PaymentApiService, FileApiService]
})
export class ReturnInvoiceModule { }
