import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountDto, PaymentDto, PaymentModeDto, SalesInvoiceCategory, SalesInvoiceDto, SalesInvoiceStatus, SalesInvoiceType, UserDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { Router } from '@angular/router';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SalesInvoiceSettleCreditPaymentFrontDto } from 'generated-src/model-front';
import { PaymentApiService } from 'src/app/shared/apis/payment.api.service';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';

@Component({
  selector: 'app-sales-invoice-list',
  templateUrl: './sales-invoice-list.component.html',
  styleUrls: ['./sales-invoice-list.component.scss'],
})
export class SalesInvoiceListComponent {
  @ViewChild('picker') picker: any;
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['id', 'name', 'createdBy', 'createdDate', 'category', 'driver', 'totalPrice', 'soldAt', 'amountPaid', 'amountDue', 'status', 'actions'];
  public salesInvoices = new MatTableDataSource<SalesInvoiceDto>;
  private infiniteSalesInvoices: SalesInvoiceDto[] = [];
  public salesInvoiceSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 50;
  public sortOrder: string = 'desc';
  public sortBy: string = 'createdDate';
  public customerName: string = '';
  public dateFrom: Date | any = null;
  public dateTo: Date | any = null;
  public usernames: string[] = [];
  public username: string = '';
  public drivers: UserDto[] = [];
  public selectedDriverId: number | any = '0';
  public salesInvoiceTypes: string[] = [];
  public salesInvoiceType: SalesInvoiceType | string = '';
  public salesInvoiceStatuses: string[] = [];
  public salesInvoiceStatus: SalesInvoiceStatus | string = '';
  public salesInvoiceCategories: string[] = [];
  public salesInvoiceCategory: SalesInvoiceCategory | string = '';
  public isStatusModalOpen: boolean = false;
  public selectedInvoice!: SalesInvoiceDto;
  public selectedStatus!: SalesInvoiceStatus | null;
  public today: Date = new Date();
  public paymentForm!: FormGroup;
  private salesInvoiceSettleCreditPaymentFrontDto!: SalesInvoiceSettleCreditPaymentFrontDto;
  public amountDue!: number;

  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];

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
    amountPaid: [
      { type: 'required', message: 'Amount paid is required' },
      { type: 'min', message: 'Amount paid cannot be less than 0' },
      { type: 'max', message: 'Amount paid cannot be more than Sold at' }
    ],
    totalPrice: [
      { type: 'required', message: 'Total price is required' },
    ],
    soldAt: [
      { type: 'required', message: 'Sold at is required' },
      { type: 'min', message: 'Sold at cannot be less than 0' },
      { type: 'max', message: 'Sold at cannot be more than Total Price' },
    ],
    paymentModeId: [
      { type: 'required', message: 'Payment mode is required' },
    ],
    minValue: [
      { type: 'min', message: 'Value cannot be less than 0' }
    ],
    maxValue: [
      { type: 'max', message: 'Value cannot be greater than quantity in stock' }
    ],
    bankAccountId: [
      { type: 'required', message: 'Bank account is required' },
    ]
  };

  constructor(
    private salesInvoiceApiService: SalesInvoiceApiService,
    private paymentApiService: PaymentApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private securityApiService: SecurityApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private bankAccountApiService: BankAccountApiService,
    private paymentModeApiService: PaymentModeApiService
  ) {
  }

  ionViewWillEnter(): void {
    this.isStatusModalOpen = false;
    this.salesInvoiceTypes = Object.keys(SalesInvoiceType);
    this.salesInvoiceStatuses = Object.keys(SalesInvoiceStatus);
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
    this.getAllPaymentModes();
    this.getAllBankAccounts();
    this.getAllUsernames();
    this.getAllDrivers();
    this.search();
  }

  public getAllPaymentModes() {
    this.paymentModeApiService.findAll().subscribe(paymentModes => {
      this.paymentModes = paymentModes;
    })
  }

  public getAllBankAccounts() {
    this.bankAccountApiService.findAll().subscribe(bankAccounts => {
      this.bankAccounts = bankAccounts;
    })
  }


  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getAllUsernames(): void {
    this.securityApiService.getAllUsernames().subscribe(usernames => {
      this.usernames = usernames;
    })
  }

  private getAllDrivers(): void {
    this.securityApiService.getAllDrivers().subscribe(drivers => {
      this.drivers = drivers;
    })
  }

  public searchByCustomerName(customerName: any): void {
    this.salesInvoiceSearchSubscription.unsubscribe();
    this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>;
    this.page = 0;
    this.customerName = customerName;
    this.search();
  }

  public ionChangeType(event: any): void {
    this.salesInvoiceType = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeStatus(event: any): void {
    this.salesInvoiceStatus = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeCategory(event: any): void {
    this.salesInvoiceCategory = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeUsername(event: any): void {
    this.username = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeDriver(event: any): void {
    this.selectedDriverId = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public routeToSalesInvoiceDetails(salesInvoiceDto: SalesInvoiceDto): void {
    this.router.navigate([`sales-invoice/sales-invoice-details/${salesInvoiceDto.id}`]);
  }

  public routeToPointOfSalesEdit(salesInvoiceDto: SalesInvoiceDto): void {
    this.router.navigate([`point-of-sale/sales-invoice-id/${salesInvoiceDto.id}`]);
  }

  public routeToReturnInvoice(salesInvoiceDto: SalesInvoiceDto): void {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate([`return-invoice/${salesInvoiceDto.id}`]);
  }

  public selectDateFrom(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearDateFrom(): void {
    this.dateFrom = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectDateTo(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearDateTo(): void {
    this.dateTo = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteSalesInvoices = [];
      this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>([]);
    }
    const salesInvoiceSearchCriteriaDto: any = {
      createdBy: this.username === '' || this.username === null ? null : this.username,
      driverId: this.selectedDriverId === '0' || this.selectedDriverId === null ? '' : this.selectedDriverId,
      dateFrom: this.dateFrom === null ? '' : this.dateFrom,
      dateTo: this.dateTo === null ? '' : this.dateTo,
      customerName: this.customerName,
      salesInvoiceStatus: this.salesInvoiceStatus,
      salesInvoiceCategory: this.salesInvoiceCategory,

      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (salesInvoiceSearchCriteriaDto.createdBy === null) {
      delete salesInvoiceSearchCriteriaDto.createdBy;
    }

    this.salesInvoiceSearchSubscription = this.salesInvoiceApiService.search(salesInvoiceSearchCriteriaDto).subscribe(salesInvoices => {
      this.infiniteSalesInvoices = [...this.infiniteSalesInvoices, ...salesInvoices.content];
      this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>(this.infiniteSalesInvoices);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })

    const x: any = {
      salesInvoiceType: SalesInvoiceType.EGG,
      createdBy: this.username === '' || this.username === null ? null : this.username,
      driverId: this.selectedDriverId === '0' || this.selectedDriverId === null ? '' : this.selectedDriverId,
      dateFrom: this.dateFrom === null ? '' : this.dateFrom,
      dateTo: this.dateTo === null ? '' : this.dateTo,
      customerName: this.customerName,
      salesInvoiceStatus: this.salesInvoiceStatus,
      salesInvoiceCategory: this.salesInvoiceCategory,

      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (x.createdBy === null) {
      delete x.createdBy;
    }

    this.salesInvoiceSearchSubscription = this.salesInvoiceApiService.searchForType(x).subscribe(salesInvoices => {
      console.log(salesInvoices)
    });
  }

  public reset(): void {
    this.selectedStatus = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedDriverId = '0';
    this.customerName = '';
    this.salesInvoiceType = '';
    this.salesInvoiceStatus = '';
    this.salesInvoiceCategory = '';
    this.username = '';
    this.amountDue = 0;
    this.initialisePaymentFormBuilder();
    this.utilsService.presentLoadingDuration(500).then(() => {
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
      if (payment.paymentModeId !== 1) {
        sum = sum + payment.amountPaid;
      } else if (payment.paymentModeId == 1 && payment.amountPaid < 0) {
        sum = sum + payment.amountPaid;
      }
    })
    return sum;
  }

  public openStatusModal(salesInvoiceDto: SalesInvoiceDto): void {
    this.selectedInvoice = salesInvoiceDto;
    this.initialisePaymentFormBuilder();
    this.isStatusModalOpen = true;
  }

  public cancelStatusChange(): void {
    this.isStatusModalOpen = false;
    this.selectedStatus = null;
    this.modal.dismiss(null, 'cancel');
  }

  public confirmStatusChange(): void {
    this.modal.dismiss(null, 'confirm');
  }

  public onModalStatusWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isStatusModalOpen = false;
      this.selectedStatus = null;
    }
    if (ev.detail.role === 'confirm') {
      this.isStatusModalOpen = false;
      this.changeStatusOfInvoice();
    }
  }

  private changeStatusOfInvoice(): void {
    this.utilsService.presentLoading();
    if (this.selectedStatus === SalesInvoiceStatus.APPROVED) {
      this.salesInvoiceApiService.approveSalesInvoiceStatus(this.selectedInvoice.id).subscribe({
        next: (data: string) => {
          this.reset();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg(`Invoice ${this.selectedInvoice.id} successfully changed to ${this.selectedStatus?.toLowerCase()}`);
        },
        error: (error: HttpErrorResponse) => {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      });
    }
    if (this.selectedStatus === SalesInvoiceStatus.CANCELLED) {
      this.salesInvoiceApiService.cancelSalesInvoiceStatus(this.selectedInvoice.id).subscribe({
        next: (data: string) => {
          this.reset();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg(`Invoice ${this.selectedInvoice.id} successfully changed to ${this.selectedStatus?.toLowerCase()}`);
        },
        error: (error: HttpErrorResponse) => {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      });
    }
    if (this.selectedStatus === SalesInvoiceStatus.RETURNED) {

    }
    if (this.selectedStatus === SalesInvoiceStatus.COMPLETED) {
      this.salesInvoiceApiService.completeSalesInvoiceStatus(this.selectedInvoice.id).subscribe({
        next: (data: string) => {
          this.reset();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg(`Invoice ${this.selectedInvoice.id} successfully changed to ${this.selectedStatus?.toLowerCase()}`);
        },
        error: (error: HttpErrorResponse) => {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      });
    }
    if (this.selectedStatus === SalesInvoiceStatus.PAID) {
      this.populatePaymentDto();
      this.paymentApiService.settleInvoicePayment(this.salesInvoiceSettleCreditPaymentFrontDto).subscribe({
        next: (data: string) => {
          this.reset();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg(`Payment for Invoice ${this.selectedInvoice.id} settled successfully`);
        },
        error: (error: HttpErrorResponse) => {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      });
    }

  }

  private initialisePaymentFormBuilder(): void {
    const amountDue = this.selectedInvoice.paymentDtos.filter(payment => payment.paymentModeId === 1 && payment.settled === false).map(payment => payment.amountPaid).reduce((acc, value) => {
      return acc + value;
    }, 0);
    this.amountDue = amountDue;
    this.paymentForm = this.formBuilder.group({
      totalPrice: new FormControl({ value: amountDue, disabled: true }, Validators.compose([Validators.required])),
      soldAt: new FormControl({ value: amountDue, disabled: this.selectedInvoice.soldAt < this.selectedInvoice.totalPrice }, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(amountDue),
      ])),
      payments: this.formBuilder.array([
        this.addPaymentFormGroup()
      ])
    });
  }

  addPaymentFormGroup() {
    return this.formBuilder.group({
      amountPaid: new FormControl(0, Validators.compose([
        Validators.required,
        Validators.min(0)
      ])),
      paymentModeId: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      bankAccountId: new FormControl(1, Validators.compose([
        Validators.required
      ])),
      paymentDeadline: new FormControl(moment(new Date()).startOf('day').format(moment.HTML5_FMT.DATE), Validators.compose([
        Validators.required
      ])),
    })
  }

  addPayment(): void {
    if ((this.paymentForm.get('payments') as FormArray).length < 2) {
      (this.paymentForm.get('payments') as FormArray).push(this.addPaymentFormGroup());
    }
  }

  removePayment(paymentGroupIndex: number): void {
    (this.paymentForm.get('payments') as FormArray).removeAt(paymentGroupIndex);
  }

  get paymentsFields() {
    return this.paymentForm ? this.paymentForm.get('payments') as FormArray : null;
  }

  public checkPaymentLessThanSoldAt(): boolean {
    let totalAmountPaid = 0;
    this.paymentForm.get('payments')?.value.forEach((payment: any) => {
      totalAmountPaid += payment.amountPaid;
    });
    if (totalAmountPaid <= this.paymentForm.get('soldAt')?.value) {
      return true;
    } else {
      return false;
    }
  }

  public checkPaymentCompleted(): boolean {
    let totalAmountPaid = 0;
    this.paymentForm.get('payments')?.value.forEach((payment: any) => {
      totalAmountPaid += payment.amountPaid;
    });
    if (totalAmountPaid === this.paymentForm.get('soldAt')?.value) {
      return true;
    } else {
      return false;
    }
  }

  private populatePaymentDto(): void {
    this.salesInvoiceSettleCreditPaymentFrontDto = {
      invoiceId: this.selectedInvoice.id,
      soldAt: this.paymentForm?.get("soldAt")?.value,
      discount: null,
      paymentSaveDtos: this.paymentForm.value.payments,
    }
    this.salesInvoiceSettleCreditPaymentFrontDto.paymentSaveDtos?.forEach(payment => {
      payment.paymentModeId = payment.paymentModeId.id
    })
  }
}

