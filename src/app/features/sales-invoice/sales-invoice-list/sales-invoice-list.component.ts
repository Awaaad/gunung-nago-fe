import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentDto, PaymentType, SalesInvoiceDto, SupplierDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';

@Component({
  selector: 'app-sales-invoice-list',
  templateUrl: './sales-invoice-list.component.html',
  styleUrls: ['./sales-invoice-list.component.scss'],
})
export class SalesInvoiceListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public supplierEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['id', 'name', 'createdBy', 'salesInvoiceType', 'createdDate', 'totalPrice', 'amountPaid', 'amountDue'];
  public salesInvoices = new MatTableDataSource<SalesInvoiceDto>;
  private infiniteSalesInvoices: SalesInvoiceDto[] = [];
  public salesInvoiceSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public customerName: string = '';
  public isModalOpen: boolean = false;
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    email: [
      { type: 'required', message: 'Last Name is required' },
    ],
    telephoneNumber: [
      { type: 'required', message: 'Telephone Number is required' },
    ],
  };

  constructor(
    private salesInvoiceApiService: SalesInvoiceApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchByCustomerName(customerName: any): void {
    this.salesInvoiceSearchSubscription.unsubscribe();
    this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>;
    this.page = 0;
    this.customerName = customerName;
    this.search();
  }


  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteSalesInvoices = [];
      this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>([]);
    }
    const salesInvoiceSearchCriteriaDto = {
      customerName: this.customerName,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.salesInvoiceSearchSubscription = this.salesInvoiceApiService.search(salesInvoiceSearchCriteriaDto).subscribe(salesInvoices => {
      this.infiniteSalesInvoices = [...this.infiniteSalesInvoices, ...salesInvoices.content];
      this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>(this.infiniteSalesInvoices);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.search(event, true);
    }, 500);
  }

  onScroll(event: any) {
    event.returnValue = false;
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction.toUpperCase();

    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    })
  }

  public getTotalAmountPaid(paymentDto: PaymentDto[]): number {
    let sum = 0;
    paymentDto.forEach(payment => {
      if (payment.paymentType !== PaymentType.CREDIT)
        sum = sum + payment.amountPaid;
    })
    return sum;
  }

  public initialiseSupplierEditForm(supplierDetails: SupplierDto): void {
    this.supplierEditForm = new FormGroup({
      id: new FormControl({ value: supplierDetails.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: supplierDetails.name, disabled: false }, Validators.compose([Validators.required])),
      email: new FormControl({ value: supplierDetails.email, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: supplierDetails.address, disabled: false }),
      telephoneNumber: new FormControl({ value: supplierDetails.telephoneNumber, disabled: false }, Validators.compose([Validators.required]))
    })
  }

  public openModal(element: SupplierDto): void {
    this.initialiseSupplierEditForm(element);
    this.isModalOpen = true;
  }

  public cancel(): void {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }

  public confirm(): void {
    this.modal.dismiss(null, 'confirm');
  }

  public onWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isModalOpen = false;
      this.edit();
    }
  }

  public edit(): void {
    this.utilsService.presentLoading();
    // this.supplierApiService.edit(this.supplierEditForm.value).subscribe({
    //   next: (data: string) => {
    //     this.supplierEditForm.reset();
    //     this.utilsService.dismissLoading();
    //     this.utilsService.successMsg('Supplier successfully edited');
    //     this.search();
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.utilsService.dismissLoading();
    //     this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
    //   }
    // });
  }
}

