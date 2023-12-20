import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountDto, CustomerDto, PaymentDto, PaymentModeDto, SalesInvoiceCategory, SalesInvoiceDto, SalesInvoiceStatus, SalesInvoiceType, UserDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SalesInvoiceSettleCreditPaymentFrontDto } from 'generated-src/model-front';
import { PaymentApiService } from 'src/app/shared/apis/payment.api.service';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { environment } from 'src/environments/environment';
import { FileApiService } from 'src/app/shared/apis/file.api.service';

@Component({
  selector: 'app-sales-invoice-list',
  templateUrl: './sales-invoice-list.component.html',
  styleUrls: ['./sales-invoice-list.component.scss'],
})
export class SalesInvoiceListComponent implements OnInit {
  public customerId: any = this.activatedRoute.snapshot.paramMap.get('customerId');
  @ViewChild('picker') picker: any;
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public returnInvoice = 'assets/flaticon/return-invoice-icon-list.svg';
  public language = "en";
  public displayedColumns: string[] = ['id', 'name', 'createdBy', 'createdDate', 'category', 'driver', 'totalPrice', 'soldAt', 'amountPaid', 'amountDue', 'status', 'actions'];
  public salesInvoices = new MatTableDataSource<SalesInvoiceDto>;
  private infiniteSalesInvoices: SalesInvoiceDto[] = [];
  public statementInvoices: SalesInvoiceDto[] = [];
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
  public lastName!: string;
  public firstName!: string;
  public salesInvoiceNumber: string = '';
  public searchValue!: any;

  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];

  public generateStatementOfAccount: boolean = false;
  public preview: boolean = false;
  public statementOfAccountDateFrom!: Date | null;
  public statementOfAccountDateTo!: Date | null;

  public customer!: CustomerDto;
  public company = environment.company;
  public address = environment.address;
  public phone = environment.phone;
  public email = environment.email;
  public regNo = environment.regNo;
  public yoe = environment.yoe;

  public isToJakarta: boolean | string = '';

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
    private paymentModeApiService: PaymentModeApiService,
    private fileApiService: FileApiService
  ) {
  }

  ngOnInit() {
    this.initialiseCustomer();
    this.statementInvoices = [];
    this.statementOfAccountDateFrom = null;
    this.statementOfAccountDateTo = null;
  }

  ionViewWillEnter(): void {
    this.statementInvoices = [];
    this.initialiseCustomer();
    this.isStatusModalOpen = false;
    this.salesInvoiceTypes = Object.keys(SalesInvoiceType);
    this.salesInvoiceStatuses = Object.keys(SalesInvoiceStatus);
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
    if (this.customerId) {
      this.getRouteParams();
    }
    this.getAllPaymentModes();
    this.getAllBankAccounts();
    this.getAllUsernames();
    this.getAllDrivers();
    this.search();
  }

  private getRouteParams(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.lastName = params['lastName'];
        this.firstName = params['firstName'];
      }
      );
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

  public searchBySalesInvoiceNumber(salesInvoiceNumber: any): void {
    this.salesInvoiceSearchSubscription.unsubscribe();
    this.salesInvoices = new MatTableDataSource<SalesInvoiceDto>;
    this.page = 0;
    this.salesInvoiceNumber = salesInvoiceNumber;
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

  public toggleToJakarta(event: any): void {
    this.isToJakarta = event.detail.checked;
    this.utilsService.presentLoadingDuration(500).then(value => {
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

  public routeToReturnInvoiceList(salesInvoiceDto: SalesInvoiceDto): void {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate([`return-invoice/return-invoice-list/${salesInvoiceDto.id}`]);
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
      customerId: this.customerId === '' || this.customerId === null ? null : this.customerId,
      createdBy: this.username === '' || this.username === null ? null : this.username,
      driverId: this.selectedDriverId === '0' || this.selectedDriverId === null ? '' : this.selectedDriverId,
      dateFrom: this.dateFrom === null ? '' : this.dateFrom,
      dateTo: this.dateTo === null ? '' : this.dateTo,
      customerName: this.customerName,
      salesInvoiceStatus: this.salesInvoiceStatus,
      salesInvoiceCategory: this.salesInvoiceCategory,
      id: this.salesInvoiceNumber,
      isToJakarta: this.isToJakarta,

      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (salesInvoiceSearchCriteriaDto.createdBy === null) {
      delete salesInvoiceSearchCriteriaDto.createdBy;
    }
    if (salesInvoiceSearchCriteriaDto.customerId === null) {
      delete salesInvoiceSearchCriteriaDto.customerId;
    }
    if (!salesInvoiceSearchCriteriaDto.isToJakarta) {
      delete salesInvoiceSearchCriteriaDto.isToJakarta;
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

  public previewStatement(event: any): void {
    if (event.detail.checked) {
      this.generateStatement();
    }
    this.preview = event.detail.checked;
  }

  public changeReportDateFrom(event: any): void {
    if (!event) {
      this.preview = false;
    }
  }

  public changeReportDateTo(event: any): void {
    if (!event) {
      this.preview = false;
    }
  }

  public generateStatement(): void {
    this.getCustomerById();
    this.statementInvoices = [];
    const salesInvoiceSearchCriteriaDto: any = {
      customerId: this.customerId === '' || this.customerId === null ? null : this.customerId,
      dateFrom: this.statementOfAccountDateFrom === null ? '' : moment(this.statementOfAccountDateFrom).startOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL),
      dateTo: this.statementOfAccountDateTo === null ? '' : moment(this.statementOfAccountDateTo).startOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL),

      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (salesInvoiceSearchCriteriaDto.customerId === null) {
      delete salesInvoiceSearchCriteriaDto.customerId;
    }
    this.searchValue = salesInvoiceSearchCriteriaDto;
    this.salesInvoiceSearchSubscription = this.salesInvoiceApiService.generateStatement(salesInvoiceSearchCriteriaDto).subscribe(salesInvoices => {
      this.statementInvoices = salesInvoices.content;
    })
  }

  public generateStatementPdf() : void{
    this.fileApiService.generateStatementOfAccountPdf(this.searchValue).subscribe(fileResponse => {
      this.utilsService.openTemplateInNewTab(fileResponse);
    });
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

  public getTotalInvoicePrice(): number {
    let sum = 0;
    this.statementInvoices.forEach(salesInvoice => {
      sum = sum + salesInvoice.soldAt;
    })
    return sum;
  }

  public getTableTotalReturnAmount(): number {
    const total = this.statementInvoices.map(data => {
      let totalAmount = 0;
      data.paymentDtos.forEach(payment => {
        if (payment.settled && payment.amountPaid < 0) {
          totalAmount = totalAmount + (payment.amountPaid * -1);
        }
      })
      return totalAmount;
    }).reduce((acc, value) => acc + value, 0);
    return total;
  }

  public getTableTotalAmountDue(): number {
    const total = this.statementInvoices.map(data => {
      let totalAmount = 0;
      data.paymentDtos.forEach(payment => {
        if (!payment.settled && payment.paymentModeId == 1) {
          totalAmount = totalAmount + payment.amountPaid;
        }
      })
      return totalAmount;
    }).reduce((acc, value) => acc + value, 0);
    return total;
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

  public getTotalPrice(): any {
    const total = this.salesInvoices.data.map(data => data.totalPrice).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalSoldAt(): any {
    const total = this.salesInvoices.data.map(data => data.soldAt).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalAmountDue(): any {
    const total = this.salesInvoices.data.map(data => {
      let totalAmount = 0;
      data.paymentDtos.filter(payment => payment.paymentModeId == 1 && !payment.settled).forEach(payment => {
        totalAmount = totalAmount + payment.amountPaid
      })
      return totalAmount;
    }).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTableTotalAmountPaid(): any {
    const total = this.salesInvoices.data.map(data => {
      let totalAmount = 0;
      data.paymentDtos.forEach(payment => {
        if (payment.paymentModeId !== 1) {
          totalAmount = totalAmount + payment.amountPaid;
        } else if (payment.paymentModeId == 1 && payment.amountPaid < 0) {
          totalAmount = totalAmount + payment.amountPaid;
        }
      })
      return totalAmount;
    }).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }
}

