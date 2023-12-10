import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-manure-details',
  templateUrl: './manure-details.component.html',
  styleUrls: ['./manure-details.component.scss'],
})
export class ManureDetailsComponent implements OnInit {
  public manureDetailsForm!: FormGroup;
  public language = "en";
  public errorMessages = {
    weight: [
      { type: 'required', message: 'Weight is required' },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private manureStockApiService: ManureStockApiService,
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
    this.manureDetailsForm = this.formBuilder.group({
      manureDetails: this.formBuilder.array([
        this.addManureDetailsFormGroup()
      ])
    });
  }

  public addManureDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      weight: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addManureDetails(): void {
    (this.manureDetailsForm.get('manureDetails') as FormArray).push(this.addManureDetailsFormGroup());
  }

  removeManureDetails(manureDetailsGroupIndex: number): void {
    (this.manureDetailsForm.get('manureDetails') as FormArray).removeAt(manureDetailsGroupIndex);
  }

  get manureDetailsFields() {
    return this.manureDetailsForm ? this.manureDetailsForm.get('manureDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.manureStockApiService.save(this.manureDetailsForm.value.manureDetails).subscribe({
      next: (data: string) => {
        this.manureDetailsForm.reset();
        (this.manureDetailsForm.get('manureDetails') as FormArray).clear();
        this.addManureDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Manure(s) successfully updated');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
