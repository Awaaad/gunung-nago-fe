import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/shared/util/utils.service';
import { FlockSaleApiService } from '../../../shared/api/flock-sale.api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SurveyApiService } from '../../../shared/api/survey.api.service';
import { AquisitionType, CageCategory, CageDto, SurveyDto } from 'generated-src/model';
import { FlockSaleSaveFrontDto } from 'generated-src/model-front';
import { HttpErrorResponse } from '@angular/common/http';
import { CageApiService } from '../../../shared/api/cage.api.service';

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
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private cageApiService: CageApiService,
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
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public getAllActiveCages() {
    this.cageApiService.getAllActiveCages().subscribe(cages => {
      this.cages = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.NORM || cage.cageCategory === CageCategory.DARA);
    })
  }

  private initialiseFormBuilder(): void {
    this.flockSaleForm = this.formBuilder.group({
      flockSaleDetails: this.formBuilder.array([
        this.addFlockSaleFormGroup()
      ])
    });
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
      cageId: null,
      flockId: null,
      flockStockId: null,
      quantitySoldForSterile: null,
      pricePerChickenForSterile: null,
      quantitySoldForGood: null,
      pricePerChickenForGood: null
    }
  }

  private populateFlockSaleSaveDtoWithFormValues(): void {
    this.flockSaleSaveFrontDto = {
      cageId: this.flockSaleForm.value.cageId,
      flockId: this.flockSaleForm.value.flockId,
      flockStockId: this.flockSaleForm.value.flockStockId,
      quantitySoldForSterile: this.flockSaleForm.value.quantitySold,
      pricePerChickenForSterile: this.flockSaleForm.value.pricePerChicken,
      quantitySoldForGood: this.flockSaleForm.value.quantitySold,
      pricePerChickenForGood: this.flockSaleForm.value.pricePerChicken
    }
  }

  public cancel(): void {
    // this.findMostRecentSurveyDtoForCage();
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseFlockSaleSaveDto();
    this.populateFlockSaleSaveDtoWithFormValues();
    this.flockSaleApiService.save(this.flockSaleForm.value.flockSaleDetails).subscribe({
      next: (data: string) => {
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
}
