import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountDto, CustomerDto, FeedCategory, FeedDto, FeedSaleSaveDto, PaymentModeDto, SalesInvoiceCategory, SupplierDto, UserDto } from 'generated-src/model';
import { CustomerFrontDto, FeedSaleDetailsFrontDto, FeedSaleSaveFrontDto, FeedStockSaleDetailsFrontDto } from 'generated-src/model-front';
import moment from 'moment';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { FeedStockApiService } from 'src/app/shared/apis/feed-stock.api.service';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { environment } from 'src/environments/environment';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpErrorResponse } from '@angular/common/http';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { FeedSaleApiService } from 'src/app/shared/apis/feed-sale.api.service';

@Component({
  selector: 'app-feed-sale-details',
  templateUrl: './feed-sale-details.component.html',
  styleUrls: ['./feed-sale-details.component.scss'],
})
export class FeedSaleDetailsComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public language = "en";
  public feedSaleForm!: FormGroup;

  public isNewCustomer: boolean = false;
  private searchCustomerSubscription!: Subscription;
  public searchCustomerCtrl = new FormControl();
  public filteredCustomers: CustomerFrontDto[] = [];
  public selectedCustomer!: CustomerFrontDto;
  public isLoading = false;
  public errorMsg!: string;
  public minLengthTerm = 1;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';

  public displayedColumns: string[] = ['name', 'feedCategory', 'recommendedWeight', 'quantity', 'supplier'];
  public feeds = new MatTableDataSource<FeedDto>;
  private infiniteFeeds: FeedDto[] = [];
  public feedSearchSubscription!: Subscription;
  public feedCategories: string[] = [];
  public feedName: string = '';
  public feedCategory: FeedCategory | string = '';
  public suppliers: SupplierDto[] = [];

  public stockColor = '#4e342e';
  public displayedCartColumns: string[] = ['index', 'name', 'feedCategory', 'recommendedWeight', 'remove'];
  public isFeedInStockBox: boolean = false;
  public feedsInCart: FeedStockSaleDetailsFrontDto[] = [];
  public feedsInCartTable = new MatTableDataSource<FeedStockSaleDetailsFrontDto>;
  public indexProductInCart!: number;
  public subTotal = 0;

  public company = environment.company;
  public address = environment.address;
  public phone = environment.phone;
  public email = environment.email;
  public regNo = environment.regNo;
  public yoe = environment.yoe;

  public isModalOpen: boolean = false;
  public paymentForm!: FormGroup;
  public paymentTypes: string[] = [];
  public today: Date = new Date();
  public salesInvoiceCategories: string[] = [];
  public salesInvoiceCategory: SalesInvoiceCategory = SalesInvoiceCategory.IN_STORE;
  public showDriver: boolean = false;
  public drivers: UserDto[] = [];
  public selectedDriver!: UserDto | null;
  public comment!: string | null;
  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];
  public completePaymentModes: PaymentModeDto[] = [];

  private feedSaleSaveFrontDto!: FeedSaleSaveFrontDto;

  public errorMessages = {
    firstName: [{ type: "required", message: "First name is required" }],
    lastName: [{ type: "required", message: "Last name is required" }],
    telephoneNumber: [
      { type: "required", message: "Contact number is required" },
      { type: "pattern", message: "Invalid contact number" }
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
    bankAccountId: [
      { type: 'required', message: 'Bank account is required' },
    ]
  };

  constructor(
    private customerApiService: CustomerApiService,
    private formBuilder: FormBuilder,
    private feedApiService: FeedApiService,
    private feedStockApiService: FeedStockApiService,
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private bankAccountApiService: BankAccountApiService,
    private utilsService: UtilsService,
    private paymentModeApiService: PaymentModeApiService,
    private router: Router,
    private securityApiService: SecurityApiService,
    private feedSaleApiService: FeedSaleApiService
  ) { }

  ngOnInit() {
    this.feedCategories = Object.keys(FeedCategory);
    this.findAllSuppliers();
    this.initialiseFormBuilder();
    this.initialiseSelectedCustomer();
    this.searchCustomerAutoComplete();
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
  }

  ionViewWillEnter(): void {
    this.findAllSuppliers();
    this.getAllPaymentModes();
    this.getAllBankAccounts();
  }

  public getAllPaymentModes() {
    this.paymentModeApiService.findAll().subscribe(paymentModes => {
      this.paymentModes = paymentModes;
      this.completePaymentModes = paymentModes;
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

  public routeToSalesInvoiceCustomerCreditList(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`sales-invoice/sales-invoice-customer-credit-list/${this.selectedCustomer.id}`], { queryParams: { lastName: this.selectedCustomer.lastName, firstName: this.selectedCustomer.firstName } })
    );

    window.open(url, '_blank');
  }

  public newCustomerChange(event: any): void {
    this.isNewCustomer = event.detail.checked;
    this.setCustomerNewValue(this.isNewCustomer);
  }

  private setCustomerNewValue(isNewCustomer: boolean): void {
    isNewCustomer ? this.feedSaleForm?.get("customer.firstName")?.enable() : this.feedSaleForm?.get("customer.firstName")?.disable();
    isNewCustomer ? this.feedSaleForm?.get("customer.lastName")?.enable() : this.feedSaleForm?.get("customer.lastName")?.disable();
    isNewCustomer ? this.feedSaleForm?.get("customer.address")?.enable() : this.feedSaleForm?.get("customer.address")?.disable();
    isNewCustomer ? this.feedSaleForm?.get("customer.telephoneNumber")?.enable() : this.feedSaleForm?.get("customer.telephoneNumber")?.disable();
    if (this.isNewCustomer) {
      this.feedSaleForm?.get("customer.firstName")?.setValue("");
      this.feedSaleForm?.get("customer.lastName")?.setValue("");
      this.feedSaleForm?.get("customer.address")?.setValue("");
      this.feedSaleForm?.get("customer.telephoneNumber")?.setValue("");
    }
  }

  private initialiseFormBuilder(): void {
    this.feedSaleForm = this.formBuilder.group({
      newCustomer: new FormControl(this.isNewCustomer, Validators.compose([Validators.required])),
      customer: this.formBuilder.group({
        id: this.selectedCustomer?.id,
        firstName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        lastName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        address: new FormControl({ value: '', disabled: !this.isNewCustomer }),
        telephoneNumber: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"),]))
      })
    });
  }

  public searchCustomerAutoComplete(): void {
    if (this.searchCustomerSubscription) {
      this.searchCustomerSubscription.unsubscribe();
    }
    this.searchCustomerSubscription = this.searchCustomerCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredCustomers = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          const name = {
            page: this.page,
            size: this.size,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder.toUpperCase(),
            name: value
          }
          return this.customerApiService.search(name).pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        })
      )
      .subscribe((data: any) => {
        this.filteredCustomers = data.content
      });
  }

  public displayWith(subject: CustomerDto): any {
    if (subject?.telephoneNumber) {
      return subject ? `${subject.lastName}${" "}${subject.firstName} --- ${subject.telephoneNumber}` : undefined;
    } else if (subject?.firstName != null) {
      return subject ? `${subject.lastName}${" "}${subject.firstName}` : undefined;
    }
  }

  private initialiseSelectedCustomer(): void {
    this.selectedCustomer = {
      id: null,
      firstName: null,
      lastName: null,
      address: null,
      telephoneNumber: null,
      totalAmountDue: null
    };
  }

  public clearCustomer(ctrl: FormControl): void {
    ctrl.setValue(null);
    this.feedSaleForm?.get("customer.firstName")?.setValue("");
    this.feedSaleForm?.get("customer.lastName")?.setValue("");
    this.feedSaleForm?.get("customer.address")?.setValue("");
    this.feedSaleForm?.get("customer.telephoneNumber")?.setValue("");
    this.initialiseSelectedCustomer();
  }

  public setSelectedCustomer(event: any): void {
    this.selectedCustomer = event.option.value;
    this.selectedCustomer.id = event.option.value.id;
    this.feedSaleForm?.get("customer.id")?.setValue(event.option.value.id);
    this.feedSaleForm?.get("customer.firstName")?.setValue(event.option.value.firstName);
    this.feedSaleForm?.get("customer.lastName")?.setValue(event.option.value.lastName);
    this.feedSaleForm?.get("customer.address")?.setValue(event.option.value.address);
    this.feedSaleForm?.get("customer.telephoneNumber")?.setValue(event.option.value.telephoneNumber);
    this.feedSaleForm?.get("newCustomer")?.setValue(false);
  }

  public searchByFeedName(feedName: any): void {
    if (this.feedSearchSubscription) {
      this.feedSearchSubscription.unsubscribe();
    }
    this.feeds = new MatTableDataSource<FeedDto>;
    this.page = 0;
    this.feedName = feedName;
    if (this.feedName != "") {
      this.search();
    } else {
      this.feeds = new MatTableDataSource<FeedDto>;
    }
  }

  public ionChangeFeedCategory(event: any): void {
    this.feedCategory = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteFeeds = [];
      this.feeds = new MatTableDataSource<FeedDto>([]);
    }
    const cageSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      name: this.feedName,
      feedCategory: this.feedCategory,
      sale: true
    }

    this.feedSearchSubscription = this.feedApiService.search(cageSearchCriteriaDto).subscribe(feeds => {
      this.infiniteFeeds = [...this.infiniteFeeds, ...feeds.content];
      this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public resetFilters(): void {
    this.feedName = '';
    this.feedCategory = '';
    this.sortOrder = 'asc'.toLocaleUpperCase();
    this.sortBy = 'name';
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

  private findAllSuppliers(): void {
    this.supplierApiService.findAll().subscribe((data: SupplierDto[]) => {
      this.suppliers = data;
    });
  }

  public async addFeedToStock(row: FeedDto): Promise<void> {
    await this.resolveAddFeedToStock(row).then(exist => {
      if (!exist) {
        this.feedStockApiService.findFeedStockByFeedId(row.id).subscribe(feed => {
          const feedStockSaleDetailsFrontDto: FeedStockSaleDetailsFrontDto = {
            feedId: row.id,
            weight: row.recommendedWeight,
            name: row.name,
            feedCategory: row.feedCategory,
            feedStockDto: feed,
            focused: false
          }
          this.feedsInCart.push(feedStockSaleDetailsFrontDto);
          this.feedsInCartTable = new MatTableDataSource<FeedStockSaleDetailsFrontDto>(this.feedsInCart);
        })
      }
    });
  }

  public resolveAddFeedToStock(feedRow: FeedDto) {
    this.isFeedInStockBox = false;
    return new Promise((resolve) => {
      resolve(
        this.feedsInCart.find(
          (feed) => feed.feedId === feedRow.id
        )
      );
    });
  }

  public checkIfPresent(id: number) {
    return this.feedsInCart.find((feed) => feed.feedId === id);
  }

  public removeFeedInStock(element: any): void {
    for (let i = 0; i < this.feedsInCart.length; i++) {
      if (this.feedsInCart[i].feedId === element.feedId) {
        this.feedsInCart.splice(i, 1);
      }
    }
    this.feedsInCartTable = new MatTableDataSource<FeedStockSaleDetailsFrontDto>(this.feedsInCart);
    this.calculateSubTotal();
  }

  public updateCartDetails(index: number): number {
    this.feedsInCart.forEach((feed) => {
      feed.focused = false;
    });
    this.feedsInCart[index].focused = true;
    return (this.indexProductInCart = index);
  }

  public calculateSubTotal(): void {
    this.subTotal = 0;
    this.feedsInCart.forEach((feed) => {
      feed.feedStockDto.forEach((feedStock) => {
        feedStock.amount = 0;
        feedStock.amount =
          (feedStock.quantity ? feedStock.quantity : 0) * (feedStock.price ? feedStock.price : 0)
        this.subTotal = this.subTotal + feedStock.amount;
      });
    });
  }

  private checkIfCreditAllowed(): boolean {
    return (this.selectedCustomer != null && this.selectedCustomer.id != null) || (this.isNewCustomer && this.feedSaleForm?.get("customer.telephoneNumber")?.value != '');
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

  private initialisePaymentFormBuilder(): void {
    this.paymentForm = this.formBuilder.group({
      totalPrice: new FormControl({ value: this.subTotal, disabled: true }, Validators.compose([Validators.required])),
      soldAt: new FormControl({ value: this.subTotal, disabled: false }, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(this.subTotal),
      ])),
      payments: this.formBuilder.array([
        this.addPaymentFormGroup()
      ])
    });
  }

  public openModal(): void {
    if (!this.checkIfCreditAllowed()) {
      this.paymentModes = this.completePaymentModes.filter(paymentMode => paymentMode.id != 1);
    } else {
      this.paymentModes = this.completePaymentModes;
    }
    this.initialisePaymentFormBuilder();
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
      this.save();
    }
  }

  public selectSalesInvoiceCategory(event: any): void {
    if (event.detail.value === SalesInvoiceCategory.DELIVERY) {
      this.getAllDrivers();
      this.showDriver = true;
    } else {
      this.showDriver = false;
    }
  }

  private getAllDrivers(): void {
    this.securityApiService.getAllDrivers().subscribe(drivers => {
      this.drivers = drivers;
    })
  }

  private initialiseFeedSaleSaveDto(): void {
    this.feedSaleSaveFrontDto = {
      customerDto: {
        id: null,
        firstName: null,
        lastName: null,
        address: null,
        telephoneNumber: null,
        totalAmountDue: null,
      },
      paymentSaveDtos: [],
      newCustomer: false,
      driverId: null,
      salesInvoiceCategory: null,
      feedSaleDetailsDtos: [],
      comment: null,
      soldAt: null,
    }
  }

  private populateFeedSaleSaveDtoWithFormValues(): void {
    this.feedSaleSaveFrontDto = {
      customerDto: {
        id: this.feedSaleForm?.get("customer.id")?.value,
        firstName: this.feedSaleForm?.get("customer.firstName")?.value,
        lastName: this.feedSaleForm?.get("customer.lastName")?.value,
        address: this.feedSaleForm?.get("customer.address")?.value,
        telephoneNumber: this.feedSaleForm?.get("customer.telephoneNumber")?.value,
        totalAmountDue: null,
      },
      feedSaleDetailsDtos: this.initialiseFeedSaleStocks(),
      paymentSaveDtos: this.paymentForm.value.payments,
      newCustomer: this.isNewCustomer,
      driverId: this.selectedDriver?.id,
      salesInvoiceCategory: this.salesInvoiceCategory,
      comment: this.comment,
      soldAt: this.paymentForm?.get("soldAt")?.value
    }
  }

  public initialiseFeedSaleStocks(): FeedSaleDetailsFrontDto[] {
    const feedStockDtos = this.feedsInCart.map(feedInCart => feedInCart.feedStockDto);
    const feedStockList: FeedSaleDetailsFrontDto[] = [];
    feedStockDtos.forEach(feedStocks => {
      feedStocks.filter(feedStocks => feedStocks.quantity != null && feedStocks.quantity > 0).forEach(feedStocks => {
        let feedStock: FeedSaleDetailsFrontDto = {
          feedStockId: feedStocks.feedStockId,
          quantity: feedStocks.quantity,
          price: feedStocks.price
        };
        feedStockList.push(feedStock);
      })
    })
    return feedStockList;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseFeedSaleSaveDto();
    this.populateFeedSaleSaveDtoWithFormValues();
    this.feedSaleSaveFrontDto.paymentSaveDtos?.forEach(payment => {
      payment.paymentDeadline = moment(payment.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
      payment.paymentModeId = payment.paymentModeId.id
    })
    this.feedSaleApiService.save(this.feedSaleSaveFrontDto).subscribe({
      next: (data: string) => {
        this.salesInvoiceCategory = SalesInvoiceCategory.IN_STORE;
        this.selectedDriver = null;
        this.comment = null;
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Feed(s) sold successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public reset(): void {
    this.initialiseSelectedCustomer();
    this.isNewCustomer = false;
    this.setCustomerNewValue(false);
    this.feedSaleForm.reset();
    this.subTotal = 0;
    this.initialiseFormBuilder();
    this.setCustomerNewValue(this.isNewCustomer);
    if (this.searchCustomerCtrl) {
      this.searchCustomerCtrl.setValue(null);
    }
    this.feedName = '';
    this.infiniteFeeds = [];
    this.feeds = new MatTableDataSource<FeedDto>([]);
    this.feedsInCart = [];
    this.feedsInCartTable = new MatTableDataSource<FeedStockSaleDetailsFrontDto>(this.feedsInCart);
  }
}
