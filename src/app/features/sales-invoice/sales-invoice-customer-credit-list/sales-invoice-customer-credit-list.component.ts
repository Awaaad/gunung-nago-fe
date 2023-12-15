import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SalesInvoiceDto, UserDto, SalesInvoiceType, SalesInvoiceStatus, SalesInvoiceCategory, PaymentDto, BankAccountDto, PaymentModeDto, CustomerDto } from 'generated-src/model';
import { SettleCustomerCreditPaymentFrontDto } from 'generated-src/model-front';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PaymentApiService } from 'src/app/shared/apis/payment.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { environment } from 'src/environments/environment';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';

@Component({
  selector: 'app-sales-invoice-customer-credit-list',
  templateUrl: './sales-invoice-customer-credit-list.component.html',
  styleUrls: ['./sales-invoice-customer-credit-list.component.scss'],
})
export class SalesInvoiceCustomerCreditListComponent implements OnInit {
  public customerId: any = this.activatedRoute.snapshot.paramMap.get('customerId');
  @ViewChild('picker') picker: any;
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['locked', 'id', 'createdBy', 'createdDate', 'category', 'driver', 'totalPrice', 'soldAt', 'amountPaid', 'amountDue', 'status'];
  public salesInvoices = new MatTableDataSource<SalesInvoiceDto>;
  private infiniteSalesInvoices: SalesInvoiceDto[] = [];
  public salesInvoiceSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 50;
  public sortOrder: string = 'desc';
  public sortBy: string = 'createdDate';
  public customerName: string = '';
  public usernames: string[] = [];
  public username: string = '';
  public drivers: UserDto[] = [];
  public salesInvoiceTypes: string[] = [];
  public salesInvoiceType: SalesInvoiceType | string = '';
  public salesInvoiceStatuses: string[] = [];
  public salesInvoiceStatus: SalesInvoiceStatus | string = '';
  public salesInvoiceCategories: string[] = [];
  public salesInvoiceCategory: SalesInvoiceCategory | string = '';
  public isPaymentModalOpen: boolean = false;
  public today: Date = new Date();
  public paymentForm!: FormGroup;
  public paymentTypes: string[] = [];
  private settleCustomerCreditPaymentDto!: SettleCustomerCreditPaymentFrontDto;
  public amountDue!: number;

  public soldAt: number = 0;
  public amountPaid: number = 0;
  public totalAmountDue: number = 0;
  public initialTotalAmountDue: number = 0;
  public totalLockedAmountDue: number = 0;
  public totalUnlockedAmountDue: number = 0;
  public discountOnTotalCredit!: number;
  public paymentDeadline = moment(this.today).startOf('day').format(moment.HTML5_FMT.DATE);

  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];

  public preview: boolean = false;
  public customer!: CustomerDto;
  public dateFrom: Date = new Date();
  public dateTo: Date = new Date();
  public company = environment.company;
  public address = environment.address;
  public phone = environment.phone;
  public email = environment.email;
  public regNo = environment.regNo;
  public yoe = environment.yoe;

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
    private readonly activatedRoute: ActivatedRoute,
    private customerApiService: CustomerApiService,
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

  ngOnInit() {
    this.initialiseCustomer();
  }

  ionViewWillEnter(): void {
    this.initialiseCustomer();
    this.salesInvoiceTypes = Object.keys(SalesInvoiceType);
    this.salesInvoiceStatuses = Object.keys(SalesInvoiceStatus);
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
    this.getAllPaymentModes();
    this.getAllBankAccounts();
    this.getAllUsernames();
    this.getAllDrivers();
    this.getCustomerById();
    this.search();
  }

  private initialiseCustomer(): void {
    this.customer = {
      id: 0,
      firstName: "",
      lastName: "",
      address: "",
      telephoneNumber: 0,
      telephoneNumberTwo: 0,
      telephoneNumberThree: 0,
      totalAmountDue: 0
    }
  }

  private getCustomerById(): void {
    this.customerApiService.findById(this.customerId).subscribe(customer => {
      this.customer = customer;
    })
  }

  public getAllPaymentModes() {
    this.paymentModeApiService.findAll().subscribe(paymentModes => {
      this.paymentModes = paymentModes.filter(paymentMode => paymentMode.id != 1);
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

  public routeToSalesInvoiceDetails(salesInvoiceDto: SalesInvoiceDto): void {
    this.router.navigate([`sales-invoice/sales-invoice-details/${salesInvoiceDto.id}`]);
  }

  public routeToPointOfSalesEdit(salesInvoiceDto: SalesInvoiceDto): void {
    this.router.navigate([`point-of-sale/sales-invoice-id/${salesInvoiceDto.id}`]);
  }

  public selectDateFrom(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectDateTo(): void {
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
      customerId: this.customerId,
      credit: true,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (salesInvoiceSearchCriteriaDto.createdBy === null) {
      delete salesInvoiceSearchCriteriaDto.createdBy;
    }

    this.salesInvoiceSearchSubscription = this.salesInvoiceApiService.search(salesInvoiceSearchCriteriaDto).subscribe(salesInvoices => {
      this.infiniteSalesInvoices = [...this.infiniteSalesInvoices, ...salesInvoices.content];
      this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>(this.infiniteSalesInvoices);

      if (this.salesInvoices.data.length > 0) {
        this.initialTotalAmountDue = this.salesInvoices.data[0]?.totalAmountDue;
        this.totalAmountDue = this.salesInvoices.data[0]?.totalAmountDue;
        this.totalLockedAmountDue = this.salesInvoices.data[0]?.totalLockedAmountDue;
        this.totalUnlockedAmountDue = this.salesInvoices.data[0]?.totalUnlockedAmountDue;
      }

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.preview = false;
    this.customerName = '';
    this.salesInvoiceType = '';
    this.salesInvoiceStatus = '';
    this.salesInvoiceCategory = '';
    this.username = '';
    this.amountDue = 0;
    this.soldAt = 0;
    this.amountPaid = 0;
    this.totalAmountDue = 0;
    this.initialTotalAmountDue = 0;
    this.totalLockedAmountDue = 0;
    this.totalUnlockedAmountDue = 0;
    this.discountOnTotalCredit = 0;
    this.paymentDeadline = moment(this.today).startOf('day').format(moment.HTML5_FMT.DATE);

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

  public getTotalAmountPaidPerInvoice(paymentDto: PaymentDto[]): number {
    let sum = 0;
    paymentDto.forEach(payment => {
      if (payment.paymentModeId !== 1 && payment.settled)
        sum = sum + payment.amountPaid;
    })
    return sum;
  }

  public getTotalCreditAmountPerInvoice(paymentDto: PaymentDto[]): number {
    let sum = 0;
    paymentDto.forEach(payment => {
      if (payment.paymentModeId == 1 && !payment.settled)
        sum = sum + payment.amountPaid;
    })
    return sum;
  }

  public getTableTotalAmountPaid(): number {
    const total = this.salesInvoices.data.map(data => {
      let totalAmount = 0;
      data.paymentDtos.forEach(payment => {
        if (payment.paymentModeId !== 1) {
          totalAmount = totalAmount + payment.amountPaid;
        }
      })
      return totalAmount;
    }).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    } else {
      return 0;
    }
  }

  public getTotalInvoicePrice(): number {
    let sum = 0;
    this.salesInvoices.data.forEach(salesInvoice => {
      sum = sum + salesInvoice.soldAt;
    })
    return sum;
  }

  public getBalance(soldAt: number, paymentDto: PaymentDto[]): number {
    const balance = (soldAt - this.getTotalReturn(paymentDto)) - this.getTotalAmountPaidPerInvoice(paymentDto);
    if (balance < 0) {
      return balance * -1
    } else {
      return balance
    }
  }

  public getTotalReturn(paymentDto: PaymentDto[]): number {
    let sum = 0;
    paymentDto.forEach(payment => {
      if (payment.settled && payment.amountPaid < 0) {
        sum = sum + (payment.amountPaid * -1);
      }
    })
    return sum;
  }

  public getTableTotalReturnAmount(): number {
    const total = this.salesInvoices.data.map(data => {
      let totalAmount = 0;
      data.paymentDtos.forEach(payment => {
        if (payment.settled && payment.amountPaid < 0) {
          totalAmount = totalAmount + (payment.amountPaid * -1);
        }
      })
      return totalAmount;
    }).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    } else {
      return 0;
    }
  }

  public openPaymentModal(): void {
    this.initialisePaymentFormBuilder();
    this.isPaymentModalOpen = true;
  }

  public cancelPayment(): void {
    this.isPaymentModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }

  public confirmPayment(): void {
    this.modal.dismiss(null, 'confirm');
  }

  public onModalPaymentWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isPaymentModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isPaymentModalOpen = false;
      this.settleInvoicePayment();
    }
  }

  private settleInvoicePayment(): void {
    this.utilsService.presentLoading();
    this.populatePaymentDto();
    this.paymentApiService.settleAccount(this.settleCustomerCreditPaymentDto).subscribe({
      next: (data: string) => {
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg(`Account settled successfully`);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private initialisePaymentFormBuilder(): void {
    this.paymentForm = this.formBuilder.group({
      customerId: new FormControl({ value: this.customerId, disabled: true }, Validators.compose([Validators.required])),
      soldAtForUnlockedCreditPayments: new FormControl({ value: this.totalUnlockedAmountDue > 0 ? this.soldAt : this.totalAmountDue, disabled: true }, Validators.compose([
        Validators.required,
        Validators.min(0),
      ])),
      payments: this.formBuilder.array([
        this.addPaymentFormGroup()
      ]),
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
    if (totalAmountPaid < this.totalAmountDue) {
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
    if (totalAmountPaid > this.totalAmountDue) {
      return true;
    } else {
      return false;
    }
  }

  private populatePaymentDto(): void {
    this.settleCustomerCreditPaymentDto = {
      customerId: this.customerId,
      soldAtForUnlockedCreditPayments: this.paymentForm?.get("soldAtForUnlockedCreditPayments")?.value,
      paymentDtos: this.paymentForm.value.payments,
      paymentDeadline: moment(this.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
    }
    this.settleCustomerCreditPaymentDto.paymentDtos?.forEach(payment => {
      payment.paymentModeId = payment.paymentModeId.id
    })
  }

  public calculateTotalAmountDue(soldAt: number): void {
    this.totalAmountDue = soldAt + this.totalLockedAmountDue;
  }
}

