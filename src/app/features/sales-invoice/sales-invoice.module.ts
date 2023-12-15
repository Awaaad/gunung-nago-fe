import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesInvoiceRoutingModule } from './sales-invoice-routing.module';
import { SalesInvoiceListComponent } from './sales-invoice-list/sales-invoice-list.component';
import { SalesInvoiceDetailsComponent } from './sales-invoice-details/sales-invoice-details.component';
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
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { ReceiptApiService } from 'src/app/shared/apis/receipt.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { FileApiService } from 'src/app/shared/apis/file.api.service';
import { MatMenuModule } from '@angular/material/menu';
import { PaymentApiService } from 'src/app/shared/apis/payment.api.service';
import { SalesInvoiceCustomerCreditListComponent } from './sales-invoice-customer-credit-list/sales-invoice-customer-credit-list.component';
import { MatIconModule } from '@angular/material/icon';
import { SalesInvoiceByTypeListComponent } from './sales-invoice-by-type-list/sales-invoice-by-type-list.component';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';

@NgModule({
  declarations: [SalesInvoiceListComponent, SalesInvoiceDetailsComponent, SalesInvoiceCustomerCreditListComponent, SalesInvoiceByTypeListComponent],
  imports: [
    CommonModule,
    SalesInvoiceRoutingModule,
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
    MatMenuModule,
    MatIconModule
  ],
  providers: [SalesInvoiceApiService, ReceiptApiService, SecurityApiService, FileApiService, PaymentApiService, ManureStockApiService, EggCategoryApiService, CustomerApiService]
})
export class SalesInvoiceModule { }
