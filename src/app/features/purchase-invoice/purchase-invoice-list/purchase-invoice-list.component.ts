import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SalesInvoiceDto, PaymentDto, PaymentType, SupplierDto, PurchaseInvoiceDto, PurchaseInvoiceType } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { PurchaseInvoiceApiService } from 'src/app/shared/apis/purchase-invoice.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-invoice-list',
  templateUrl: './purchase-invoice-list.component.html',
  styleUrls: ['./purchase-invoice-list.component.scss'],
})
export class PurchaseInvoiceListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public supplierEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['number', 'purchaseInvoiceType', 'supplier', 'createdBy', 'createdDate', 'totalPrice'];
  public purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>;
  private infinitePurchaseInvoices: PurchaseInvoiceDto[] = [];
  public purchaseInvoiceSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'desc';
  public sortBy: string = 'createdDate';
  public invoiceNumber: string = '';
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
    private purchaseInvoiceApiService: PurchaseInvoiceApiService,
    private router: Router,
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

  public searchByInvoiceNumber(invoiceNumber: any): void {
    this.purchaseInvoiceSearchSubscription.unsubscribe();
    this.purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>;
    this.page = 0;
    this.invoiceNumber = invoiceNumber;
    this.search();
  }

  public routeToPurchaseInvoiceDetails(purchaseInvoiceDto: PurchaseInvoiceDto): void {
    console.log(purchaseInvoiceDto)
    if (purchaseInvoiceDto.purchaseInvoiceType === PurchaseInvoiceType.HEALTH_PRODUCT) {
      this.router.navigate([`purchase-invoice/purchase-invoice-details/${PurchaseInvoiceType.HEALTH_PRODUCT}/${purchaseInvoiceDto.id}`]);
    } else if (purchaseInvoiceDto.purchaseInvoiceType === PurchaseInvoiceType.FEED) {
      this.router.navigate([`purchase-invoice/purchase-invoice-details/${PurchaseInvoiceType.FEED}/${purchaseInvoiceDto.id}`]);
    }
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infinitePurchaseInvoices = [];
      this.purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>([]);
    }
    const purchaseInvoiceSearchCriteriaDto = {
      invoiceNumber: this.invoiceNumber,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.purchaseInvoiceSearchSubscription = this.purchaseInvoiceApiService.search(purchaseInvoiceSearchCriteriaDto).subscribe(purchaseInvoices => {
      this.infinitePurchaseInvoices = [...this.infinitePurchaseInvoices, ...purchaseInvoices.content];
      this.purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>(this.infinitePurchaseInvoices);

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

