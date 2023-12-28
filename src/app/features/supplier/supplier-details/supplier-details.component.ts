import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss'],
})
export class SupplierDetailsComponent implements OnInit {
  public supplierDetailsForm!: FormGroup;
  public initialQuantity: number = 0;
  public initialAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public supplierId: number = 0;
  public today: Date = new Date();
  public language = "en";
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
  };

  constructor(
    private formBuilder: FormBuilder,
    private supplierApiService: SupplierApiService,
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
    this.supplierDetailsForm = this.formBuilder.group({
      supplierDetails: this.formBuilder.array([
        this.addSupplierDetailsFormGroup()
      ])
    });
  }

  public addSupplierDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      email: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: null, disabled: false }),
      telephoneNumber: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      telephoneNumberTwo: new FormControl({ value: null, disabled: false }),
      telephoneNumberThree: new FormControl({ value: null, disabled: false }),
      internal: new FormControl({ value: false, disabled: false }),
    });
  }

  addSupplierDetails(): void {
    (this.supplierDetailsForm.get('supplierDetails') as FormArray).push(this.addSupplierDetailsFormGroup());
  }

  removeSupplierDetails(supplierDetailsGroupIndex: number): void {
    (this.supplierDetailsForm.get('supplierDetails') as FormArray).removeAt(supplierDetailsGroupIndex);
  }

  get supplierDetailsFields() {
    return this.supplierDetailsForm ? this.supplierDetailsForm.get('supplierDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.supplierApiService.save(this.supplierDetailsForm.value.supplierDetails).subscribe({
      next: (data: string) => {
        this.supplierDetailsForm.reset();
        (this.supplierDetailsForm.get('supplierDetails') as FormArray).clear();
        this.addSupplierDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Suppliers(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
