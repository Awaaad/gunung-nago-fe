import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EggType } from 'generated-src/model';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-egg-category-details',
  templateUrl: './egg-category-details.component.html',
  styleUrls: ['./egg-category-details.component.scss'],
})
export class EggCategoryDetailsComponent implements OnInit {
  public eggCategoryDetailsForm!: FormGroup;
  public eggTypes!: string[];
  public language = "en";

  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    type: [
      { type: 'required', message: 'Type is required' },
    ]
  };

  constructor(
    private eggCategoryApiService: EggCategoryApiService,
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
    this.eggCategoryDetailsForm = this.formBuilder.group({
      eggCategoryDetails: this.formBuilder.array([
        this.addEggCategoryDetailsFormGroup()
      ])
    });
  }

  public addEggCategoryDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      eggType: new FormControl({ value: EggType.GOOD, disabled: false }, Validators.compose([Validators.required]))
    });
  }

  addEggCategoryDetails(): void {
    (this.eggCategoryDetailsForm.get('eggCategoryDetails') as FormArray).push(this.addEggCategoryDetailsFormGroup());
  }

  removeEggCategoryDetails(eggCategoryDetailsGroupIndex: number): void {
    (this.eggCategoryDetailsForm.get('eggCategoryDetails') as FormArray).removeAt(eggCategoryDetailsGroupIndex);
  }

  get eggCategoryDetailsFields() {
    return this.eggCategoryDetailsForm ? this.eggCategoryDetailsForm.get('eggCategoryDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.eggCategoryApiService.save(this.eggCategoryDetailsForm.value.eggCategoryDetails).subscribe({
      next: (data: string) => {
        this.eggCategoryDetailsForm.reset();
        (this.eggCategoryDetailsForm.get('eggCategoryDetails') as FormArray).clear();
        this.addEggCategoryDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Egg categories successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
