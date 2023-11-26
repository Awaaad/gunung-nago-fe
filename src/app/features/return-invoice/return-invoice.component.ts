import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountDto, PaymentModeDto, SaleDetailsDto, SalesInvoiceDto } from 'generated-src/model';
import { SaleSaveFrontDto, SalesInvoiceDetailsForReturnFrontDto, SaleDetailsForReturnFrontDto, SalesInvoiceDetailsFrontDto, SalesInvoiceDetailsFrontForReturnDto, ReturnInvoiceFrontDto } from 'generated-src/model-front';
import * as moment from 'moment';
import { ReturnApiService } from 'src/app/shared/apis/return.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { environment } from 'src/environments/environment';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';


@Component({
  selector: 'app-return-invoice',
  templateUrl: './return-invoice.component.html',
  styleUrls: ['./return-invoice.component.scss'],
})
export class ReturnInvoiceComponent  implements OnInit {
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
  public quantityAllowed: boolean = false;
  public salesInvoiceDetailsFrontDtoForSalesInvoice!: SalesInvoiceDetailsFrontDto | null | undefined;
  public salesInvoiceDetailsForReturnDto!: SalesInvoiceDetailsForReturnFrontDto  | null | undefined;
  public returnInvoiceDetails: ReturnInvoiceFrontDto[] = [] ;
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
  public totalPriceReturn:number = 0;
  public totalPriceForReturnSummary: number = 0;
  public showReturnInvoices:boolean = false;
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
  public salesDetailsCopy: SaleDetailsDto | null | undefined ;
  public displayedColumnsReturn: string[] = ['no.', 'product', 'quantity returned', 'quantity to return', 'original price', 'discount', 'unit sold at', 'new price', 'amount', 'actions'];
  public language = "en";
  public salesInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('id');

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
    private paymentModeApiService: PaymentModeApiService,
    private bankAccountApiService: BankAccountApiService,) { }

  async ngOnInit() {
    this.returnFormGroup = this.formBuilder.group({
      customerFirstName: new FormControl(''),
      customerLastName: new FormControl(''),
      customerAddress: new FormControl(''),
      customerTelephoneNumber: new FormControl(''),
      formDetail: this.formBuilder.array([])
    })
    if (this.salesInvoiceId != null){
      this.findSalesInvoiceDetailsById();
      this.findSalesInvoiceDetailsForReturnById();
      this.findReturnInvoiceDetailsForReturnById();
    }
    this.initialiseSalesInvoices();
    this.getAllPaymentModes();
    this.getAllBankAccounts();
  }

  private checkIfCreditAllowed(): boolean {
    return false;
  }

  public getAllPaymentModes() {
    this.paymentModeApiService.findAll().subscribe(paymentModes => {
      
      paymentModes.forEach(paymentMode =>{
        if(paymentMode.name !== "CREDIT"){
          this.paymentModes.push(paymentMode)
        }
      })
    })
  }

  public getAllBankAccounts() {
    this.bankAccountApiService.findAll().subscribe(bankAccounts => {
      this.bankAccounts = bankAccounts;
    })
  }

  initialiseQuantityForReturn(){
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

  addPayment(): void {
    console.log(this.paymentForm.get('payments'));
    if ((this.paymentForm.get('payments') as FormArray).length < 2) {
      (this.paymentForm.get('payments') as FormArray).push(this.addPaymentFormGroup());
    }
  }

  public findSalesInvoiceDetailsById(): void {
    this.salesInvoiceApiService.findSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(salesInvoiceDetailsFrontDto => {
      console.log(salesInvoiceDetailsFrontDto);
      this.salesInvoiceDetailsFrontDtoForSalesInvoice = salesInvoiceDetailsFrontDto;
      //this.totalPrice = this.salesInvoiceDetailsFrontDtoForSalesInvoice.totalPrice;
    })
  }

  public findSalesInvoiceDetailsForReturnById() {
    this.salesInvoiceApiService.findSalesInvoiceDetailsForReturnById(this.salesInvoiceId).subscribe(res=>{
    this.salesInvoiceDetailsForReturnDto = res;
    console.log(res);
    let invoiceId = null;
    let totalQuantityReturned = 0;
    this.returnFormGroup.get('customerFirstName')?.setValue(res.customerFirstName);
    this.returnFormGroup.get('customerLastName')?.setValue(res.customerLastName);
    this.returnFormGroup.get('customerTelephoneNumber')?.setValue(res.customerTelephoneNumber);
    this.returnFormGroup.get('customerAddress')?.setValue(res.customerAddress);

    res.salesInvoiceLineForReturnDtos?.forEach(x => {
      const obj = this.salesInStock.find(o => o.id === x.id);
      if (obj) {
        obj.quantityReturned = obj.quantityReturned + x.quantityReturned;
      } else {
        this.salesInStock.push(x);
      }
    });
    console.log(this.salesInStock)

    // res.salesInvoiceLineForReturnDtos?.forEach(saleDetail => {
    //   invoiceId = saleDetail.id;
      
    //   if (saleDetail.id === invoiceId){
    //     totalQuantityReturned = totalQuantityReturned + saleDetail.quantityReturned;
    //     // let saleDetailsForReturnObject :SaleDetailsForReturnFrontDto = {
    //     //   id: saleDetail.id,
    //     //   salesInvoiceType: saleDetail.salesInvoiceType,
    //     //   quantity: saleDetail.quantity,
    //     //   price: saleDetail.price,
    //     //   eggType: saleDetail.eggType,
    //     //   eggQuantityType: saleDetail.eggQuantityType,
    //     //   cageId: saleDetail.cageId,
    //     //   flockId: saleDetail.flockId,
    //     //   quantityReturned: saleDetail.quantityReturned + totalQuantityReturned,
    //     //   eggCategoryId: saleDetail.eggCategoryId,
    //     //   transferToBad: saleDetail.transferToBad,
    //     //   flockType: saleDetail.flockType
    //     // }
    //     saleDetail.quantityReturned = totalQuantityReturned;
        
    //     console.log("detas ", saleDetail);
    //   }
    //   this.salesInStock.push(saleDetail);
    //   // this.salesInStock.push(saleDetail);
      
    // })
    this.initialiseReturnFormBuilder();
  })
}

public findReturnInvoiceDetailsForReturnById() {
  this.returnApiService.getReturnDetailsBySalesInvoiceId(this.salesInvoiceId).subscribe(res=>{
  
  res.forEach((element: ReturnInvoiceFrontDto) => {
    this.returnInvoiceDetails.push(element);
    console.log("kjkl ", res);
  });
  })
}

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
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

  private initialiseReturnFormBuilder(): void {    
    const formDetail = this.returnFormGroup.get('formDetail') as FormArray;
      this.salesInStock.forEach(sale =>{
        const maxQuantity = sale.quantity;
        let isQuantityAllowed = true;
        if ((sale.quantity + sale.quantityReturned)> maxQuantity ){
          isQuantityAllowed = false;
        }
        const returnFormGroup = this.formBuilder.group({
          id: sale.id,
          maxQuantity : sale.quantity,
          quantityReturned: sale.quantityReturned !== null ? sale.quantityReturned : 0,
          quantityAllowedForReturn: isQuantityAllowed,
          cageId :sale.cageId,
          eggQuantityType: sale.eggQuantityType,
          eggType: sale.eggType,
          eggCategoryId: sale.eggCategoryId,
          flockId: sale.flockId,
          flockType: sale.flockType,
          price: sale.price,
          discount: this.salesInvoiceDetailsForReturnDto?.discount,
          unitSoldAt: this.salesInvoiceDetailsForReturnDto?.discount !== 0 ? (this.salesInvoiceDetailsForReturnDto?.discount * sale.price) : (sale.price),
          newPrice: new FormControl({ value: sale.price, disabled: false }),
          quantity: new FormControl({ value: sale.quantity, disabled: false }, Validators.compose([Validators.max(maxQuantity), Validators.min(1)])),
          totalPricePerItem: sale.quantity,
          salesInvoiceType: sale.salesInvoiceType,
          transferToBad: new FormControl({ value: false, disabled: false }),
        })
        formDetail.push(returnFormGroup);
      })
    
    this.salesDetailsTable = new MatTableDataSource<SaleDetailsForReturnFrontDto>(this.returnFormGroupDetail.value);
    console.log(this.salesDetailsTable);
  }

  public openModal(): void {
    this.calculateTotalPrice();
    // if (!this.checkIfCreditAllowed()) {
    //   this.paymentTypes = this.paymentTypes.filter(payment => payment != PaymentType.CREDIT);
    // } else {
    //   this.paymentTypes = Object.keys(PaymentType);
    // }
    this.initialisePaymentFormBuilder();
    this.isModalOpen = true;
  }

  public cancel(): void {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
    this.totalPrice = 0;
  }

  public confirm(): void {
    console.log("pay",this.paymentForm)
    this.modal.dismiss(null, 'confirm');
  }

  public onWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isModalOpen = false;
      console.log(this.paymentForm.value.payments);
      this.save();
    }
  }

  public save(): void {
    console.log(this.paymentForm.value.payments);
    const customerDto = {
      id: "",
      firstName:  this.salesInvoiceDetailsForReturnDto?.customerFirstName,
      lastName: this.salesInvoiceDetailsForReturnDto?.customerLastName,
      address: this.salesInvoiceDetailsForReturnDto?.customerAddress,
      telephoneNumber: this.salesInvoiceDetailsForReturnDto?.customerTelephoneNumber,
      totalAmountDue: null
    }
    const saleDetailsDtoList : SaleDetailsForReturnFrontDto[] = [];
    this.returnFormGroupDetail.value.forEach((sale: any) =>{
      const saleDetailsDto : SaleDetailsForReturnFrontDto ={
        salesInvoiceType: sale.salesInvoiceType,
        quantity: sale.quantity,
        price: sale.newPrice,
        eggType: sale.eggType,
        eggQuantityType: sale.eggQuantityType,
        cageId: sale.cageId,
        flockId: sale.flockId,
        flockType: sale.flockType,
        eggCategoryId: sale.eggCategoryId,
        id: sale.id,
        quantityReturned: sale.quantityReturned,
        transferToBad: sale.transferToBad
      }
      saleDetailsDtoList.push(saleDetailsDto);
    })
    
    this.paymentForm.value.payments?.forEach((payment: { paymentDeadline: moment.MomentInput; paymentModeId: { id: any; }; }) => {
      payment.paymentDeadline = moment(payment.paymentDeadline).startOf('day').format(moment.HTML5_FMT.DATE)
      payment.paymentModeId = payment.paymentModeId.id
    })

    const saleSaveForm : any = {
      customerDto: customerDto,
      paymentSaveDtos: this.paymentForm.value.payments,
      salesInvoiceCategory: this.salesInvoiceDetailsForReturnDto?.salesInvoiceCategory,
      driverId: null,
      comment: this.salesInvoiceDetailsForReturnDto?.comment,
      saleDetailsDtos: saleDetailsDtoList,
      newCustomer: false,
      soldAt: this.paymentForm?.get("soldAt")?.value,
      salesInvoiceId: this.salesInvoiceDetailsForReturnDto?.id
    }
    
    console.log(saleSaveForm);
    this.utilsService.presentLoading();
    this.returnApiService.save(saleSaveForm).subscribe({
      next: (data: string) => {
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Product(s) stock updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public calculateTotalPrice(): void {
    this.returnFormGroupDetail.value.forEach((sale: any) =>{
      this.totalPrice = this.totalPrice + (sale.quantity * sale.newPrice);
    })
  }

  public calculateTotalPriceForReturnSummary(): void {
    this.totalPriceForReturnSummary = 0;
    this.returnFormGroupDetail.value.forEach((sale: any) =>{
      this.totalPriceForReturnSummary =  this.totalPriceForReturnSummary + (sale.quantity * sale.newPrice);
    })
    this.quantityAllowed = this.returnFormGroupDetail.value.every((element: any) => element.quantityAllowedForReturn === true);
  }

  get returnFormGroupDetail(){
    return this.returnFormGroup.get('formDetail') as  FormArray;
  }

  onQuantityChange(event: any, element:any, index:number): void{
    const formGroupDetail = this.returnFormGroupDetail;
    formGroupDetail.at(index).get('totalPricePerItem')?.setValue(formGroupDetail.at(index).get('quantity')?.value * formGroupDetail.at(index).get('price')?.value);
    this.totalPriceReturn = formGroupDetail.at(index).get('price')?.value * formGroupDetail.at(index).get('quantity')?.value;
    
    if (formGroupDetail.at(index).get('quantity')?.value > formGroupDetail.at(index).get('maxQuantity')?.value || (+formGroupDetail.at(index).get('quantityReturned')?.value + +formGroupDetail.at(index).get('quantity')?.value) > formGroupDetail.at(index).get('maxQuantity')?.value)  {
      formGroupDetail.at(index).get('quantityAllowedForReturn')?.setValue(false);
    }
    else{
      formGroupDetail.at(index).get('quantityAllowedForReturn')?.setValue(true);
    }
    this.calculateTotalPriceForReturnSummary();
    this.quantityAllowed = formGroupDetail.value.every((element: any) => element.quantityAllowedForReturn === true);
  }

  public transferToBad(event : any, index:number) : void{
    this.returnFormGroupDetail.at(index).get('transferToBad')?.setValue(event.detail.checked);
  }

  public viewReturnInvoices():void{
    if(this.showReturnInvoices){
      this.showReturnInvoices = false;
    }else{
      this.showReturnInvoices = true;
    }
    
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
}
