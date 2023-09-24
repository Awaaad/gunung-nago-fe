import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CageCategory } from 'generated-src/model';
import { CageApiService } from '../../../shared/apis/cage.api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-cage-details',
  templateUrl: './cage-details.component.html',
  styleUrls: ['./cage-details.component.scss'],
})
export class CageDetailsComponent implements OnInit {
  public cageDetailsForm!: FormGroup;
  public initialQuantity: number = 0;
  public initialAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public cageId: number = 0;
  public today: Date = new Date();
  public language = "en";
  public cageCategories!: string[];
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    cageCategory: [
      { type: 'required', message: 'Category is required' },
    ]
  };

  constructor(
    private cageApiService: CageApiService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
    this.cageCategories = Object.keys(CageCategory);
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
    this.cageDetailsForm = this.formBuilder.group({
      cageDetails: this.formBuilder.array([
        this.addCageDetailsFormGroup()
      ])
    });
  }

  public addCageDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      active: new FormControl({ value: true, disabled: false }, Validators.compose([Validators.required])),
      cageCategory: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required]))
    });
  }

  addCageDetails(): void {
    (this.cageDetailsForm.get('cageDetails') as FormArray).push(this.addCageDetailsFormGroup());
  }

  removeCageDetails(cageDetailsGroupIndex: number): void {
    (this.cageDetailsForm.get('cageDetails') as FormArray).removeAt(cageDetailsGroupIndex);
  }

  get cageDetailsFields() {
    return this.cageDetailsForm ? this.cageDetailsForm.get('cageDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.cageApiService.save(this.cageDetailsForm.value.cageDetails).subscribe({
      next: (data: string) => {
        this.cageDetailsForm.reset();
        (this.cageDetailsForm.get('cageDetails') as FormArray).clear();
        this.addCageDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Cage(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
