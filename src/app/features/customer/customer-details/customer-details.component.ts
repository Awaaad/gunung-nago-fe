import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CageCategory } from 'generated-src/model';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  public customerDetailsForm!: FormGroup;
  public initialQuantity: number = 0;
  public initialAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public customerId: number = 0;
  public today: Date = new Date();
  public language = "en";
  public errorMessages = {
    firstName: [
      { type: 'required', message: 'First Name is required' },
    ],
    lastName: [
      { type: 'required', message: 'Last Name is required' },
    ],
    telephoneNumber: [
      { type: 'required', message: 'Telephone Number is required' },
    ],
  };

  constructor(
    private customerApiService: CustomerApiService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.initialiseFormBuilder();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  private initialiseFormBuilder(): void {
    this.customerDetailsForm = this.formBuilder.group({
      customerDetails: this.formBuilder.array([
        this.addCustomerDetailsFormGroup()
      ])
    });
  }

  public addCustomerDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      firstName: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      lastName: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: null, disabled: false }),
      telephoneNumber: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      telephoneNumberTwo: new FormControl({ value: null, disabled: false }),
      telephoneNumberThree: new FormControl({ value: null, disabled: false }),
      totalAmountDue: null
    });
  }

  addCustomerDetails(): void {
    (this.customerDetailsForm.get('customerDetails') as FormArray).push(this.addCustomerDetailsFormGroup());
  }

  removeCustomerDetails(customerDetailsGroupIndex: number): void {
    (this.customerDetailsForm.get('customerDetails') as FormArray).removeAt(customerDetailsGroupIndex);
  }

  get customerDetailsFields() {
    return this.customerDetailsForm ? this.customerDetailsForm.get('customerDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.customerApiService.save(this.customerDetailsForm.value.customerDetails).subscribe({
      next: (data: string) => {
        this.customerDetailsForm.reset();
        (this.customerDetailsForm.get('customerDetails') as FormArray).clear();
        this.addCustomerDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Customers(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
