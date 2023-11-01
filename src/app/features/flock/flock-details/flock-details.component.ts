import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CageDto } from 'generated-src/model';
import * as moment from 'moment';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-flock-details',
  templateUrl: './flock-details.component.html',
  styleUrls: ['./flock-details.component.scss'],
})
export class FlockDetailsComponent {
  public initialQuantity: number = 0;
  public initialAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public cageId: number = 0;
  public today: Date = new Date();
  public language = "en";

  public flockDetailsForm!: FormGroup;
  public cages: CageDto[] = [];
  public errorMessages = {
    initialQuantity: [
      { type: 'required', message: 'Quantity is required' },
    ],
    initialAge: [
      { type: 'required', message: 'Age is required' },
    ],
    aquisitionDate: [
      { type: 'required', message: 'Aquisition date is required' },
    ],
    aquisitionType: [
      { type: 'required', message: 'Aquisition type is required' },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private cageApiService: CageApiService,
    private flockApiService: FlockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  ngOnInit(): void {
    this.getAllFreeCages();
    this.initialiseFormBuilder();
  }

  private initialiseFormBuilder(): void {
    this.flockDetailsForm = this.formBuilder.group({
      flockDetails: this.formBuilder.array([
        this.addFlockDetailsFormGroup()
      ])
    });
  }

  public addFlockDetailsFormGroup(): any {
    return this.formBuilder.group({
      cageId: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      name: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      initialQuantity: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      initialAge: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      aquisitionDate: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      aquisitionType: new FormControl({ value: 'PURCHASE', disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addFlockDetails(): void {
    (this.flockDetailsForm.get('flockDetails') as FormArray).push(this.addFlockDetailsFormGroup());
  }

  removeFlockDetails(flockDetailsGroupIndex: number): void {
    (this.flockDetailsForm.get('flockDetails') as FormArray).removeAt(flockDetailsGroupIndex);
  }

  get flockDetailsFields() {
    return this.flockDetailsForm ? this.flockDetailsForm.get('flockDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.flockDetailsForm.value.flockDetails.forEach((flockDetail: any) => {
      flockDetail.aquisitionDate = moment(flockDetail.aquisitionDate).startOf('day').format(moment.HTML5_FMT.DATE);
    });
    this.flockApiService.save(this.flockDetailsForm.value.flockDetails).subscribe({
      next: (data: string) => {
        this.flockDetailsForm.reset();
        (this.flockDetailsForm.get('flockDetails') as FormArray).clear();
        this.addFlockDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private getAllFreeCages(): void {
    this.cageApiService.getAllInactiveCages().subscribe(cages => {
      this.cages = cages;
    })
  }
}
