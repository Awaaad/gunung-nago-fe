import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HealthType } from 'generated-src/model';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-health-details',
  templateUrl: './health-details.component.html',
  styleUrls: ['./health-details.component.scss'],
})
export class HealthDetailsComponent implements OnInit {
  public healthProductDetailsForm!: FormGroup;
  public initialQuantity: number = 0;
  public initialAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public healthProductId: number = 0;
  public today: Date = new Date();
  public language = "en";
  public healthTypes!: string[];
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    healthType: [
      { type: 'required', message: 'Health type is required' },
    ],
    unitsPerBox: [
      { type: 'required', message: 'Units per box is required' },
    ]
  };

  constructor(
    private healthProductApiService: HealthProductApiService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
    this.healthTypes = Object.keys(HealthType);
  }

  ngOnInit(): void {
    this.initialiseFormBuilder();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private initialiseFormBuilder(): void {
    this.healthProductDetailsForm = this.formBuilder.group({
      healthProductDetails: this.formBuilder.array([
        this.addHealthProductDetailsFormGroup()
      ])
    });
  }

  public addHealthProductDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      active: new FormControl({ value: true, disabled: false }, Validators.compose([Validators.required])),
      description: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      healthType: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      unitsPerBox: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addHealthProductDetails(): void {
    (this.healthProductDetailsForm.get('healthProductDetails') as FormArray).push(this.addHealthProductDetailsFormGroup());
  }

  removeHealthProductDetails(healthProductDetailsGroupIndex: number): void {
    (this.healthProductDetailsForm.get('healthProductDetails') as FormArray).removeAt(healthProductDetailsGroupIndex);
  }

  get healthProductDetailsFields() {
    return this.healthProductDetailsForm ? this.healthProductDetailsForm.get('healthProductDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.healthProductApiService.save(this.healthProductDetailsForm.value.healthProductDetails).subscribe({
      next: (data: string) => {
        this.healthProductDetailsForm.reset();
        (this.healthProductDetailsForm.get('healthProductDetails') as FormArray).clear();
        this.addHealthProductDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Health product(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
