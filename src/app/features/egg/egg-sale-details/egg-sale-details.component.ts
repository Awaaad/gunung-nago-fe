import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CustomerDto, SalesInvoiceCategory, UserDto, EggCategoryStockDto, EggType, BankAccountDto, PaymentModeDto } from 'generated-src/model';
import { CustomerFrontDto, EggCategorySaleFrontDto, EggSaleSaveFrontDto, EggSaleToJakartaFrontDto, EggStockFrontDto } from 'generated-src/model-front';
import * as moment from 'moment';
import { Subscription, filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { EggSaleApiService } from 'src/app/shared/apis/egg-sale.api.service';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { environment } from 'src/environments/environment';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { Router } from '@angular/router';
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

  public totalRemainingEggs: number = 0;
  public totalRemainingGoodEggs: number = 0;
  public totalRemainingBadEggs: number = 0;

  public showFormArray: boolean = false;
  public disableSave: boolean = false;

  public isNewCustomer: boolean = false;
  public isToJakarta: boolean = false;
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

  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];
  public completePaymentModes: PaymentModeDto[] = [];

  public eggCategoryStockBtn: EggCategoryStockDto[] = [];
  public eggSaleToJakartaFrontDto: EggSaleToJakartaFrontDto[] = [];

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
    private utilsService: UtilsService,
    private bankAccountApiService: BankAccountApiService,
    private paymentModeApiService: PaymentModeApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getEggStock();
    this.initialiseFormBuilder();
    this.initialiseSelectedCustomer();
    this.searchCustomerAutoComplete();
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
  }

  ionViewWillEnter(): void {
    this.getEggStock();
    this.getAllPaymentModes();
    this.getAllBankAccounts();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
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
      this.totalRemainingEggs = this.eggStock.totalEggs;
      this.totalRemainingGoodEggs = this.eggStock.goodEggs;
      this.totalRemainingBadEggs = this.eggStock.badEggs;
    })
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

  public changeIsToJakarta(event: any): void {
    this.isToJakarta = event.detail.checked;
    this.reset();
  }

  private setCustomerNewValue(isNewCustomer: boolean): void {
    isNewCustomer ? this.eggSaleForm?.get("customer.firstName")?.enable() : this.eggSaleForm?.get("customer.firstName")?.disable();
    isNewCustomer ? this.eggSaleForm?.get("customer.lastName")?.enable() : this.eggSaleForm?.get("customer.lastName")?.disable();
    isNewCustomer ? this.eggSaleForm?.get("customer.address")?.enable() : this.eggSaleForm?.get("customer.address")?.disable();
    isNewCustomer ? this.eggSaleForm?.get("customer.telephoneNumber")?.enable() : this.eggSaleForm?.get("customer.telephoneNumber")?.disable();
    isNewCustomer ? this.eggSaleForm?.get("customer.internal")?.enable() : this.eggSaleForm?.get("customer.internal")?.disable();
    if (this.isNewCustomer) {
      this.eggSaleForm?.get("customer.firstName")?.setValue("");
      this.eggSaleForm?.get("customer.lastName")?.setValue("");
      this.eggSaleForm?.get("customer.address")?.setValue("");
      this.eggSaleForm?.get("customer.telephoneNumber")?.setValue("");
      this.eggSaleForm?.get("customer.internal")?.setValue(false);
    }
  }

  private initialiseFormBuilder(): void {
    this.eggSaleForm = this.formBuilder.group({
      newCustomer: new FormControl(this.isNewCustomer, Validators.compose([Validators.required])),
      isToJakarta: new FormControl(this.isToJakarta, Validators.compose([Validators.required])),
      pricePerKg: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      customer: this.formBuilder.group({
        id: this.selectedCustomer?.id,
        firstName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        lastName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        address: new FormControl({ value: '', disabled: !this.isNewCustomer }),
        telephoneNumber: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])),
        internal: new FormControl({ value: false, disabled: !this.isNewCustomer }, Validators.compose([Validators.required]))
      }),
      eggCategorySaleDtos: this.formBuilder.array([
      ])
    });
  }

  getWeightControlsTie(index: number) {
    return (this.eggCategoriesFields?.at(index).get('weightsForTie') as FormArray);
  }
  getWeightControlsTray(index: number) {
    return (this.eggCategoriesFields?.at(index).get('weightsForTray') as FormArray);
  }
  getWeightControlsPiece(index: number) {
    return (this.eggCategoriesFields?.at(index).get('weightsForPiece') as FormArray);
  }

  addEggCategoryFormGroup(eggCategory: EggCategoryStockDto, tie: boolean, tray: boolean, piece: boolean) {
    if (this.isToJakarta) {
      const jakartaForm = this.formBuilder.group({
        eggCategoryId: new FormControl(eggCategory.eggCategoryId, Validators.compose([Validators.required])),
        name: new FormControl(eggCategory.name, Validators.compose([])),
        eggType: new FormControl(eggCategory.eggType, Validators.compose([])),
        quantity: new FormControl(eggCategory.quantity, Validators.compose([])),
        tie: new FormControl(tie, Validators.compose([])),
        tray: new FormControl(tray, Validators.compose([])),
        piece: new FormControl(piece, Validators.compose([])),
        weightsForTie: this.formBuilder.array([]),
        weightsForTray: this.formBuilder.array([]),
        weightsForPiece: this.formBuilder.array([]),
      })
      return jakartaForm;
    } else {
      return this.formBuilder.group({
        eggCategoryId: new FormControl(eggCategory.eggCategoryId, Validators.compose([Validators.required])),
        name: new FormControl(eggCategory.name, Validators.compose([])),
        eggType: new FormControl(eggCategory.eggType, Validators.compose([])),
        quantity: new FormControl(eggCategory.quantity, Validators.compose([])),
        piece: new FormControl({ value: this.eggSaleForm.get('isToJakarta')?.value ? 1 : null, disabled: this.eggSaleForm.get('isToJakarta')?.value }, Validators.compose([Validators.min(0)])),
        pricePerPiece: new FormControl(null, Validators.compose([, Validators.min(0)])),
        tie: new FormControl({ value: this.eggSaleForm.get('isToJakarta')?.value ? 1 : null, disabled: this.eggSaleForm.get('isToJakarta')?.value }, Validators.compose([Validators.min(0)])),
        pricePerTie: new FormControl(null, Validators.compose([Validators.min(0)])),
        tray: new FormControl({ value: this.eggSaleForm.get('isToJakarta')?.value ? 1 : null, disabled: this.eggSaleForm.get('isToJakarta')?.value }, Validators.compose([Validators.min(0)])),
        pricePerTray: new FormControl(null, Validators.compose([Validators.min(0)])),
        weightPerTie: new FormControl(null, Validators.compose([Validators.min(0)])),
        weightPerTray: new FormControl(null, Validators.compose([Validators.min(0)])),
        weightPerPiece: new FormControl(null, Validators.compose([Validators.min(0)]))
      })
    }
  }

  private findIndexes(array: any[], targetValue: number): number[] {
    return array.map((element: any, index: any) => element.eggCategoryId === targetValue ? index : undefined)
      .filter((index: undefined) => index !== undefined)
      .sort((a, b) => b - a);
  }

  addEggCategory(eggCategory: EggCategoryStockDto): void {
    if (!((this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).value.find((form: any) => form.eggCategoryId == eggCategory.eggCategoryId))) {
      (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).push(this.addEggCategoryFormGroup(eggCategory, false, false, false));
      if (this.isToJakarta) {
        this.eggCategoryStockBtn.push(eggCategory);
      }
    } else {
      this.findIndexes((this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).value, eggCategory.eggCategoryId).forEach(index => {
        this.removeEggCategory(index);
        if (this.isToJakarta) {
          for (let i = 0; i < this.eggCategoryStockBtn.length; i++) {
            if (this.eggCategoryStockBtn[i].eggCategoryId === eggCategory.eggCategoryId) {
              this.eggCategoryStockBtn.splice(i, 1);
            }
          }
        }
      })
    }
    this.showFormArray = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).length > 0;
  }

  addEggCategoryForJakarta(eggCategory: any, tie: boolean, tray: boolean, piece: boolean): void {
    (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).push(this.addEggCategoryFormGroup(eggCategory, tie, tray, piece));
  }

  addWeightForTie(index: number, event: any) {
    (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("tie")?.setValue(event.detail.checked);

    if (!event.detail.checked) {
      const weightsArray = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("weightsForTie") as FormArray;
      weightsArray.clear();
    } else {
      const weightsArray = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("weightsForTie") as FormArray;
      for (let i = 0; i < 10; i++) {
        weightsArray.push(this.formBuilder.control(null));
      }
    }
  }
  addSingleAdditionalWeightForTie(index: number) {
    const weightsArray = this.getWeightControlsTie(index);
    weightsArray.push(this.formBuilder.control(null));
  }
  addWeightForTray(index: number, event: any) {
    (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("tray")?.setValue(event.detail.checked);

    if (!event.detail.checked) {
      const weightsArray = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("weightsForTray") as FormArray;
      weightsArray.clear();
    } else {
      const weightsArray = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("weightsForTray") as FormArray;
      for (let i = 0; i < 10; i++) {
        weightsArray.push(this.formBuilder.control(null));
      }
    }
  }
  addSingleAdditionalWeightForTray(index: number) {
    const weightsArray = this.getWeightControlsTray(index);
    weightsArray.push(this.formBuilder.control(null));
  }
  addWeightForPiece(index: number, event: any) {
    (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("piece")?.setValue(event.detail.checked);

    if (!event.detail.checked) {
      const weightsArray = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("weightsForPiece") as FormArray;
      weightsArray.clear();
    } else {
      const weightsArray = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index].get("weightsForPiece") as FormArray;
      for (let i = 0; i < 10; i++) {
        weightsArray.push(this.formBuilder.control(null));
      }
    }
  }
  addSingleAdditionalWeightForPiece(index: number) {
    const weightsArray = this.getWeightControlsPiece(index);
    weightsArray.push(this.formBuilder.control(null));
  }

  removeEggCategory(eggCategoryGroupIndex: number): void {
    (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).removeAt(eggCategoryGroupIndex);
    if (this.isToJakarta) {
      this.calculateTotalPriceForJakarta();
    } else {
      this.calculateTotalPrice();
    }
  }

  get eggCategoriesFields() {
    return this.eggSaleForm ? this.eggSaleForm.get('eggCategorySaleDtos') as FormArray : null;
  }

  public calculateRemainingEggs(): void {
    this.disableSave = false;

    for (let index = 0; index < (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls.length; index++) {
      let form = (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).controls[index];
      if (form.get('quantity')?.value < ((form.get('tie')?.value * 300) + (form.get('tray')?.value * 30) + (form.get('piece')?.value))) {
        this.disableSave = true;
        return;
      }
    }

    this.totalRemainingEggs = this.eggStock.totalEggs - (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).value.map((form: any) => {
      (form.tie * 300) + (form.tray * 30) + (form.piece)
    }).reduce((acc: any, value: any) => acc + value, 0);

    this.totalRemainingGoodEggs = this.eggStock.goodEggs -
      (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).value.filter((form: any) => form.eggType === EggType.GOOD).map((form: any) => {
        if (form.eggType === EggType.GOOD) {
          return (form.tie * 300) + (form.tray * 30) + (form.piece);
        }
      }).reduce((acc: any, value: any) => acc + value, 0);

    this.totalRemainingBadEggs = this.eggStock.badEggs -
      (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).value.filter((form: any) => form.eggType === EggType.BAD).map((form: any) => {
        return (form.tie * 300) + (form.tray * 30) + (form.piece);
      }).reduce((acc: any, value: any) => acc + value, 0);
  }

  public calculateTotalPrice(): void {
    this.totalPrice = 0;
    (this.eggSaleForm.get('eggCategorySaleDtos') as FormArray).value.forEach((form: any) => {
      this.totalPrice = this.totalPrice + ((form.tie * form.pricePerTie) + (form.tray * form.pricePerTray) + (form.piece * form.pricePerPiece));
    })
  }

  public calculateTotalPriceForJakarta(): void {
    const eggCategorySaleDtoList: EggCategorySaleFrontDto[] = [];
    this.eggSaleForm?.get("eggCategorySaleDtos")?.value.forEach((eggCategory: any) => {
      if (eggCategory.weightsForTie) {
        eggCategory.weightsForTie.filter((weight: any) => weight).forEach((weight: number) => {
          const eggCategorySaleDto = {
            eggCategoryId: eggCategory.eggCategoryId,
            piece: null,
            pricePerPiece: null,
            weightPerPiece: null,
            tie: 1,
            pricePerTie: null,
            weightPerTie: weight,
            tray: null,
            pricePerTray: null,
            weightPerTray: null
          }

          eggCategorySaleDtoList.push(eggCategorySaleDto);
        })
      }
      if (eggCategory.weightsForTray) {
        eggCategory.weightsForTray.filter((weight: any) => weight).forEach((weight: number) => {
          const eggCategorySaleDto = {
            eggCategoryId: eggCategory.eggCategoryId,
            piece: null,
            pricePerPiece: null,
            weightPerPiece: null,
            tie: null,
            pricePerTie: null,
            weightPerTie: null,
            tray: 1,
            pricePerTray: null,
            weightPerTray: weight
          }

          eggCategorySaleDtoList.push(eggCategorySaleDto);
        })
      }
      if (eggCategory.weightsForPiece) {
        eggCategory.weightsForPiece.filter((weight: any) => weight).forEach((weight: number) => {
          const eggCategorySaleDto = {
            eggCategoryId: eggCategory.eggCategoryId,
            piece: 1,
            pricePerPiece: null,
            weightPerPiece: weight,
            tie: null,
            pricePerTie: null,
            weightPerTie: null,
            tray: null,
            pricePerTray: null,
            weightPerTray: null
          }

          eggCategorySaleDtoList.push(eggCategorySaleDto);
        })
      }
    })

    let totalWeight = 0;
    eggCategorySaleDtoList.forEach((eggCategorySaleDto: EggCategorySaleFrontDto) => {
      totalWeight = totalWeight + (eggCategorySaleDto.weightPerTie ? eggCategorySaleDto.weightPerTie : 0) + (eggCategorySaleDto.weightPerTray ? eggCategorySaleDto.weightPerTray : 0) + (eggCategorySaleDto.weightPerPiece ? eggCategorySaleDto.weightPerPiece : 0)
    })

    this.totalPrice = totalWeight * this.eggSaleForm.get('pricePerKg')?.value;
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
            nameTel: value
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
      totalAmountDue: null,
      internal: null,
    };
  }

  public clearCustomer(ctrl: FormControl): void {
    ctrl.setValue(null);
    this.eggSaleForm?.get("customer.firstName")?.setValue("");
    this.eggSaleForm?.get("customer.lastName")?.setValue("");
    this.eggSaleForm?.get("customer.address")?.setValue("");
    this.eggSaleForm?.get("customer.telephoneNumber")?.setValue("");
    this.eggSaleForm?.get("customer.internal")?.setValue(false);
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
    this.eggSaleForm?.get("customer.internal")?.setValue(event.option.value.internal);
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
        internal: null,
      },
      internal: null,
      soldAt: null,
      pricePerKg: null,
      driverId: null,
      salesInvoiceCategory: null,
      comment: null,
      paymentSaveDtos: [],
      newCustomer: false,
      isToJakarta: false,
      eggCategorySaleDtos: []
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
        internal: this.eggSaleForm?.get("customer.internal")?.value,
      },
      driverId: this.selectedDriver ? this.selectedDriver.id : null,
      salesInvoiceCategory: this.salesInvoiceCategory,
      comment: this.comment,
      soldAt: this.paymentForm?.get("soldAt")?.value,
      internal: this.paymentForm?.get("internal")?.value,
      pricePerKg: this.eggSaleForm?.get("pricePerKg")?.value,
      paymentSaveDtos: !this.paymentForm?.get("internal")?.value ? this.paymentForm.value.payments : [],
      newCustomer: this.isNewCustomer,
      isToJakarta: this.eggSaleForm?.get("isToJakarta")?.value,
      eggCategorySaleDtos: this.eggSaleForm?.get("isToJakarta")?.value ? this.populateJakartaEggCategories() : this.eggSaleForm?.get("eggCategorySaleDtos")?.value
    }
  }

  private checkIfCreditAllowed(): boolean {
    return (this.selectedCustomer != null && this.selectedCustomer.id != null) || (this.isNewCustomer && this.eggSaleForm?.get("customer.telephoneNumber")?.value != '');
  }

  public checkIfInternal(): boolean {
    return (this.selectedCustomer != null && this.selectedCustomer.id != null && this.selectedCustomer.internal) || (this.isNewCustomer && this.eggSaleForm?.get("customer.telephoneNumber")?.value != '' && this.eggSaleForm?.get("customer.internal")?.value);
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

  public populateJakartaEggCategories(): EggCategorySaleFrontDto[] {
    const eggCategorySaleDtoList: EggCategorySaleFrontDto[] = [];
    this.eggSaleForm?.get("eggCategorySaleDtos")?.value.forEach((eggCategory: any) => {
      if (eggCategory.weightsForTie) {
        eggCategory.weightsForTie.filter((weight: any) => weight).forEach((weight: number) => {
          const eggCategorySaleDto = {
            eggCategoryId: eggCategory.eggCategoryId,
            piece: null,
            pricePerPiece: null,
            weightPerPiece: null,
            tie: 1,
            pricePerTie: null,
            weightPerTie: weight,
            tray: null,
            pricePerTray: null,
            weightPerTray: null
          }

          eggCategorySaleDtoList.push(eggCategorySaleDto);
        })
      }
      if (eggCategory.weightsForTray) {
        eggCategory.weightsForTray.filter((weight: any) => weight).forEach((weight: number) => {
          const eggCategorySaleDto = {
            eggCategoryId: eggCategory.eggCategoryId,
            piece: null,
            pricePerPiece: null,
            weightPerPiece: null,
            tie: null,
            pricePerTie: null,
            weightPerTie: null,
            tray: 1,
            pricePerTray: null,
            weightPerTray: weight
          }

          eggCategorySaleDtoList.push(eggCategorySaleDto);
        })
      }
      if (eggCategory.weightsForPiece) {
        eggCategory.weightsForPiece.filter((weight: any) => weight).forEach((weight: number) => {
          const eggCategorySaleDto = {
            eggCategoryId: eggCategory.eggCategoryId,
            piece: 1,
            pricePerPiece: null,
            weightPerPiece: weight,
            tie: null,
            pricePerTie: null,
            weightPerTie: null,
            tray: null,
            pricePerTray: null,
            weightPerTray: null
          }

          eggCategorySaleDtoList.push(eggCategorySaleDto);
        })
      }
    })
    return eggCategorySaleDtoList;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseEggSaleSaveDto();
    this.populateFlockSaleSaveDtoWithFormValues();
    this.eggSaleSaveDto.paymentSaveDtos?.forEach(payment => {
      payment.paymentDeadline = moment(payment.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
      payment.paymentModeId = payment.paymentModeId.id
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
    this.eggCategoryStockBtn = [];
    this.initialiseSelectedCustomer();
    this.totalPrice = 0;
    this.totalRemainingEggs = 0;
    this.totalRemainingGoodEggs = 0;
    this.totalRemainingBadEggs = 0;
    this.isNewCustomer = false;
    this.showFormArray = false;
    this.setCustomerNewValue(false);
    this.eggSaleForm.reset();
    this.initialiseEggSaleSaveDto();
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
  }

  private initialisePaymentFormBuilder(): void {
    this.paymentForm = this.formBuilder.group({
      totalPrice: new FormControl({ value: this.totalPrice, disabled: true }, Validators.compose([Validators.required])),
      soldAt: new FormControl({ value: this.totalPrice, disabled: false }, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(this.totalPrice),
      ])),
      internal: new FormControl({ value: this.checkIfInternal(), disabled: false }, Validators.compose([Validators.required])),
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
