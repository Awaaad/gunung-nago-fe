import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
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
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { CustomerStatementOfAccountComponent } from './customer-statement-of-account/customer-statement-of-account.component';
import { FileApiService } from 'src/app/shared/apis/file.api.service';


@NgModule({
  declarations: [CustomerDetailsComponent, CustomerListComponent, CustomerStatementOfAccountComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
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
  providers: [CustomerApiService, SalesInvoiceApiService, FileApiService]
})
export class CustomerModule { }
