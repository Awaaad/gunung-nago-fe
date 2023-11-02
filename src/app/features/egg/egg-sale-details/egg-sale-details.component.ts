import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentType, CustomerDto, SalesInvoiceCategory, UserDto } from 'generated-src/model';
import { CustomerFrontDto, EggSaleSaveFrontDto, EggStockFrontDto } from 'generated-src/model-front';
import * as moment from 'moment';
import { Subscription, filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { EggSaleApiService } from 'src/app/shared/apis/egg-sale.api.service';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-egg-sale-details',
  templateUrl: './egg-sale-details.component.html',
  styleUrls: ['./egg-sale-details.component.scss'],
})
export class EggSaleDetailsComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public isModalOpen: boolean = false;
  public language = "en";
  public eggStock!: EggStockFrontDto;
  public eggSaleForm!: FormGroup;
  public eggSaleSaveDto!: EggSaleSaveFrontDto;

  public bigGoodPiece: number = 0;
  public bigGoodPricePerPiece: number = 0;
  public bigGoodTie: number = 0;
  public bigGoodPricePerTie: number = 0;
  public bigGoodTray: number = 0;
  public bigGoodPricePerTray: number = 0;

  public mediumGoodPiece: number = 0;
  public mediumGoodPricePerPiece: number = 0;
  public mediumGoodTie: number = 0;
  public mediumGoodPricePerTie: number = 0;
  public mediumGoodTray: number = 0;
  public mediumGoodPricePerTray: number = 0;

  public smallGoodPiece: number = 0;
  public smallGoodPricePerPiece: number = 0;
  public smallGoodTie: number = 0;
  public smallGoodPricePerTie: number = 0;
  public smallGoodTray: number = 0;
  public smallGoodPricePerTray: number = 0;

  public badPiece: number = 0;
  public badPricePerPiece: number = 0;
  public badTie: number = 0;
  public badPricePerTie: number = 0;
  public badTray: number = 0;
  public badPricePerTray: number = 0;

  public big: boolean = false;
  public medium: boolean = false;
  public small: boolean = false;
  public bad: boolean = false;

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
  public paymentTypes: string[] = [];
  public totalPrice: number = 0;
  public totalCost: number = 0;
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
    paymentType: [
      { type: 'required', message: 'Payment mode is required' },
    ],
    minValue: [
      { type: 'min', message: 'Value cannot be less than 0' }
    ]
  };

  constructor(
    private customerApiService: CustomerApiService,
    private formBuilder: FormBuilder,
    private eggSaleApiService: EggSaleApiService,
    private eggStockApiService: EggStockApiService,
    private securityApiService: SecurityApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getEggStock();
    this.initialiseFormBuilder();
    this.initialiseSelectedCustomer();
    this.searchCustomerAutoComplete();
    this.paymentTypes = Object.keys(PaymentType);
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
  }

  ionViewWillEnter(): void {
    this.getEggStock();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getEggStock(): void {
    this.eggStock = {
      totalEggs: 0,
      bigEggs: 0,
      mediumEggs: 0,
      smallEggs: 0,
      goodEggs: 0,
      badEggs: 0,
      createdBy: '',
      lastModifiedBy: 0,
      createdDate: '',
      lastModifiedDate: 0,
    }
    this.eggStockApiService.findEggStockForSale().subscribe(eggStock => {
      this.eggStock = eggStock;
      this.setCheckbox(eggStock);
    })
  }

  public newCustomerChange(event: any): void {
    this.isNewCustomer = event.detail.checked;
    this.setCustomerNewValue(this.isNewCustomer);
  }

  private setCustomerNewValue(isNewCustomer: boolean): void {
    isNewCustomer ? this.eggSaleForm?.get("customer.firstName")?.enable() : this.eggSaleForm?.get("customer.firstName")?.disable();
    isNewCustomer ? this.eggSaleForm?.get("customer.lastName")?.enable() : this.eggSaleForm?.get("customer.lastName")?.disable();
    isNewCustomer ? this.eggSaleForm?.get("customer.address")?.enable() : this.eggSaleForm?.get("customer.address")?.disable();
    isNewCustomer ? this.eggSaleForm?.get("customer.telephoneNumber")?.enable() : this.eggSaleForm?.get("customer.telephoneNumber")?.disable();
    if (this.isNewCustomer) {
      this.eggSaleForm?.get("customer.firstName")?.setValue("");
      this.eggSaleForm?.get("customer.lastName")?.setValue("");
      this.eggSaleForm?.get("customer.address")?.setValue("");
      this.eggSaleForm?.get("customer.telephoneNumber")?.setValue("");
    }
  }

  private setCheckbox(eggStock: EggStockFrontDto): void {
    eggStock.bigEggs > 0 ? this.eggSaleForm?.get("big")?.enable() : this.eggSaleForm?.get("big")?.disable();
    eggStock.mediumEggs > 0 ? this.eggSaleForm?.get("medium")?.enable() : this.eggSaleForm?.get("medium")?.disable();
    eggStock.smallEggs > 0 ? this.eggSaleForm?.get("small")?.enable() : this.eggSaleForm?.get("small")?.disable();
    eggStock.badEggs > 0 ? this.eggSaleForm?.get("bad")?.enable() : this.eggSaleForm?.get("bad")?.disable();
  }

  public bigCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.bigGoodPiece = 0;
      this.bigGoodPricePerPiece = 0;
      this.bigGoodTray = 0;
      this.bigGoodPricePerTray = 0;
      this.bigGoodTie = 0;
      this.bigGoodPricePerTie = 0;
    }
  }
  public mediumCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.mediumGoodPiece = 0;
      this.mediumGoodPricePerPiece = 0;
      this.mediumGoodTray = 0;
      this.mediumGoodPricePerTray = 0;
      this.mediumGoodTie = 0;
      this.mediumGoodPricePerTie = 0;
    }
  }
  public smallCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.smallGoodPiece = 0;
      this.smallGoodPricePerPiece = 0;
      this.smallGoodTray = 0;
      this.smallGoodPricePerTray = 0;
      this.smallGoodTie = 0;
      this.smallGoodPricePerTie = 0;
    }
  }
  public badCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.badPiece = 0;
      this.badPricePerPiece = 0;
      this.badTray = 0;
      this.badPricePerTray = 0;
      this.badTie = 0;
      this.badPricePerTie = 0;
    }
  }

  private initialiseFormBuilder(): void {
    this.eggSaleForm = this.formBuilder.group({
      newCustomer: new FormControl(this.isNewCustomer, Validators.compose([Validators.required])),
      big: new FormControl({ value: this.big, disabled: false }, Validators.compose([Validators.required])),
      medium: new FormControl({ value: this.medium, disabled: false }, Validators.compose([Validators.required])),
      small: new FormControl({ value: this.small, disabled: false }, Validators.compose([Validators.required])),
      bad: new FormControl({ value: this.bad, disabled: false }, Validators.compose([Validators.required])),
      customer: this.formBuilder.group({
        id: this.selectedCustomer?.id,
        firstName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        lastName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        address: new FormControl({ value: '', disabled: !this.isNewCustomer }),
        telephoneNumber: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"),]))
      }),
      bigGoodPiece: new FormControl(this.bigGoodPiece, Validators.compose([Validators.min(0)])),
      bigGoodPricePerPiece: new FormControl(this.bigGoodPricePerPiece, Validators.compose([Validators.min(0)])),
      bigGoodTie: new FormControl(this.bigGoodTie, Validators.compose([Validators.min(0)])),
      bigGoodPricePerTie: new FormControl(this.bigGoodPricePerTie, Validators.compose([Validators.min(0)])),
      bigGoodTray: new FormControl(this.bigGoodTray, Validators.compose([Validators.min(0)])),
      bigGoodPricePerTray: new FormControl(this.bigGoodPricePerTray, Validators.compose([Validators.min(0)])),

      mediumGoodPiece: new FormControl(this.mediumGoodPiece, Validators.compose([Validators.min(0)])),
      mediumGoodPricePerPiece: new FormControl(this.mediumGoodPricePerPiece, Validators.compose([Validators.min(0)])),
      mediumGoodTie: new FormControl(this.mediumGoodTie, Validators.compose([Validators.min(0)])),
      mediumGoodPricePerTie: new FormControl(this.mediumGoodPricePerTie, Validators.compose([Validators.min(0)])),
      mediumGoodTray: new FormControl(this.mediumGoodTray, Validators.compose([Validators.min(0)])),
      mediumGoodPricePerTray: new FormControl(this.mediumGoodPricePerTray, Validators.compose([Validators.min(0)])),

      smallGoodPiece: new FormControl(this.smallGoodPiece, Validators.compose([Validators.min(0)])),
      smallGoodPricePerPiece: new FormControl(this.smallGoodPricePerPiece, Validators.compose([Validators.min(0)])),
      smallGoodTie: new FormControl(this.smallGoodTie, Validators.compose([Validators.min(0)])),
      smallGoodPricePerTie: new FormControl(this.smallGoodPricePerTie, Validators.compose([Validators.min(0)])),
      smallGoodTray: new FormControl(this.smallGoodTray, Validators.compose([Validators.min(0)])),
      smallGoodPricePerTray: new FormControl(this.smallGoodPricePerTray, Validators.compose([Validators.min(0)])),

      badPiece: new FormControl(this.badPiece, Validators.compose([Validators.min(0)])),
      badPricePerPiece: new FormControl(this.badPricePerPiece, Validators.compose([Validators.min(0)])),
      badTie: new FormControl(this.badTie, Validators.compose([Validators.min(0)])),
      badPricePerTie: new FormControl(this.badPricePerTie, Validators.compose([Validators.min(0)])),
      badTray: new FormControl(this.badTray, Validators.compose([Validators.min(0)])),
      badPricePerTray: new FormControl(this.badPricePerTray, Validators.compose([Validators.min(0)]))
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
    this.eggSaleForm?.get("customer.firstName")?.setValue("");
    this.eggSaleForm?.get("customer.lastName")?.setValue("");
    this.eggSaleForm?.get("customer.address")?.setValue("");
    this.eggSaleForm?.get("customer.telephoneNumber")?.setValue("");
    this.initialiseSelectedCustomer();
  }

  public setSelectedCustomer(event: any): void {
    this.selectedCustomer = event.option.value;
    this.selectedCustomer.id = event.option.value.id;
    this.eggSaleForm?.get("customer.id")?.setValue(event.option.value.id);
    this.eggSaleForm?.get("customer.firstName")?.setValue(event.option.value.firstName);
    this.eggSaleForm?.get("customer.lastName")?.setValue(event.option.value.lastName);
    this.eggSaleForm?.get("customer.address")?.setValue(event.option.value.address);
    this.eggSaleForm?.get("customer.telephoneNumber")?.setValue(event.option.value.telephoneNumber);
    this.eggSaleForm?.get("newCustomer")?.setValue(false);
  }

  private initialiseEggSaleSaveDto(): void {
    this.eggSaleSaveDto = {
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
      big: false,
      medium: false,
      small: false,
      bad: false,
      bigGoodPiece: 0,
      bigGoodPricePerPiece: 0,
      bigGoodTie: 0,
      bigGoodPricePerTie: 0,
      bigGoodTray: 0,
      bigGoodPricePerTray: 0,

      mediumGoodPiece: 0,
      mediumGoodPricePerPiece: 0,
      mediumGoodTie: 0,
      mediumGoodPricePerTie: 0,
      mediumGoodTray: 0,
      mediumGoodPricePerTray: 0,

      smallGoodPiece: 0,
      smallGoodPricePerPiece: 0,
      smallGoodTie: 0,
      smallGoodPricePerTie: 0,
      smallGoodTray: 0,
      smallGoodPricePerTray: 0,

      badPiece: 0,
      badPricePerPiece: 0,
      badTie: 0,
      badPricePerTie: 0,
      badTray: 0,
      badPricePerTray: 0
    }
  }

  private populateFlockSaleSaveDtoWithFormValues(): void {
    this.eggSaleSaveDto = {
      customerDto: {
        id: this.eggSaleForm?.get("customer.id")?.value,
        firstName: this.eggSaleForm?.get("customer.firstName")?.value,
        lastName: this.eggSaleForm?.get("customer.lastName")?.value,
        address: this.eggSaleForm?.get("customer.address")?.value,
        telephoneNumber: this.eggSaleForm?.get("customer.telephoneNumber")?.value,
        totalAmountDue: null,
      },
      driverId: this.selectedDriver ? this.selectedDriver.id : null,
      salesInvoiceCategory: this.salesInvoiceCategory,
      comment: this.comment,
      paymentSaveDtos: this.paymentForm.value.payments,
      newCustomer: this.isNewCustomer,
      big: this.big,
      medium: this.medium,
      small: this.small,
      bad: this.bad,

      bigGoodPiece: this.bigGoodPiece,
      bigGoodPricePerPiece: this.bigGoodPricePerPiece,
      bigGoodTie: this.bigGoodTie,
      bigGoodPricePerTie: this.bigGoodPricePerTie,
      bigGoodTray: this.bigGoodTray,
      bigGoodPricePerTray: this.bigGoodPricePerTray,

      mediumGoodPiece: this.mediumGoodPiece,
      mediumGoodPricePerPiece: this.mediumGoodPricePerPiece,
      mediumGoodTie: this.mediumGoodTie,
      mediumGoodPricePerTie: this.mediumGoodPricePerTie,
      mediumGoodTray: this.mediumGoodTray,
      mediumGoodPricePerTray: this.mediumGoodPricePerTray,

      smallGoodPiece: this.smallGoodPiece,
      smallGoodPricePerPiece: this.smallGoodPricePerPiece,
      smallGoodTie: this.smallGoodTie,
      smallGoodPricePerTie: this.smallGoodPricePerTie,
      smallGoodTray: this.smallGoodTray,
      smallGoodPricePerTray: this.smallGoodPricePerTray,

      badPiece: this.badPiece,
      badPricePerPiece: this.badPricePerPiece,
      badTie: this.badTie,
      badPricePerTie: this.badPricePerTie,
      badTray: this.badTray,
      badPricePerTray: this.badPricePerTray
    }
  }

  private checkIfCreditAllowed(): boolean {
    return (this.selectedCustomer != null && this.selectedCustomer.id != null) || (this.isNewCustomer && this.eggSaleForm?.get("customer.telephoneNumber")?.value != '');
  }

  addPaymentFormGroup() {
    return this.formBuilder.group({
      amountPaid: new FormControl(0, Validators.compose([
        Validators.required,
        Validators.min(0)
      ])),
      paymentType: new FormControl('CASH', Validators.compose([
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
    if (totalAmountPaid <= this.paymentForm.get('totalPrice')?.value) {
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
    if (totalAmountPaid === this.paymentForm.get('totalPrice')?.value) {
      return true;
    } else {
      return false;
    }
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseEggSaleSaveDto();
    this.populateFlockSaleSaveDtoWithFormValues();
    this.eggSaleSaveDto.paymentSaveDtos?.forEach(payment => {
      payment.paymentDeadline = moment(payment.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
    })
    this.eggSaleApiService.save(this.eggSaleSaveDto).subscribe({
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
    this.totalCost = 0;
    this.isNewCustomer = false;
    this.setCustomerNewValue(false);
    this.eggSaleForm.reset();
    this.resetFormValues();
    this.initialiseFormBuilder();
    if (this.paymentForm) {
      this.paymentForm.reset();
      (this.paymentForm.get('payments') as FormArray).clear();
    }
    this.setCustomerNewValue(this.isNewCustomer);
    if (this.searchCustomerCtrl) {
      this.searchCustomerCtrl.setValue(null);
    }
    this.getEggStock();
  }

  private resetFormValues(): void {
    this.bigGoodPiece = 0;
    this.bigGoodPricePerPiece = 0;
    this.bigGoodTray = 0;
    this.bigGoodPricePerTray = 0;
    this.bigGoodTie = 0;
    this.bigGoodPricePerTie = 0;
    this.mediumGoodPiece = 0;
    this.mediumGoodPricePerPiece = 0;
    this.mediumGoodTray = 0;
    this.mediumGoodPricePerTray = 0;
    this.mediumGoodTie = 0;
    this.mediumGoodPricePerTie = 0;
    this.smallGoodPiece = 0;
    this.smallGoodPricePerPiece = 0;
    this.smallGoodTray = 0;
    this.smallGoodPricePerTray = 0;
    this.smallGoodTie = 0;
    this.smallGoodPricePerTie = 0;
    this.badPiece = 0;
    this.badPricePerPiece = 0;
    this.badTray = 0;
    this.badPricePerTray = 0;
    this.badTie = 0;
    this.badPricePerTie = 0;
  }

  public calculateTotalCost(): void {
    this.totalCost =
    (this.eggSaleForm.get('bigGoodPiece')?.value * this.eggSaleForm.get('bigGoodPricePerPiece')?.value) + 
    (this.eggSaleForm.get('bigGoodTray')?.value * this.eggSaleForm.get('bigGoodPricePerTray')?.value) + 
    (this.eggSaleForm.get('bigGoodTie')?.value * this.eggSaleForm.get('bigGoodPricePerTie')?.value) + 
    (this.eggSaleForm.get('mediumGoodPiece')?.value * this.eggSaleForm.get('mediumGoodPricePerPiece')?.value) + 
    (this.eggSaleForm.get('mediumGoodTray')?.value * this.eggSaleForm.get('mediumGoodPricePerTray')?.value) + 
    (this.eggSaleForm.get('mediumGoodTie')?.value * this.eggSaleForm.get('mediumGoodPricePerTie')?.value) + 
    (this.eggSaleForm.get('smallGoodPiece')?.value * this.eggSaleForm.get('smallGoodPricePerPiece')?.value) + 
    (this.eggSaleForm.get('smallGoodTray')?.value * this.eggSaleForm.get('smallGoodPricePerTray')?.value) + 
    (this.eggSaleForm.get('smallGoodTie')?.value * this.eggSaleForm.get('smallGoodPricePerTie')?.value) + 
    (this.eggSaleForm.get('badPiece')?.value * this.eggSaleForm.get('badPricePerPiece')?.value) + 
    (this.eggSaleForm.get('badTray')?.value * this.eggSaleForm.get('badPricePerTray')?.value) + 
    (this.eggSaleForm.get('badTie')?.value * this.eggSaleForm.get('badPricePerTie')?.value);
  }

  private initialisePaymentFormBuilder(): void {
    this.totalPrice =
      (this.bigGoodPiece * this.bigGoodPricePerPiece) +
      (this.bigGoodTray * this.bigGoodPricePerTray) +
      (this.bigGoodTie * this.bigGoodPricePerTie) +
      (this.mediumGoodPiece * this.mediumGoodPricePerPiece) +
      (this.mediumGoodTray * this.mediumGoodPricePerTray) +
      (this.mediumGoodTie * this.mediumGoodPricePerTie) +
      (this.smallGoodPiece * this.smallGoodPricePerPiece) +
      (this.smallGoodTray * this.smallGoodPricePerTray) +
      (this.smallGoodTie * this.smallGoodPricePerTie) +
      (this.badPiece * this.badPricePerPiece) +
      (this.badTray * this.badPricePerTray) +
      (this.badTie * this.badPricePerTie);
    this.paymentForm = this.formBuilder.group({
      totalPrice: new FormControl({ value: this.totalPrice, disabled: true }, Validators.compose([Validators.required])),
      payments: this.formBuilder.array([
        this.addPaymentFormGroup()
      ])
    });
  }

  public openModal(): void {
    if (!this.checkIfCreditAllowed()) {
      this.paymentTypes = this.paymentTypes.filter(payment => payment != PaymentType.CREDIT);
    } else {
      this.paymentTypes = Object.keys(PaymentType);
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

  public validatePiece(event: any): void {
    if (event > 30) {
      this.badPiece = 30;
    } else if (event < 0) {
      this.badPiece = 0;
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
