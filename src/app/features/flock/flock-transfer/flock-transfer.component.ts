import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { CageCategory, CageDto, FlockCageTransferDto, FlockCategory, FlockDto } from 'generated-src/model';
import { FlockToCage, DropCage, FlockFrontDto } from 'generated-src/model-front';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
@Component({
  selector: 'app-flock-transfer',
  templateUrl: './flock-transfer.component.html',
  styleUrls: ['./flock-transfer.component.scss'],
})
export class FlockTransferComponent {
  public language = "en";
  public flocks: FlockFrontDto[] = [];
  public flockToCageList: FlockToCage[] = [];
  public dropCages: DropCage[] = [];
  public flockCageTransferDtoList: FlockCageTransferDto[] = [];

  // cage form
  public cageDetailsForm!: FormGroup;
  public cageCategories!: string[];

  // flock form
  public flockDetailsForm!: FormGroup;
  public initialQuantity: number = 0;
  public actualGood: number = 0;
  public actualSterile: number = 0;
  public initialAge: number = 0;
  public actualAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public cageId: number = 0;

  public today: Date = new Date();
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    cageCategory: [
      { type: 'required', message: 'Category is required' },
    ],
    initialQuantity: [
      { type: 'required', message: 'Initial quantity is required' },
    ],
    actualGood: [
      { type: 'required', message: 'Actual good quantity is required' },
    ],
    actualSterile: [
      { type: 'required', message: 'Actual sterile quantity is required' },
    ],
    initialAge: [
      { type: 'required', message: 'Initial age is required' },
    ],
    actualAge: [
      { type: 'required', message: 'Actual age is required' },
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
    private translateService: TranslateService,
    private flockApiService: FlockApiService,
    private cageApiService: CageApiService,
    private utilsService: UtilsService
  ) {
    this.cageCategories = Object.keys(CageCategory);
    this.initialiseCageFormBuilder();
    this.initialiseFlockFormBuilder();
  }

  ionViewWillEnter() {
    this.initialiseCageFormBuilder();
    this.getAllActiveFlocksWithoutCage();
    this.getAllFreeCages();
    this.dropCages = [{
      flockToCage: []
    }]
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getAllFreeCages(): void {
    this.cageApiService.getAllInactiveCages().subscribe(cages => {
      cages.forEach(cage => {
        const flockToCage: FlockToCage[] = [{
          cageId: cage.id,
          flockId: null,
          cageName: cage.name,
          name: '',
          cageCategory: cage.cageCategory,
          quantity: null
        }]
        this.dropCages[0].flockToCage.push(flockToCage);
      })
    })
  }

  private getAllActiveFlocksWithoutCage(): void {
    this.flockApiService.findAllActiveFlocksWithoutCage().subscribe(flocks => {
      this.flocks = flocks;
    })
  }

  public drop(event: CdkDragDrop<any[]>): void {
    if (event.container.data.length > 1) {
      return;
    } else {
      transferArrayItem(
        this.flocks,
        event.container.data,
        this.flocks.findIndex(flock => flock.id === (event.item.data as unknown as FlockFrontDto).id),
        0,
      );
    }
    if (event.container.data[0].actualFlockCategory != event.container.data[1].cageCategory as FlockCategory) {
      this.flocks.push(event.container.data[0]);
      event.container.data.splice(0, 1);
    }
  }

  public remove(flock: any): void {
    this.flocks.push(flock[0]);
    flock.splice(0, 1);
  }

  public cancelTransfer(): void {
    this.flockCageTransferDtoList = [];
    this.getAllActiveFlocksWithoutCage();
    this.getAllFreeCages();
    this.dropCages = [{
      flockToCage: []
    }]
  }

  public saveTransfer(): void {
    this.mapFlockToCageDto();
    this.utilsService.presentLoading();
    this.flockApiService.transferFlockToCage(this.flockCageTransferDtoList).subscribe({
      next: (data: string) => {
        this.cancelTransfer();
        this.cageDetailsForm.reset();
        (this.cageDetailsForm.get('cageDetails') as FormArray).clear();
        this.addCageDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock(s) transferred to cage(s) successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public mapFlockToCageDto(): void {
    this.flockCageTransferDtoList = [];
    this.dropCages.map(dropCage => dropCage.flockToCage)[0].forEach((flockCage: any) => {
      if (flockCage.length > 1) {
        const flockCageTransferDto: FlockCageTransferDto = {
          flockId: flockCage[0].id,
          cageId: flockCage[1].cageId,
          quantity: 0
        }
        this.flockCageTransferDtoList.push(flockCageTransferDto);
      }
    });
  }

  // Cage
  private initialiseCageFormBuilder(): void {
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
      active: false,
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

  public saveCage(): void {
    this.utilsService.presentLoading();
    this.cageApiService.save(this.cageDetailsForm.value.cageDetails).subscribe({
      next: (data: string) => {
        this.cancelTransfer();
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

  // Flock
  private initialiseFlockFormBuilder(): void {
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
      initialQuantity: new FormControl({ value: this.initialQuantity, disabled: false }, Validators.compose([Validators.required])),
      actualGood: new FormControl({ value: this.actualGood, disabled: false }, Validators.compose([Validators.required])),
      actualSterile: new FormControl({ value: this.actualSterile, disabled: false }, Validators.compose([Validators.required])),
      initialAge: new FormControl({ value: this.initialAge, disabled: false }, Validators.compose([Validators.required])),
      actualAge: new FormControl({ value: this.actualAge, disabled: false }, Validators.compose([Validators.required])),
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

  public saveFlock(): void {
    this.utilsService.presentLoading();
    this.flockDetailsForm.value.flockDetails.forEach((flockDetail: any) => {
      flockDetail.aquisitionDate = moment(flockDetail.aquisitionDate).startOf('day').format(moment.HTML5_FMT.DATE);
    });
    this.flockApiService.save(this.flockDetailsForm.value.flockDetails).subscribe({
      next: (data: string) => {
        this.cancelTransfer();
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

}
