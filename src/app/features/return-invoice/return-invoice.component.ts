import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountDto, EggQuantityType, PaymentModeDto, SaleDetailsDto, SalesInvoiceType } from 'generated-src/model';
import { SalesInvoiceDetailsForReturnFrontDto, SaleDetailsForReturnFrontDto, SalesInvoiceDetailsFrontDto, ReturnInvoiceFrontDto, SaleDetailsFrontDto } from 'generated-src/model-front';
import * as moment from 'moment';
import { ReturnApiService } from 'src/app/shared/apis/return.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { environment } from 'src/environments/environment';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { PaymentApiService } from 'src/app/shared/apis/payment.api.service';


@Component({
  selector: 'app-return-invoice',
  templateUrl: './return-invoice.component.html',
  styleUrls: ['./return-invoice.component.scss'],
})
export class ReturnInvoiceComponent implements OnInit {
  public salesDetailsTable = new MatTableDataSource<SaleDetailsForReturnFrontDto>();
  public salesInStock: SaleDetailsForReturnFrontDto[] = [];
  public paymentForm!: FormGroup;
  public returnForm!: FormGroup;
  public returnFormGroup!: FormGroup;
  public paymentTypes: string[] = [];
  public totalPrice: number = 0;
  public isModalOpen: boolean = false;
  @ViewChild(IonModal) modal!: IonModal;
  public today: Date = new Date();
  public quantityAllowed: boolean = true;
  public salesInvoiceDetailsFrontDtoForSalesInvoice!: SalesInvoiceDetailsFrontDto | null | undefined;
  public salesInvoiceDetailsForReturnDto!: SalesInvoiceDetailsForReturnFrontDto | null | undefined;
  public returnInvoiceDetails: ReturnInvoiceFrontDto[] = [];
  public totalPiece: number = 0;
  public totalTray: number = 0;
  public totalTie: number = 0;
  public totalEggs: number = 0
  public totalPricePiece: number = 0;
  public totalPriceTray: number = 0;
  public totalPriceTie: number = 0;
  public totalQuantityForGoodChicken: number = 0;
  public totalQuantityForSterileChicken: number = 0;
  public totalPriceForGoodChicken: number = 0;
  public totalPriceForSterileChicken: number = 0;
  public totalQuantityManure: number = 0;
  public totalPriceManure: number = 0;
  public totalPriceReturn: number = 0;
  public totalPriceForReturnSummary: number = 0;
  public showReturnInvoices: boolean = false;
  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];
  public completePaymentModes: PaymentModeDto[] = [];
  public comment!: string | null;
  public company = environment.company;
  public address = environment.address;
  public phone = environment.phone;
  public email = environment.email;
  public regNo = environment.regNo;
  public yoe = environment.yoe;

  public salesDetails: SaleDetailsDto[] | null | undefined = [];
  public salesDetailsCopy: SaleDetailsDto | null | undefined;
  public displayedColumnsReturn: string[] = ['no.', 'product', 'quantity type', 'quantity returned', 'quantity to return', 'original price', 'discount', 'unit sold at', 'new price', 'amount', 'actions'];
  public language = "en";
  public salesInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('id');

  public amountDue: number = 0;
  public customerId!: number;
  public customerFirstName!: string;
  public customerLastName!: string;

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
    paymentModeId: [
      { type: 'required', message: 'Payment mode is required' },
    ],
    minValue: [
      { type: 'min', message: 'Value cannot be less than 0' }
    ],
    maxValue: [
      { type: 'max', message: 'Value cannot be greater than quantity in stock' }
    ],
    maxQuantity: [
      { type: 'max', message: 'Quantity entered is not allowed for this return' }
    ],
    bankAccountId: [
      { type: 'required', message: 'Bank account is required' },
    ]
  };

  constructor(private formBuilder: FormBuilder,
    private salesInvoiceApiService: SalesInvoiceApiService,
    private readonly activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private returnApiService: ReturnApiService,
    private paymentApiService: PaymentApiService,
    private paymentModeApiService: PaymentModeApiService,
    private bankAccountApiService: BankAccountApiService,
    private router: Router) { }

  async ngOnInit() {
    this.returnFormGroup = this.formBuilder.group({
      customerFirstName: new FormControl(''),
      customerLastName: new FormControl(''),
      customerAddress: new FormControl(''),
      customerTelephoneNumber: new FormControl(''),
      formDetail: this.formBuilder.array([])
    })
    if (this.salesInvoiceId != null) {
      this.findSalesInvoiceDetailsById();
      this.findSalesInvoiceDetailsForReturnById();
      this.findReturnInvoiceDetailsForReturnById();
    }
    this.initialiseSalesInvoices();
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

  initialiseQuantityForReturn() {
    return this.formBuilder.group({
      quantity: new FormControl(0, Validators.compose([
        Validators.required,
        Validators.min(0)
      ]))
    })
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
    if (totalAmountPaid <= JSON.parse(this.paymentForm.get('totalPrice')?.value)) {
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
    if (totalAmountPaid === JSON.parse(this.paymentForm.get('totalPrice')?.value)) {
      return true;
    } else {
      return false;
    }
  }

  public checkCreditCompleted(): boolean {
    let totalAmountDue = 0;
    this.paymentForm.get('payments')?.value.forEach((payment: any) => {
      if (payment.paymentMode && payment.paymentModeId.id == 1) {
        totalAmountDue += payment.amountPaid;
      } else {
        totalAmountDue += 0;
      }
    });
    if (totalAmountDue > this.amountDue) {
      return true;
    } else {
      return false;
    }
  }

  addPayment(): void {
    if ((this.paymentForm.get('payments') as FormArray).length < 2) {
      (this.paymentForm.get('payments') as FormArray).push(this.addPaymentFormGroup());
    }
  }

  public findSalesInvoiceDetailsById(): void {
    this.salesInvoiceApiService.findSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(salesInvoiceDetailsFrontDto => {
      this.salesInvoiceDetailsFrontDtoForSalesInvoice = salesInvoiceDetailsFrontDto;
    })
  }

  public findSalesInvoiceDetailsForReturnById() {
    this.salesInvoiceApiService.findSalesInvoiceDetailsForReturnById(this.salesInvoiceId).subscribe(returnInvoices => {
      this.salesInvoiceDetailsForReturnDto = returnInvoices;
      this.customerId = returnInvoices.customerId;
      this.customerFirstName = returnInvoices.customerFirstName;
      this.customerLastName = returnInvoices.customerLastName;
      this.paymentApiService.findTotalAmountDueByCustomerId(this.salesInvoiceDetailsForReturnDto.customerId).subscribe((amountDue: number) => {
        this.amountDue = amountDue;
      })
      this.returnFormGroup.get('customerFirstName')?.setValue(returnInvoices.customerFirstName);
      this.returnFormGroup.get('customerLastName')?.setValue(returnInvoices.customerLastName);
      this.returnFormGroup.get('customerTelephoneNumber')?.setValue(returnInvoices.customerTelephoneNumber);
      this.returnFormGroup.get('customerAddress')?.setValue(returnInvoices.customerAddress);

      returnInvoices.salesInvoiceLineForReturnDtos?.forEach(returnInvoice => {
        const matchingReturnInvoice = this.salesInStock.find(invoice => invoice.id === returnInvoice.id);
        if (matchingReturnInvoice) {
          matchingReturnInvoice.quantityReturned = matchingReturnInvoice.quantityReturned + returnInvoice.quantityReturned;
        } else {
          this.salesInStock.push(returnInvoice);
        }
      });
      this.initialiseReturnFormBuilder();
    })
  }

  public findReturnInvoiceDetailsForReturnById() {
    this.returnApiService.getReturnDetailsBySalesInvoiceId(this.salesInvoiceId).subscribe(returnInvoices => {
      returnInvoices.forEach((element: ReturnInvoiceFrontDto) => {
        this.returnInvoiceDetails.push(element);
      });
    })
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private initialisePaymentFormBuilder(): void {
    this.paymentForm = this.formBuilder.group({
      totalPrice: new FormControl({ value: this.totalPrice.toFixed(2), disabled: true }, Validators.compose([Validators.required])),
      payments: this.formBuilder.array([
        this.addPaymentFormGroup()
      ])
    });
  }

  private initialiseReturnFormBuilder(): void {
    const formDetail = this.returnFormGroup.get('formDetail') as FormArray;
    this.salesInStock.forEach(sale => {
      let salesQuantity = 0;
      let price = 0;
      let unitSoldAt = 0;
      if (sale.salesInvoiceType === SalesInvoiceType.EGG) {
        if (sale.salesEggQuantityType === EggQuantityType.TIE) {
          salesQuantity = sale.quantity * 300;
          unitSoldAt = this.salesInvoiceDetailsForReturnDto?.discount !== 0 ? (sale.price / 300) - ((((((this.salesInvoiceDetailsForReturnDto?.totalPrice - this.salesInvoiceDetailsForReturnDto?.soldAt) / this.salesInvoiceDetailsForReturnDto?.totalPrice)) * 100)) / 100 * (sale.price / 300)) : (sale.price / 300);
          price = (sale.price / 300);
        } else if (sale.salesEggQuantityType === EggQuantityType.TRAY) {
          salesQuantity = sale.quantity * 30
          unitSoldAt = this.salesInvoiceDetailsForReturnDto?.discount !== 0 ? (sale.price / 30) - ((((((this.salesInvoiceDetailsForReturnDto?.totalPrice - this.salesInvoiceDetailsForReturnDto?.soldAt) / this.salesInvoiceDetailsForReturnDto?.totalPrice)) * 100)) / 100 * (sale.price / 30)) : (sale.price / 30);
          price = (sale.price / 30);
        } else {
          salesQuantity = sale.quantity;
          unitSoldAt = this.salesInvoiceDetailsForReturnDto?.discount !== 0 ? (sale.price) - ((((((this.salesInvoiceDetailsForReturnDto?.totalPrice - this.salesInvoiceDetailsForReturnDto?.soldAt) / this.salesInvoiceDetailsForReturnDto?.totalPrice)) * 100)) / 100 * (sale.price)) : (sale.price);
          price = sale.price;
        }
      } else {
        salesQuantity = sale.quantity;
        unitSoldAt = this.salesInvoiceDetailsForReturnDto?.discount !== 0 ? (sale.price) - ((((((this.salesInvoiceDetailsForReturnDto?.totalPrice - this.salesInvoiceDetailsForReturnDto?.soldAt) / this.salesInvoiceDetailsForReturnDto?.totalPrice)) * 100)) / 100 * (sale.price)) : (sale.price);
        price = sale.price;
      }
      const maxQuantity = salesQuantity;
      let isQuantityAllowed = true;
      const returnFormGroup = this.formBuilder.group({
        id: sale.id,
        originalQuantity: sale.quantity,
        maxQuantity: salesQuantity,
        quantityReturned: sale.quantityReturned !== null ? sale.quantityReturned : 0,
        quantityAllowedForReturn: isQuantityAllowed,
        cageId: sale.cageId,
        eggCategoryName: sale.eggCategoryName,
        eggQuantityType: sale.salesEggQuantityType,
        eggType: sale.eggType,
        eggCategoryId: sale.eggCategoryId,
        flockId: sale.flockId,
        flockType: sale.flockType,
        price: price,
        discount: this.salesInvoiceDetailsForReturnDto?.discount,
        unitSoldAt: unitSoldAt,
        feedStockId: sale.feedStockId,
        feedName: sale.feedName,
        feedWeightPerBag: sale.feedWeightPerBag,
        manureStockId: sale.manureStockId,
        manureWeightPerBag: sale.manureWeightPerBag,
        newPrice: new FormControl({ value: unitSoldAt, disabled: false }),
        quantity: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.max(maxQuantity), Validators.min(0)])),
        salesInvoiceType: sale.salesInvoiceType,
        transferToBad: new FormControl({ value: false, disabled: false }),
      })
      formDetail.push(returnFormGroup);
    })
    this.calculateTotalPriceForReturnSummary();
    this.salesDetailsTable = new MatTableDataSource<SaleDetailsForReturnFrontDto>(this.returnFormGroupDetail.value);
  }

  public openModal(): void {
    if (this.customerId == 1) {
      this.paymentModes = this.completePaymentModes.filter(paymentMode => paymentMode.id != 1);
    } else {
      this.paymentModes = this.completePaymentModes;
    }
    this.calculateTotalPrice();
    this.initialisePaymentFormBuilder();
    this.isModalOpen = true;
  }

  public cancel(): void {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
    this.totalPrice = 0;
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

  public save(): void {
    const saleDetailsDtoList: SaleDetailsFrontDto[] = [];
    this.returnFormGroupDetail.value.forEach((sale: any) => {
      const saleDetailsDto: SaleDetailsFrontDto = {
        id: sale.id,
        salesInvoiceType: sale.salesInvoiceType,
        quantity: sale.quantity,
        price: sale.newPrice,
        eggType: sale.eggType,
        eggQuantityType: EggQuantityType.PIECE,
        cageId: sale.cageId,
        flockId: sale.flockId,
        flockType: sale.flockType,
        eggCategoryId: sale.eggCategoryId,
        amount: null,
        sterileChicken: null,
        goodChicken: null,
        eggInitialQuantity: null,
        feedStockId: sale.feedStockId,
        feedName: sale.feedName,
        feedWeightPerBag: sale.feedWeightPerBag,
        manureStockId: sale.manureStockId,
        manureWeightPerBag: sale.manureWeightPerBag,
        manureStocks: [],
        feedStocks: [],
        eggWeight: null,
        manureBags: null,
        feedBags: null,
        feedId: null,
        feeds: [],
      }
      saleDetailsDtoList.push(saleDetailsDto);
    })

    this.paymentForm.value.payments?.forEach((payment: { paymentDeadline: moment.MomentInput; paymentModeId: { id: any; }; }) => {
      payment.paymentDeadline = moment(payment.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
      payment.paymentModeId = payment.paymentModeId.id
    })

    const saleSaveForm: any = {
      customerDto: {
        id: this.customerId,
        firstName: null,
        lastName: null,
        address: null,
        telephoneNumber: null,
        totalAmountDue: null,
      },
      paymentSaveDtos: this.paymentForm.value.payments,
      salesInvoiceCategory: this.salesInvoiceDetailsForReturnDto?.salesInvoiceCategory,
      driverId: null,
      comment: this.salesInvoiceDetailsForReturnDto?.comment,
      saleDetailsDtos: saleDetailsDtoList,
      newCustomer: false,
      soldAt: this.paymentForm?.get("totalPrice")?.value,
      salesInvoiceId: this.salesInvoiceDetailsForReturnDto?.id
    }

    this.utilsService.presentLoading();
    this.returnApiService.save(saleSaveForm).subscribe({
      next: (data: string) => {
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Product(s) returned successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private reset(): void {
    this.salesDetailsTable = new MatTableDataSource<SaleDetailsForReturnFrontDto>();
    this.salesInStock = [];
    this.returnFormGroup = this.formBuilder.group({
      customerFirstName: new FormControl(''),
      customerLastName: new FormControl(''),
      customerAddress: new FormControl(''),
      customerTelephoneNumber: new FormControl(''),
      formDetail: this.formBuilder.array([])
    })
    if (this.salesInvoiceId != null) {
      this.findSalesInvoiceDetailsById();
      this.findSalesInvoiceDetailsForReturnById();
      this.findReturnInvoiceDetailsForReturnById();
    }
    this.initialiseSalesInvoices();
    this.getAllPaymentModes();
    this.getAllBankAccounts();
  }

  public calculateTotalPrice(): void {
    this.totalPrice = 0;
    this.returnFormGroupDetail.value.forEach((sale: any) => {
      this.totalPrice = this.totalPrice + (sale.quantity * sale.newPrice);
    })
  }

  public calculateTotalPriceForReturnSummary(): void {
    this.totalPriceForReturnSummary = 0;
    this.returnFormGroupDetail.value.forEach((sale: any) => {
      this.totalPriceForReturnSummary = this.totalPriceForReturnSummary + (sale.quantity * sale.newPrice);
    })
    this.quantityAllowed = this.returnFormGroupDetail.value.every((element: any) => element.quantityAllowedForReturn === true);
  }

  get returnFormGroupDetail() {
    return this.returnFormGroup.get('formDetail') as FormArray;
  }

  public onQuantityChange(event: any, element: any, index: number): void {
    const formGroupDetail = this.returnFormGroupDetail;
    formGroupDetail.at(index).get('totalPricePerItem')?.setValue(formGroupDetail.at(index).get('quantity')?.value * formGroupDetail.at(index).get('price')?.value);
    this.totalPriceReturn = formGroupDetail.at(index).get('price')?.value * formGroupDetail.at(index).get('quantity')?.value;

    if (formGroupDetail.at(index).get('quantity')?.value > formGroupDetail.at(index).get('maxQuantity')?.value || (formGroupDetail.at(index).get('quantityReturned')?.value + +formGroupDetail.at(index).get('quantity')?.value) > formGroupDetail.at(index).get('maxQuantity')?.value) {
      formGroupDetail.at(index).get('quantityAllowedForReturn')?.setValue(false);
    }
    else {
      formGroupDetail.at(index).get('quantityAllowedForReturn')?.setValue(true);
    }
    this.calculateTotalPriceForReturnSummary();
    this.quantityAllowed = formGroupDetail.value.every((element: any) => element.quantityAllowedForReturn === true);
  }

  public transferToBad(event: any, index: number): void {
    this.returnFormGroupDetail.at(index).get('transferToBad')?.setValue(event.detail.checked);
  }

  public initialiseSalesInvoices(): void {
    this.salesInvoiceDetailsForReturnDto = {
      id: null,
      receiptId: null,
      salesInvoiceType: null,
      totalPrice: null,
      soldAt: null,
      createdBy: null,
      createdDate: null,
      customerId: null,
      customerFirstName: null,
      customerLastName: null,
      customerAddress: null,
      customerTelephoneNumber: null,
      driverFirstName: null,
      driverLastName: null,
      salesPerson: null,
      salesInvoiceCategory: null,
      salesInvoiceStatus: null,
      discount: null,
      comment: null,
      salesInvoiceLineForReturnDtos: []
    }
  }

  public routeToSalesInvoiceCustomerCreditList(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`sales-invoice/sales-invoice-customer-credit-list/${this.customerId}`], { queryParams: { lastName: this.customerLastName, firstName: this.customerFirstName } })
    );

    window.open(url, '_blank');
  }
}
