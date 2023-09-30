import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { FlockSaleApiService } from '../../../shared/apis/flock-sale.api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SurveyApiService } from '../../../shared/apis/survey.api.service';
import { CageCategory, CageDto, CustomerDto, SurveyDto } from 'generated-src/model';
import { HttpErrorResponse } from '@angular/common/http';
import { CageApiService } from '../../../shared/apis/cage.api.service';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { CustomerFrontDto, FlockSaleSaveFrontDto } from 'generated-src/model-front';

@Component({
  selector: 'app-flock-sale-details',
  templateUrl: './flock-sale-details.component.html',
  styleUrls: ['./flock-sale-details.component.scss'],
})
export class FlockSaleDetailsComponent implements OnInit {
  public language = "en";
  public flockSaleForm!: FormGroup;
  public quantitySoldForSterile: number = 0;
  public pricePerChickenForSterile: number = 0;
  public quantitySoldForGood: number = 0;
  public pricePerChickenForGood: number = 0;
  public totalPrice: number = 0;
  private flockSaleSaveFrontDto!: FlockSaleSaveFrontDto;
  public cages: CageDto[] = [];

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

  public errorMessages = {
    cage: [
      { type: 'required', message: 'Cage is required' },
    ],
    quantitySoldForSterile: [
      { type: 'required', message: 'Quantity for sterile is required' },
      { type: 'max', message: 'Quantity for sterile cannot exceed total number of sterile' }
    ],
    pricePerChickenForSterile: [
      { type: 'required', message: 'Price per chicken for sterile is required' },
    ],
    quantitySoldForGood: [
      { type: 'required', message: 'Quantity for good is required' },
      { type: 'max', message: 'Quantity for good cannot exceed total number of good' }
    ],
    pricePerChickenForGood: [
      { type: 'required', message: 'Price per chicken for good is required' },
    ],
    firstName: [{ type: "required", message: "First name is required" }],
    lastName: [{ type: "required", message: "Last name is required" }],
    telephoneNumber: [
      { type: "required", message: "Contact number is required" },
      { type: "pattern", message: "Invalid contact number" }
    ],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private cageApiService: CageApiService,
    private customerApiService: CustomerApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private flockSaleApiService: FlockSaleApiService,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.initialiseFormBuilder();
    this.getAllActiveCages();
    this.initialiseSelectedCustomer();
    this.searchCustomerAutoComplete();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public getAllActiveCages() {
    this.cageApiService.getAllActiveCages().subscribe(cages => {
      this.cages = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.NORM || cage.cageCategory === CageCategory.DARA);
    })
  }

  public newCustomerChange(event: any): void {
    this.isNewCustomer = event.detail.checked;
    this.setCustomerNewValue(this.isNewCustomer);
  }

  private setCustomerNewValue(isNewCustomer: boolean): void {
    isNewCustomer ? this.flockSaleForm?.get("customer.firstName")?.enable() : this.flockSaleForm?.get("customer.firstName")?.disable();
    isNewCustomer ? this.flockSaleForm?.get("customer.lastName")?.enable() : this.flockSaleForm?.get("customer.lastName")?.disable();
    isNewCustomer ? this.flockSaleForm?.get("customer.address")?.enable() : this.flockSaleForm?.get("customer.address")?.disable();
    isNewCustomer ? this.flockSaleForm?.get("customer.telephoneNumber")?.enable() : this.flockSaleForm?.get("customer.telephoneNumber")?.disable();
    if (this.isNewCustomer) {
      this.flockSaleForm?.get("customer.firstName")?.setValue("");
      this.flockSaleForm?.get("customer.lastName")?.setValue("");
      this.flockSaleForm?.get("customer.address")?.setValue("");
      this.flockSaleForm?.get("customer.telephoneNumber")?.setValue("");
    }
  }

  private initialiseFormBuilder(): void {
    this.flockSaleForm = this.formBuilder.group({
      newCustomer: new FormControl(this.isNewCustomer, Validators.compose([Validators.required])),
      customer: this.formBuilder.group({
        id: this.selectedCustomer?.id,
        firstName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        lastName: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required])),
        address: new FormControl({ value: '', disabled: !this.isNewCustomer }),
        telephoneNumber: new FormControl({ value: '', disabled: !this.isNewCustomer }, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"),]))
      }),
      flockSaleDetails: this.formBuilder.array([
        this.addFlockSaleFormGroup()
      ])
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
    this.flockSaleForm?.get("customer.firstName")?.setValue("");
    this.flockSaleForm?.get("customer.lastName")?.setValue("");
    this.flockSaleForm?.get("customer.address")?.setValue("");
    this.flockSaleForm?.get("customer.telephoneNumber")?.setValue("");
    this.selectedCustomer.id = null;
  }

  public setSelectedCustomer(event: any): void {
    this.selectedCustomer = event.option.value;
    this.selectedCustomer.id = event.option.value.id;
    this.flockSaleForm?.get("customer.id")?.setValue(event.option.value.id);
    this.flockSaleForm?.get("customer.firstName")?.setValue(event.option.value.firstName);
    this.flockSaleForm?.get("customer.lastName")?.setValue(event.option.value.lastName);
    this.flockSaleForm?.get("customer.address")?.setValue(event.option.value.address);
    this.flockSaleForm?.get("customer.telephoneNumber")?.setValue(event.option.value.telephoneNumber);
  }

  public addFlockSaleFormGroup(): any {
    return this.formBuilder.group({
      cageId: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      flockId: new FormControl({ value: null, disabled: false }),
      good: new FormControl({ value: null, disabled: true }),
      totalSterile: new FormControl({ value: null, disabled: true }),
      quantitySoldForSterile: new FormControl({ value: this.quantitySoldForSterile, disabled: false }, Validators.compose([Validators.required])),
      pricePerChickenForSterile: new FormControl({ value: this.pricePerChickenForSterile, disabled: false }, Validators.compose([Validators.required])),
      totalPriceForSterile: new FormControl({ value: 0, disabled: false }),
      quantitySoldForGood: new FormControl({ value: this.quantitySoldForGood, disabled: false }, Validators.compose([Validators.required])),
      pricePerChickenForGood: new FormControl({ value: this.pricePerChickenForSterile, disabled: false }, Validators.compose([Validators.required])),
      totalPriceForGood: new FormControl({ value: 0, disabled: false }),
    });
  }

  addFlockSaleDetails(): void {
    (this.flockSaleForm.get('flockSaleDetails') as FormArray).push(this.addFlockSaleFormGroup());
  }

  removeFlockSaleDetails(flockSaleDetailsGroupIndex: number): void {
    (this.flockSaleForm.get('flockSaleDetails') as FormArray).removeAt(flockSaleDetailsGroupIndex);
  }

  get flockSaleDetailsFields() {
    for (let index = 0; index < (this.flockSaleForm.get('flockSaleDetails') as FormArray).controls.length; index++) {
      const element = (this.flockSaleForm.get('flockSaleDetails') as FormArray).controls[index];
      element.get('quantitySoldForSterile')?.valueChanges.subscribe(() => {
        this.calculateTotalPriceForSterile(index);
      });
      element.get('pricePerChickenForSterile')?.valueChanges.subscribe(() => {
        this.calculateTotalPriceForSterile(index);
      });
      element.get('quantitySoldForGood')?.valueChanges.subscribe(() => {
        this.calculateTotalPriceForGood(index);
      });
      element.get('pricePerChickenForGood')?.valueChanges.subscribe(() => {
        this.calculateTotalPriceForGood(index);
      });
    }
    return this.flockSaleForm ? this.flockSaleForm.get('flockSaleDetails') as FormArray : null;
  }

  private calculateTotalPriceForSterile(index: number): void {
    const quantitySoldForSterile = (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('quantitySoldForSterile')?.value;
    const pricePerChickenForSterile = (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('pricePerChickenForSterile')?.value;

    if (quantitySoldForSterile !== null && pricePerChickenForSterile !== null) {
      const totalPrice = quantitySoldForSterile * pricePerChickenForSterile;
      (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('totalPriceForSterile')?.setValue(totalPrice);
    } else {
      (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('totalPriceForSterile')?.setValue(null);
    }
  }

  private calculateTotalPriceForGood(index: number): void {
    const quantitySoldForGood = (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('quantitySoldForGood')?.value;
    const pricePerChickenForGood = (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('pricePerChickenForGood')?.value;

    if (quantitySoldForGood !== null && pricePerChickenForGood !== null) {
      const totalPrice = quantitySoldForGood * pricePerChickenForGood;
      (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('totalPriceForGood')?.setValue(totalPrice);
    } else {
      (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('totalPriceForGood')?.setValue(null);
    }
  }

  public ionSelectCage(event: any, index: number) {
    const cageId = event.detail.value;
    this.findMostRecentSurveyDtoForCage(cageId, index);
  }

  private findMostRecentSurveyDtoForCage(cageId: number, index: number): void {
    this.surveyApiService.findMostRecentSurveyDtoForCage(cageId).subscribe((surveyDetails: SurveyDto) => {
      (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index).setValue({
        cageId: surveyDetails.cageId,
        flockId: surveyDetails.flockId,
        good: surveyDetails.good,
        totalSterile: surveyDetails.totalSterile,
        quantitySoldForSterile: 0,
        pricePerChickenForSterile: 0,
        totalPriceForSterile: 0,
        quantitySoldForGood: 0,
        pricePerChickenForGood: 0,
        totalPriceForGood: 0
      });
      (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('quantitySoldForSterile')?.setValidators([Validators.required, Validators.max(surveyDetails.totalSterile)]);
      (this.flockSaleForm.get('flockSaleDetails') as FormArray).at(index)?.get('quantitySoldForGood')?.setValidators([Validators.required, Validators.max(surveyDetails.good)]);
    });
  }

  private initialiseFlockSaleSaveDto(): void {
    this.flockSaleSaveFrontDto = {
      customerDto: {
        id: null,
        firstName: null,
        lastName: null,
        address: null,
        telephoneNumber: null,
        totalAmountDue: null,
      },
      flockSaleDetailsDtoList: [],
      newCustomer: false
    }
  }

  private populateFlockSaleSaveDtoWithFormValues(): void {
    this.flockSaleSaveFrontDto = {
      customerDto: {
        id: this.flockSaleForm?.get("customer.id")?.value,
        firstName: this.flockSaleForm?.get("customer.firstName")?.value,
        lastName: this.flockSaleForm?.get("customer.lastName")?.value,
        address: this.flockSaleForm?.get("customer.address")?.value,
        telephoneNumber: this.flockSaleForm?.get("customer.telephoneNumber")?.value,
        totalAmountDue: null,
      },
      flockSaleDetailsDtoList: this.flockSaleForm.value.flockSaleDetails,
      newCustomer: this.isNewCustomer
    }
  }

  public cancel(): void {
    // this.findMostRecentSurveyDtoForCage();
  }

  test(): void {
    console.log(this.flockSaleForm.value.customer.firstName);
    this.initialiseFlockSaleSaveDto();
    this.populateFlockSaleSaveDtoWithFormValues();
    console.log(this.flockSaleSaveFrontDto);
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseFlockSaleSaveDto();
    this.populateFlockSaleSaveDtoWithFormValues();
    this.flockSaleApiService.save(this.flockSaleSaveFrontDto).subscribe({
      next: (data: string) => {
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock sold successfully');
        // this.router.navigate([`cage/cage-sale-list`])
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private reset(): void {
    this.flockSaleForm.reset();
    (this.flockSaleForm.get('flockSaleDetails') as FormArray).clear();
    this.addFlockSaleDetails();
    this.isNewCustomer = false;
    this.setCustomerNewValue(this.isNewCustomer);
    if (this.searchCustomerCtrl) {
      this.searchCustomerCtrl.setValue(null);
    }
  }
}
