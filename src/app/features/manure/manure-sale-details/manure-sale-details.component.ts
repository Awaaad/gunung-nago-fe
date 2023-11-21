import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CustomerDto, ManureStockDto, PaymentType, SalesInvoiceCategory, UserDto } from 'generated-src/model';
import { CustomerFrontDto, ManureSaleSaveFrontDto } from 'generated-src/model-front';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { ManureSaleApiService } from 'src/app/shared/apis/manure-sale.api.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import * as moment from 'moment';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manure-sale-details',
  templateUrl: './manure-sale-details.component.html',
  styleUrls: ['./manure-sale-details.component.scss'],
})
export class ManureSaleDetailsComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public isModalOpen: boolean = false;
  public language = "en";
  public manureStock!: ManureStockDto;
  public manureSaleSaveFrontDto!: ManureSaleSaveFrontDto;
  public manureSaleForm!: FormGroup;
  public quantity: number = 0;
  public price: number = 0;

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
    ],
    maxValue: [
      { type: 'max', message: 'Value cannot be greater than quantity in stock' }
    ]
  };

  constructor(
    private customerApiService: CustomerApiService,
    private formBuilder: FormBuilder,
    private manureSaleApiService: ManureSaleApiService,
    private manureStockApiService: ManureStockApiService,
    private securityApiService: SecurityApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getManureStock();
    this.initialiseFormBuilder();
    this.initialiseSelectedCustomer();
    this.searchCustomerAutoComplete();
    this.paymentTypes = Object.keys(PaymentType);
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
  }

  ionViewWillEnter(): void {
    this.getManureStock();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public getManureStock() {
    this.manureStock = {
      weight: 0,
      bags: 0
    }
    this.manureStockApiService.findManureStockForSale().subscribe(manureStock => {
      this.manureStock = manureStock;
    })
  }

  public newCustomerChange(event: any): void {
    this.isNewCustomer = event.detail.checked;
    this.setCustomerNewValue(this.isNewCustomer);
  }

  private setCustomerNewValue(isNewCustomer: boolean): void {
    isNewCustomer ? this.manureSaleForm?.get("customer.firstName")?.enable() : this.manureSaleForm?.get("customer.firstName")?.disable();
    isNewCustomer ? this.manureSaleForm?.get("customer.lastName")?.enable() : this.manureSaleForm?.get("customer.lastName")?.disable();
    isNewCustomer ? this.manureSaleForm?.get("customer.address")?.enable() : this.manureSaleForm?.get("customer.address")?.disable();
    isNewCustomer ? this.manureSaleForm?.get("customer.telephoneNumber")?.enable() : this.manureSaleForm?.get("customer.telephoneNumber")?.disable();
    if (this.isNewCustomer) {
      this.manureSaleForm?.get("customer.firstName")?.setValue("");
      this.manureSaleForm?.get("customer.lastName")?.setValue("");
      this.manureSaleForm?.get("customer.address")?.setValue("");
      this.manureSaleForm?.get("customer.telephoneNumber")?.setValue("");
    }
  }

  private initialiseFormBuilder(): void {
    this.manureSaleForm = this.formBuilder.group({
      newCustomer: new FormControl(this.isNewCustomer, Validators.compose([Validators.required])),
      customer: this.formBuilder.group({
        id: this.selectedCustomer?.id,
        firstName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        lastName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        address: new FormControl({ value: '', disabled: !this.isNewCustomer }),
        telephoneNumber: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"),]))
      }),
      quantity: new FormControl(this.quantity, Validators.compose([Validators.min(0)])),
      price: new FormControl(this.price, Validators.compose([Validators.min(0)])),
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
    this.manureSaleForm?.get("customer.firstName")?.setValue("");
    this.manureSaleForm?.get("customer.lastName")?.setValue("");
    this.manureSaleForm?.get("customer.address")?.setValue("");
    this.manureSaleForm?.get("customer.telephoneNumber")?.setValue("");
    this.initialiseSelectedCustomer();
  }

  public setSelectedCustomer(event: any): void {
    this.selectedCustomer = event.option.value;
    this.selectedCustomer.id = event.option.value.id;
    this.manureSaleForm?.get("customer.id")?.setValue(event.option.value.id);
    this.manureSaleForm?.get("customer.firstName")?.setValue(event.option.value.firstName);
    this.manureSaleForm?.get("customer.lastName")?.setValue(event.option.value.lastName);
    this.manureSaleForm?.get("customer.address")?.setValue(event.option.value.address);
    this.manureSaleForm?.get("customer.telephoneNumber")?.setValue(event.option.value.telephoneNumber);
    this.manureSaleForm?.get("newCustomer")?.setValue(false);
  }

  private initialiseManureSaleSaveDto(): void {
    this.manureSaleSaveFrontDto = {
      customerDto: {
        id: null,
        firstName: null,
        lastName: null,
        address: null,
        telephoneNumber: null,
        totalAmountDue: null,
      },
      quantity: null,
      price: null,
      paymentSaveDtos: [],
      newCustomer: false,
      driverId: null,
      salesInvoiceCategory: null,
      comment: null,
      soldAt: null,
    }
  }

  private populateManureSaleSaveDtoWithFormValues(): void {
    this.manureSaleSaveFrontDto = {
      customerDto: {
        id: this.manureSaleForm?.get("customer.id")?.value,
        firstName: this.manureSaleForm?.get("customer.firstName")?.value,
        lastName: this.manureSaleForm?.get("customer.lastName")?.value,
        address: this.manureSaleForm?.get("customer.address")?.value,
        telephoneNumber: this.manureSaleForm?.get("customer.telephoneNumber")?.value,
        totalAmountDue: null,
      },
      paymentSaveDtos: this.paymentForm.value.payments,
      newCustomer: this.isNewCustomer,
      driverId: this.selectedDriver?.id,
      salesInvoiceCategory: this.salesInvoiceCategory,
      quantity: this.quantity,
      price: this.price,
      comment: this.comment,
      soldAt: this.paymentForm?.get("soldAt")?.value
    }
  }

  private checkIfCreditAllowed(): boolean {
    return (this.selectedCustomer != null && this.selectedCustomer.id != null) || (this.isNewCustomer && this.manureSaleForm?.get("customer.telephoneNumber")?.value != '');
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

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseManureSaleSaveDto();
    this.populateManureSaleSaveDtoWithFormValues();
    this.manureSaleSaveFrontDto.paymentSaveDtos?.forEach(payment => {
      payment.paymentDeadline = moment(payment.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
    })
    this.manureSaleApiService.save(this.manureSaleSaveFrontDto).subscribe({
      next: (data: string) => {
        this.salesInvoiceCategory = SalesInvoiceCategory.IN_STORE;
        this.selectedDriver = null;
        this.comment = null;
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Manure sold successfully');
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
    this.manureSaleForm.reset();
    this.quantity = 0;
    this.price = 0;
    this.totalPrice = 0;
    this.initialiseFormBuilder();
    this.setCustomerNewValue(this.isNewCustomer);
    if (this.searchCustomerCtrl) {
      this.searchCustomerCtrl.setValue(null);
    }
    this.getManureStock();
  }

  private initialisePaymentFormBuilder(): void {
    this.totalPrice = this.quantity * this.price;
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
