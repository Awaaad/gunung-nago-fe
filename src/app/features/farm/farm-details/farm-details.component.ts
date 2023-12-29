import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FarmApiService } from 'src/app/shared/apis/farm.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.scss'],
})
export class FarmDetailsComponent implements OnInit {
  public farmDetailsForm!: FormGroup;
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    address: [
      { type: 'required', message: 'Address is required' },
    ],
    telephoneNumber: [
      { type: 'email', message: 'Telephone number is invalid' },
    ]
  };

  constructor(
    private farmApiService: FarmApiService,
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
    this.farmDetailsForm = this.formBuilder.group({
      farmDetails: this.formBuilder.array([
        this.addFarmDetailsFormGroup()
      ])
    });
  }

  public addFarmDetailsFormGroup(): any {
    return this.formBuilder.group({
      name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      telephoneNumber: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addFarmDetails(): void {
    (this.farmDetailsForm.get('farmDetails') as FormArray).push(this.addFarmDetailsFormGroup());
  }

  removeFarmDetails(farmDetailsGroupIndex: number): void {
    (this.farmDetailsForm.get('farmDetails') as FormArray).removeAt(farmDetailsGroupIndex);
  }

  get farmDetailsFields() {
    return this.farmDetailsForm ? this.farmDetailsForm.get('farmDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.farmApiService.save(this.farmDetailsForm.value.farmDetails).subscribe({
      next: (data: string) => {
        this.farmDetailsForm.reset();
        (this.farmDetailsForm.get('farmDetails') as FormArray).clear();
        this.addFarmDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Farm(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.farmDetailsForm.reset();
          (this.farmDetailsForm.get('farmDetails') as FormArray).clear();
          this.addFarmDetails();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg('Farm(s) successfully saved');
        } else {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      }
    });
  }
}
