import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { PurchaseInvoiceListComponent } from './purchase-invoice-list/purchase-invoice-list.component';
import { PurchaseInvoiceDetailsComponent } from './purchase-invoice-details/purchase-invoice-details.component';
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
import { PurchaseInvoiceApiService } from 'src/app/shared/apis/purchase-invoice.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [PurchaseInvoiceListComponent, PurchaseInvoiceDetailsComponent],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule,
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
  providers: [PurchaseInvoiceApiService, SecurityApiService, SupplierApiService]
})
export class PurchaseInvoiceModule { }
