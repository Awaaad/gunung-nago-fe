import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CageDto, ManureDto } from 'generated-src/model';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-manure-stock',
  templateUrl: './manure-stock.component.html',
  styleUrls: ['./manure-stock.component.scss'],
})
export class ManureStockComponent implements OnInit {
  public manureStockUpdateForm!: FormGroup;
  public language = "en";
  public manures: ManureDto[] = [];
  public cages: CageDto[] = [];

  public errorMessages = {
    weight: [
      { type: 'required', message: 'Weight is required' },
    ],
    bags: [
      { type: 'required', message: 'Bags collected is required' },
    ],
    cage: [
      { type: 'required', message: 'Cage is required' },
    ]
  };

  constructor(
    private cageApiService: CageApiService,
    private formBuilder: FormBuilder,
    private manureStockApiService: ManureStockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.initialiseFormBuilder();
    this.getAllActiveCages();
    this.getManures();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  public getAllActiveCages() {
    this.cages = [];
    this.cageApiService.getAllActiveCages().subscribe(cages => {
      this.cages = cages;
    })
  }

  public getManures() {
    this.manures = [];
    this.manureStockApiService.findManures().subscribe(manures => {
      console.log(manures);
      this.manures = manures;
    })
  }

  private initialiseFormBuilder(): void {
    this.manureStockUpdateForm = this.formBuilder.group({
      manureDetails: this.formBuilder.array([
        this.addManureStockUpdateFormGroup()
      ])
    });
  }

  public addManureStockUpdateFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      manureId: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      bags: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      cageId: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addManureDetails(): void {
    (this.manureStockUpdateForm.get('manureDetails') as FormArray).push(this.addManureStockUpdateFormGroup());
  }

  removeManureDetails(manureDetailsGroupIndex: number): void {
    (this.manureStockUpdateForm.get('manureDetails') as FormArray).removeAt(manureDetailsGroupIndex);
  }

  get manureDetailsFields() {
    return this.manureStockUpdateForm ? this.manureStockUpdateForm.get('manureDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.manureStockApiService.saveManureStockTrace(this.manureStockUpdateForm.value.manureDetails).subscribe({
      next: (data: string) => {
        this.manureStockUpdateForm.reset();
        (this.manureStockUpdateForm.get('manureDetails') as FormArray).clear();
        this.addManureDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Manure stock successfully updated');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
