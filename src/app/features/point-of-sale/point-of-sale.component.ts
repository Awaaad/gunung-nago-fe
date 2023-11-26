import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ManureStockDto, SalesInvoiceCategory, UserDto, CustomerDto, SalesInvoiceType, EggQuantityType, FlockType, EggType, CageCategory, CageDto, SurveyDto, FlockStockCountDto, EggCategoryStockDto, BankAccountDto, PaymentModeDto } from 'generated-src/model';
import { CustomerFrontDto, SaleDetailsFrontDto, SaleSaveFrontDto, EggStockFrontDto, SalesInvoiceDetailsFrontDto } from 'generated-src/model-front';
import * as moment from 'moment';
import { Subscription, filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { environment } from 'src/environments/environment';
import { OverlayEventDetail } from '@ionic/core/components';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { SurveyApiService } from 'src/app/shared/apis/survey.api.service';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { PointOfSaleApiService } from 'src/app/shared/apis/point-of-sale.api.service';
import { ActivatedRoute } from '@angular/router';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.scss'],
})
export class PointOfSaleComponent implements OnInit {
  public salesInvoiceDetailsFrontDto!: SalesInvoiceDetailsFrontDto;
  public salesInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('salesInvoiceId');

  @ViewChild(IonModal) modal!: IonModal;
  public isModalOpen: boolean = false;
  public language = "en";
  public saleForm!: FormGroup;
  public quantity!: number;
  public price!: number;

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

  public paymentForm!: FormGroup;
  public totalPrice: number = 0;
  public today: Date = new Date();
  public salesInvoiceCategories: string[] = [];
  public salesInvoiceCategory: SalesInvoiceCategory = SalesInvoiceCategory.IN_STORE;
  public showDriver: boolean = false;
  public drivers: UserDto[] = [];
  public selectedDriver!: UserDto | null;
  public comment!: string | null;

  public company = environment.company;
  public address = environment.address;
  public phone = environment.phone;
  public email = environment.email;
  public regNo = environment.regNo;
  public yoe = environment.yoe;

  public showFlock: boolean = false;
  public showEgg: boolean = false;
  public showManure: boolean = false;

  public cages: CageDto[] = [];
  public eggStock!: EggStockFrontDto;
  public manureStock!: ManureStockDto;
  public flockStockCountDto!: FlockStockCountDto;
  public saleSaveDto!: SaleSaveFrontDto;
  public saleDetailDto!: SaleDetailsFrontDto;
  public saleDetailsDto: SaleDetailsFrontDto[] = [];
  public salesInvoiceTypes: string[] = [];
  public eggQuantityTypes: string[] = [];
  public flockTypes: string[] = [];
  public eggTypes: string[] = [];

  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];
  public completePaymentModes: PaymentModeDto[] = [];

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
    private cageApiService: CageApiService,
    private customerApiService: CustomerApiService,
    private formBuilder: FormBuilder,
    private flockApiService: FlockApiService,
    private eggStockApiService: EggStockApiService,
    private manureStockApiService: ManureStockApiService,
    private securityApiService: SecurityApiService,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService,
    private pointOfSaleApiService: PointOfSaleApiService,
    private utilsService: UtilsService,
    private readonly activatedRoute: ActivatedRoute,
    private salesInvoiceApiService: SalesInvoiceApiService,
    private bankAccountApiService: BankAccountApiService,
    private paymentModeApiService: PaymentModeApiService
  ) { }

  async ngOnInit() {
    this.initialiseFormBuilder();
    if (this.salesInvoiceId !== null) {
      this.findSalesInvoiceDetailsById();
    }
    else {
      this.initialiseSelectedCustomer();
    }

    this.searchCustomerAutoComplete();
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
    this.eggQuantityTypes = Object.keys(EggQuantityType);
    this.flockTypes = Object.keys(FlockType);
    this.eggTypes = Object.keys(EggType);
    this.getAllActiveCages();
    this.addSaleDetailsToStock();
    this.getEggStock();
    this.getManureStock();
    this.findTotalFlockStockCount();
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

  public findSalesInvoiceDetailsById(): void {
    this.salesInvoiceApiService.findSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(salesInvoiceDetailsFrontDto => {
      this.salesInvoiceDetailsFrontDto = salesInvoiceDetailsFrontDto;
      this.initialiseCustomerOnSalesInvoiceEdit();
      this.saleForm?.get("customer.firstName")?.setValue(salesInvoiceDetailsFrontDto.customerFirstName);
      this.saleForm?.get("customer.lastName")?.setValue(salesInvoiceDetailsFrontDto.customerLastName);
      this.saleForm?.get("customer.address")?.setValue(salesInvoiceDetailsFrontDto.customerAddress);
      this.saleForm?.get("customer.telephoneNumber")?.setValue(salesInvoiceDetailsFrontDto.customerTelephoneNumber);

      this.salesInvoiceDetailsFrontDto.saleDetailsDtos?.forEach(saleDetail => {
        this.saleDetailDto.amount = saleDetail.quantity;
        this.saleDetailDto.cageId = saleDetail.cageId;
        this.saleDetailDto.eggQuantityType = saleDetail.eggQuantityType;
        this.saleDetailDto.eggType = saleDetail.eggType;
        this.saleDetailDto.flockId = saleDetail.flockId;
        this.saleDetailDto.flockType = saleDetail.flockType;
        this.saleDetailDto.goodChicken = "";
        this.saleDetailDto.price = saleDetail.price;
        this.saleDetailDto.quantity = saleDetail.quantity;
        this.saleDetailDto.salesInvoiceType = saleDetail.salesInvoiceType;
        this.saleDetailDto.sterileChicken = "";
      }
      );
    })
  }

  ionViewWillEnter(): void {
    this.salesInvoiceTypes = Object.keys(SalesInvoiceType);
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private initialiseSaleDetailDto(): void {
    this.saleDetailDto = {
      salesInvoiceType: null,
      quantity: 0,
      price: 0,
      eggCategoryId: null,
      eggType: null,
      eggQuantityType: null,
      cageId: null,
      flockType: null,
      amount: null,
      sterileChicken: null,
      goodChicken: null,
      flockId: null,
      eggInitialQuantity: null
    }
  }

  public getAllActiveCages() {
    this.cageApiService.getAllActiveCages().subscribe(cages => {
      this.cages = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.NORM || cage.cageCategory === CageCategory.DARA);
    })
  }

  public ionSelectType(event: any) {
    if (event.detail.value === 'FLOCK') {
      this.showFlock = true;
      this.showEgg = false;
      this.showManure = false;
    } else if (event.detail.value === 'MANURE') {
      this.showFlock = false;
      this.showEgg = false;
      this.showManure = true;
    } else if (event.detail.value === 'EGG') {
      this.showFlock = false;
      this.showEgg = true;
      this.showManure = false;
    }
  }

  public ionSelectCage(event: any, index: number) {
    const cageId = event.detail.value;
    this.findMostRecentSurveyDtoForCage(cageId, index);
  }

  public ionSelectEggCategory(event: any, index: number) {
    const eggCategoryId = event.detail.value;
    const eggStock = this.eggStock.eggCategoryStockDtos.find((eggCategoryStock: EggCategoryStockDto) => eggCategoryStock.eggCategoryId === eggCategoryId);
    this.saleDetailsDto[index].eggInitialQuantity = eggStock.quantity;
    this.saleDetailsDto[index].eggType = eggStock.name;
  }

  private getEggStock(): void {
    this.eggStock = {
      goodEggs: null,
      badEggs: null,
      totalEggs: null,
      eggCategoryStockDtos: [],
      createdBy: '',
      lastModifiedBy: 0,
      createdDate: '',
      lastModifiedDate: 0,
    }
    this.eggStockApiService.findEggStockForSale().subscribe(eggStock => {
      this.eggStock = eggStock;
    })
  }

  private getManureStock(): void {
    this.manureStock = {
      weight: 0,
      bags: 0
    }
    this.manureStockApiService.findManureStockForSale().subscribe(manureStock => {
      this.manureStock = manureStock;
    })
  }

  private findTotalFlockStockCount(): void {
    this.flockStockCountDto = {
      alive: 0,
      sterile: 0,
      dead: 0,
      good: 0
    }
    this.flockApiService.findTotalFlockStockCount().subscribe(flockStockCountDto => {
      this.flockStockCountDto = flockStockCountDto;
    })
  }


  private findMostRecentSurveyDtoForCage(cageId: number, index: number): void {
    this.surveyApiService.findMostRecentSurveyDtoForCage(cageId).subscribe((surveyDetails: SurveyDto) => {
      this.saleDetailsDto[index].sterileChicken = surveyDetails.sterile;
      this.saleDetailsDto[index].goodChicken = surveyDetails.good;
      this.saleDetailsDto[index].flockId = surveyDetails.flockId;
    });
  }

  public addSaleDetailsToStock(): void {
    this.initialiseSaleDetailDto();
    this.saleDetailsDto.push(this.saleDetailDto);
  }

  public calculateTotalPrice(): void {
    this.totalPrice = 0;
    this.saleDetailsDto.forEach(saleDetailDto => {
      this.totalPrice = this.totalPrice + (saleDetailDto.quantity * saleDetailDto.price);
    })
  }

  public newCustomerChange(event: any): void {
    this.isNewCustomer = event.detail.checked;
    this.setCustomerNewValue(this.isNewCustomer);
  }

  private setCustomerNewValue(isNewCustomer: boolean): void {
    isNewCustomer ? this.saleForm?.get("customer.firstName")?.enable() : this.saleForm?.get("customer.firstName")?.disable();
    isNewCustomer ? this.saleForm?.get("customer.lastName")?.enable() : this.saleForm?.get("customer.lastName")?.disable();
    isNewCustomer ? this.saleForm?.get("customer.address")?.enable() : this.saleForm?.get("customer.address")?.disable();
    isNewCustomer ? this.saleForm?.get("customer.telephoneNumber")?.enable() : this.saleForm?.get("customer.telephoneNumber")?.disable();
    if (this.isNewCustomer) {
      this.saleForm?.get("customer.firstName")?.setValue("");
      this.saleForm?.get("customer.lastName")?.setValue("");
      this.saleForm?.get("customer.address")?.setValue("");
      this.saleForm?.get("customer.telephoneNumber")?.setValue("");
    }
  }

  private initialiseFormBuilder(): void {
    this.saleForm = this.formBuilder.group({
      newCustomer: new FormControl(this.isNewCustomer, Validators.compose([Validators.required])),
      customer: this.formBuilder.group({
        id: this.selectedCustomer?.id,
        firstName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        lastName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        address: new FormControl({ value: '', disabled: !this.isNewCustomer }),
        telephoneNumber: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"),]))
      }),
      quantity: new FormControl(this.quantity, Validators.compose([Validators.min(0)])),
      price: new FormControl(this.price, Validators.compose([Validators.min(0)]))
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

  private initialiseCustomerOnSalesInvoiceEdit(): void {
    this.selectedCustomer = {
      id: "",
      firstName: this.salesInvoiceDetailsFrontDto.customerFirstName,
      lastName: this.salesInvoiceDetailsFrontDto.customerLastName,
      address: this.salesInvoiceDetailsFrontDto.customerAddress,
      telephoneNumber: this.salesInvoiceDetailsFrontDto.customerTelephoneNumber,
      totalAmountDue: this.salesInvoiceDetailsFrontDto.totalPrice
    };

  }

  public clearCustomer(ctrl: FormControl): void {
    ctrl.setValue(null);
    this.saleForm?.get("customer.firstName")?.setValue("");
    this.saleForm?.get("customer.lastName")?.setValue("");
    this.saleForm?.get("customer.address")?.setValue("");
    this.saleForm?.get("customer.telephoneNumber")?.setValue("");
    this.initialiseSelectedCustomer();
  }

  public setSelectedCustomer(event: any): void {
    this.selectedCustomer = event.option.value;
    this.selectedCustomer.id = event.option.value.id;
    this.saleForm?.get("customer.id")?.setValue(event.option.value.id);
    this.saleForm?.get("customer.firstName")?.setValue(event.option.value.firstName);
    this.saleForm?.get("customer.lastName")?.setValue(event.option.value.lastName);
    this.saleForm?.get("customer.address")?.setValue(event.option.value.address);
    this.saleForm?.get("customer.telephoneNumber")?.setValue(event.option.value.telephoneNumber);
    this.saleForm?.get("newCustomer")?.setValue(false);
  }


  private checkIfCreditAllowed(): boolean {
    return (this.selectedCustomer != null && this.selectedCustomer.id != null) || (this.isNewCustomer && this.saleForm?.get("customer.telephoneNumber")?.value != '');
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

  private initialiseSaleSaveDto(): void {
    this.saleSaveDto = {
      customerDto: {
        id: null,
        firstName: null,
        lastName: null,
        address: null,
        telephoneNumber: null,
        totalAmountDue: null,
      },
      driverId: null,
      salesInvoiceCategory: null,
      comment: null,
      paymentSaveDtos: [],
      newCustomer: false,
      saleDetailsDtos: [],
      soldAt: null
    }
  }

  private populateSaleSaveDtoWithValues(): void {
    this.saleSaveDto = {
      customerDto: {
        id: this.saleForm?.get("customer.id")?.value,
        firstName: this.saleForm?.get("customer.firstName")?.value,
        lastName: this.saleForm?.get("customer.lastName")?.value,
        address: this.saleForm?.get("customer.address")?.value,
        telephoneNumber: this.saleForm?.get("customer.telephoneNumber")?.value,
        totalAmountDue: null,
      },
      driverId: this.selectedDriver ? this.selectedDriver.id : null,
      salesInvoiceCategory: this.salesInvoiceCategory,
      comment: this.comment,
      paymentSaveDtos: this.paymentForm.value.payments,
      newCustomer: this.isNewCustomer,
      saleDetailsDtos: this.saleDetailsDto,
      soldAt: this.paymentForm?.get("soldAt")?.value
    }
  }

  public save(): void {
    this.utilsService.presentLoading();
    if (this.salesInvoiceId !== null) {
      this.salesInvoiceApiService.cancelSalesInvoiceStatus(this.salesInvoiceId).subscribe();
    }
    this.initialiseSaleSaveDto();
    this.populateSaleSaveDtoWithValues();
    this.saleSaveDto.paymentSaveDtos?.forEach(payment => {
      payment.paymentDeadline = moment(payment.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
      payment.paymentModeId = payment.paymentModeId.id
    })
    this.pointOfSaleApiService.save(this.saleSaveDto).subscribe({
      next: (data: string) => {
        this.salesInvoiceCategory = SalesInvoiceCategory.IN_STORE;
        this.selectedDriver = null;
        this.comment = null;
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock sold successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public reset(): void {
    this.isNewCustomer = false;
    this.setCustomerNewValue(false);
    this.saleForm.reset();
    this.quantity = 0;
    this.price = 0;
    this.totalPrice = 0;
    this.saleDetailsDto = [];
    this.initialiseFormBuilder();
    this.setCustomerNewValue(this.isNewCustomer);
    this.initialiseSaleDetailDto();
    this.addSaleDetailsToStock();
    this.getEggStock();
    this.findTotalFlockStockCount();
    if (this.searchCustomerCtrl) {
      this.searchCustomerCtrl.setValue(null);
    }
  }

  private initialisePaymentFormBuilder(): void {
    this.paymentForm = this.formBuilder.group({
      totalPrice: new FormControl({ value: this.totalPrice, disabled: true }, Validators.compose([Validators.required])),
      soldAt: new FormControl({ value: this.totalPrice, disabled: false }, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(this.totalPrice),
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
}

