import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { EggCategoryDto, FeedSurveyDto, HealthProductDto, HealthSurveyDto, HealthSurveyStockDto, ManureDto, ManureStockDto, SurveyEggCountDto } from 'generated-src/model';
import { FlockStockDetailsFrontDto, ManureStockFrontDto } from 'generated-src/model-front';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';
import { FlockStockApiService } from 'src/app/shared/apis/flock-stock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';

@Component({
  selector: 'app-flock-stock-edit-details',
  templateUrl: './flock-stock-edit-details.component.html',
  styleUrls: ['./flock-stock-edit-details.component.scss'],
})
export class FlockStockEditDetailsComponent implements OnInit {
  public flockStockId: any = this.activatedRoute.snapshot.paramMap.get('id');
  public name!: string;
  public surveyDate!: Date;
  public cageName!: string;
  public flockStockDetailsDto!: FlockStockDetailsFrontDto;
  public flockStockEditForm!: FormGroup;

  public eggReport = new MatTableDataSource<SurveyEggCountDto>;
  public displayedEggColumns: string[] = ['name', 'ikat', 'tray', 'piece', 'actions'];
  public feedReport = new MatTableDataSource<FeedSurveyDto>;
  public displayedFeedColumns: string[] = ['name', 'weight', 'bagsAllocated', 'bagsEaten', 'actions'];
  public healthReport = new MatTableDataSource<HealthSurveyStockDto>;
  public displayedHealthColumns: string[] = ['name', 'healthType', 'expiryDate', 'unitsTotal', 'unitsUsed', 'actions'];
  public manureReport = new MatTableDataSource<ManureStockDto>;
  public displayedManureColumns: string[] = ['weight', 'bags', 'actions'];

  public alive!: number;
  public death!: number;
  public sterile!: number;
  public good!: number;
  public actualGood!: number;

  // manure section 
  public addManureDetailsForm!: FormGroup;
  public manures: ManureDto[] = [];
  public manureStockDtos: ManureStockFrontDto[] = [];

  // egg section
  public addEggDetailsForm!: FormGroup;
  public surveyEggCountDtos: SurveyEggCountDto[] = [];

  // health section
  public healthProducts: HealthProductDto[] = [];
  public searchHealthProductCtrl = new FormControl();
  public filteredHealthProducts: any;
  public isLoading = false;
  public errorMsg!: string;
  public minLengthTerm = 1;
  public selectedHealthProduct: any = "";
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public selectedHealthProducts: HealthSurveyDto[] = [];
  private searchHealthProductSubscription!: Subscription;

  @ViewChild(IonModal) eggModal!: IonModal;
  public eggEditForm!: FormGroup;
  public isEggModalOpen: boolean = false;
  public eggCategories: EggCategoryDto[] = [];

  @ViewChild(IonModal) feedModal!: IonModal;
  public feedEditForm!: FormGroup;
  public isFeedModalOpen: boolean = false;

  @ViewChild(IonModal) healthModal!: IonModal;
  public healthEditForm!: FormGroup;
  public isHealthModalOpen: boolean = false;

  @ViewChild(IonModal) manureModal!: IonModal;
  public manureEditForm!: FormGroup;
  public isManureModalOpen: boolean = false;

  public errorMessages = {
    firstName: [
      { type: 'required', message: 'First Name is required' },
    ],
    lastName: [
      { type: 'required', message: 'Last Name is required' },
    ],
    telephoneNumber: [
      { type: 'required', message: 'Telephone Number is required' },
    ],
    tray: [
      { type: 'max', message: 'Tray cannot be more than 9' },
    ],
    item: [
      { type: 'max', message: 'Item cannot be more than 29' },
    ],
    eggCategory: [
      { type: 'required', message: 'Egg category is required' },
    ],
    bags: [
      { type: 'required', message: 'Bags collected is required' },
    ],
    bagsEaten: [
      { type: 'required', message: 'Bags eaten is required' },
      { type: 'max', message: 'Bags eaten cannot be more than bags allocated' },
    ],
    unitsUsed: [
      { type: 'required', message: 'Units used is required' },
      { type: 'max', message: 'Units used cannot be more than total units' }
    ],
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly flockStockApiService: FlockStockApiService,
    private formBuilder: FormBuilder,
    private readonly utilsService: UtilsService,
    private readonly eggCategoryApiService: EggCategoryApiService,
    private readonly healthProductApiService: HealthProductApiService,
    private manureStockApiService: ManureStockApiService,
  ) { }

  ngOnInit() {
    this.getRouteParams();
    this.getAllEggCategories();
    this.getFlockStockDetails(this.flockStockId);
    this.initialiseFlockStockDetailsDto();
    this.initialiseFlockStockEditForm(this.flockStockDetailsDto);
    this.getAllHealthProducts();
    this.initialiseAddEggFormBuilder();
    this.searchHealthProduct();
    this.getManures();
    this.initialiseAddManureFormBuilder();
  }

  private getRouteParams(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.name = params['name'];
        this.surveyDate = params['surveyDate'];
        this.cageName = params['cageName'];
      });
  }

  public getAllEggCategories() {
    this.eggCategoryApiService.findAll().subscribe(eggCategories => {
      this.eggCategories = eggCategories;
    })
  }

  private initialiseFlockStockDetailsDto(): void {
    this.flockStockDetailsDto = {
      id: null,
      name: null,
      surveyDate: null,
      age: null,
      flockCategory: null,
      alive: null,
      death: null,
      sterile: null,
      good: null,
      totalWeight: null,
      bagsEaten: null,
      amountOfChickenWeighted: null,
      cageName: null,
      comment: null,
      manureBags: null,
      feedSurveyDtos: [],
      surveyEggCountDtos: [],
      healthSurveyStockDtos: [],
      manureStockDtos: []
    }
  }

  public getFlockStockDetails(flockStockId: number): void {
    this.flockStockApiService.findFlockStockByFlockStockId(flockStockId).subscribe(data => {
      this.flockStockDetailsDto = data;
      this.initialiseFlockStockEditForm(data);
    })
  }

  public initialiseFlockStockEditForm(flockStockDetails: FlockStockDetailsFrontDto): void {
    this.actualGood = flockStockDetails.good;
    this.good = flockStockDetails.good + (flockStockDetails.death + flockStockDetails.sterile);
    this.death = flockStockDetails.death;
    this.sterile = flockStockDetails.sterile;
    this.flockStockEditForm = new FormGroup({
      id: new FormControl({ value: flockStockDetails.id, disabled: false }, Validators.compose([Validators.required])),
      good: new FormControl({ value: flockStockDetails.good, disabled: false }, Validators.compose([Validators.required])),
      death: new FormControl({ value: flockStockDetails.death, disabled: false }, Validators.compose([Validators.required])),
      sterile: new FormControl({ value: flockStockDetails.sterile, disabled: false }, Validators.compose([Validators.required])),
      totalWeight: new FormControl({ value: flockStockDetails.totalWeight, disabled: false }),
      amountOfChickenWeighted: new FormControl({ value: flockStockDetails.amountOfChickenWeighted, disabled: false }, Validators.compose([Validators.required])),
      comment: new FormControl({ value: flockStockDetails.comment, disabled: false }),
      manureBags: new FormControl({ value: flockStockDetails.manureBags, disabled: false })
    });

    this.eggReport = new MatTableDataSource<SurveyEggCountDto>(flockStockDetails.surveyEggCountDtos);
    this.feedReport = new MatTableDataSource<FeedSurveyDto>(flockStockDetails.feedSurveyDtos);
    this.healthReport = new MatTableDataSource<HealthSurveyStockDto>(flockStockDetails.healthSurveyStockDtos);
    this.manureReport = new MatTableDataSource<ManureStockDto>(flockStockDetails.manureStockDtos);
  }

  public editFlock(): void {
    this.flockStockApiService.editFlock(this.flockStockEditForm.value).subscribe({
      next: (data: string) => {
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock stock edited successfully');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public openEggModal(element: SurveyEggCountDto): void {
    this.initialiseEggEditForm(element);
    this.isEggModalOpen = true;
  }

  public initialiseEggEditForm(surveyEggCountDto: SurveyEggCountDto): void {
    this.eggEditForm = new FormGroup({
      flockStockId: new FormControl({ value: surveyEggCountDto.flockStockId, disabled: false }),
      name: new FormControl({ value: surveyEggCountDto.name, disabled: false }),
      eggCategoryId: new FormControl({ value: surveyEggCountDto.eggCategoryId, disabled: true }, Validators.compose([Validators.required])),
      tie: new FormControl({ value: this.format(surveyEggCountDto.quantity / 300), disabled: false }, Validators.compose([])),
      tray: new FormControl({ value: this.format(((surveyEggCountDto.quantity % 300) / 30)), disabled: false }, Validators.compose([Validators.max(9)])),
      item: new FormControl({ value: this.format((surveyEggCountDto.quantity % 300) % 30), disabled: false }, Validators.compose([Validators.max(29)])),
    });
  }

  public cancelEggEdit(): void {
    this.isEggModalOpen = false;
    this.eggModal.dismiss(null, 'cancel');
  }

  public confirmEggEdit(): void {
    this.eggModal.dismiss(null, 'confirm');
  }

  public onEggModalWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isEggModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isEggModalOpen = false;
      this.editEggRecord();
    }
  }

  public editEggRecord(): void {
    this.utilsService.presentLoading();
    const surveyEggCountDto: SurveyEggCountDto = {
      flockStockId: this.eggEditForm.get("flockStockId")?.value,
      name: this.eggEditForm.get("name")?.value,
      eggCategoryId: this.eggEditForm.get("eggCategoryId")?.value,
      quantity: (this.eggEditForm.get("tie")?.value * 300) + (this.eggEditForm.get("tray")?.value * 30) + this.eggEditForm.get("item")?.value
    }
    this.flockStockApiService.editEgg(surveyEggCountDto).subscribe({
      next: (data: string) => {
        this.eggEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Egg record successfully edited');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private initialiseAddEggFormBuilder(): void {
    this.addEggDetailsForm = this.formBuilder.group({
      eggCategories: this.formBuilder.array([
        this.addEggCategoryFormGroup()
      ])
    });
  }

  addEggCategoryFormGroup() {
    return this.formBuilder.group({
      eggCategoryId: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      tie: new FormControl(Validators.compose([])),
      tray: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.max(9)])),
      item: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.max(29)])),
    })
  }

  addEggCategory(): void {
    (this.addEggDetailsForm.get('eggCategories') as FormArray).push(this.addEggCategoryFormGroup());
  }

  removeEggCategory(eggCategoryGroupIndex: number): void {
    (this.addEggDetailsForm.get('eggCategories') as FormArray).removeAt(eggCategoryGroupIndex);
  }

  get eggCategoryFields() {
    return this.addEggDetailsForm ? this.addEggDetailsForm.get('eggCategories') as FormArray : null;
  }

  public addEggRecord(): void {
    this.utilsService.presentLoading();
    this.surveyEggCountDtos = [];
    this.surveyEggCountDtos = (this.addEggDetailsForm.get('eggCategories') as FormArray).value.map((form: any) => {
      const surveyEggCountDto: SurveyEggCountDto = {
        flockStockId: 0,
        name: "",
        eggCategoryId: form.eggCategoryId,
        quantity: (form.tie * 300) + (form.tray * 30) + form.item
      }
      return surveyEggCountDto;
    });
    this.flockStockApiService.addEgg(this.flockStockId, this.surveyEggCountDtos).subscribe({
      next: (data: string) => {
        this.addEggDetailsForm.reset();
        (this.addEggDetailsForm.get('eggCategories') as FormArray).clear();
        this.addEggCategory();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Egg record successfully added');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public openFeedModal(element: FeedSurveyDto): void {
    this.initialiseFeedEditForm(element);
    this.isFeedModalOpen = true;
  }

  public initialiseFeedEditForm(feedSurveyDto: FeedSurveyDto): void {
    this.feedEditForm = new FormGroup({
      name: new FormControl({ value: feedSurveyDto.name, disabled: true }),
      category: new FormControl({ value: feedSurveyDto.category, disabled: true }, Validators.compose([Validators.required])),
      weight: new FormControl({ value: feedSurveyDto.weight, disabled: true }, Validators.compose([Validators.required])),
      flockFeedLineId: new FormControl({ value: feedSurveyDto.flockFeedLineId, disabled: false }),
      bagsEaten: new FormControl({ value: feedSurveyDto.bagsEaten, disabled: false }, Validators.compose([Validators.required, Validators.max(feedSurveyDto.bagsAllocated)])),
      bagsAllocated: new FormControl({ value: feedSurveyDto.bagsAllocated, disabled: true }),
    });
  }

  public cancelFeedEdit(): void {
    this.isFeedModalOpen = false;
    this.feedModal.dismiss(null, 'cancel');
  }

  public confirmFeedEdit(): void {
    this.isFeedModalOpen = false;
    this.feedModal.dismiss(null, 'confirm');
    this.editFeedRecord();
  }

  public onFeedModalWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isFeedModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isFeedModalOpen = false;
      this.editFeedRecord();
    }
  }

  public editFeedRecord(): void {
    this.utilsService.presentLoading();
    this.flockStockApiService.editFeed(this.feedEditForm.value).subscribe({
      next: (data: string) => {
        this.feedEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Feed record successfully edited');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public openHealthModal(element: HealthSurveyStockDto): void {
    this.initialiseHealthEditForm(element);
    this.isHealthModalOpen = true;
  }

  public initialiseHealthEditForm(healthSurveyStockDto: HealthSurveyStockDto): void {
    this.healthEditForm = new FormGroup({
      healthProductStockId: new FormControl({ value: healthSurveyStockDto.healthProductStockId, disabled: false }),
      name: new FormControl({ value: healthSurveyStockDto.name, disabled: true }),
      healthType: new FormControl({ value: healthSurveyStockDto.healthType, disabled: true }),
      flockStockHealthProductLineId: new FormControl({ value: healthSurveyStockDto.flockStockHealthProductLineId, disabled: false }),
      boxesTotal: new FormControl({ value: healthSurveyStockDto.boxesTotal, disabled: true }),
      unitsPerBox: new FormControl({ value: healthSurveyStockDto.unitsPerBox, disabled: true }),
      unitsTotal: new FormControl({ value: healthSurveyStockDto.unitsTotal, disabled: true }),
      unitsUsed: new FormControl({ value: healthSurveyStockDto.unitsUsed, disabled: false }, Validators.compose([Validators.required])),
      expiryDate: new FormControl({ value: healthSurveyStockDto.expiryDate, disabled: true }),
    });
  }

  public cancelHealthEdit(): void {
    this.isHealthModalOpen = false;
    this.healthModal.dismiss(null, 'cancel');
  }

  public confirmHealthEdit(): void {
    this.isHealthModalOpen = false;
    this.healthModal.dismiss(null, 'confirm');
    this.editHealthRecord();
  }

  public onHealthModalWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isHealthModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isHealthModalOpen = false;
    }
  }

  public editHealthRecord(): void {
    this.utilsService.presentLoading();
    this.flockStockApiService.editHealth(this.healthEditForm.value).subscribe({
      next: (data: string) => {
        this.healthEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Medication / Vaccination record successfully edited');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public searchHealthProduct(): void {
    if (this.searchHealthProductSubscription) {
      this.searchHealthProductSubscription.unsubscribe();
    }
    this.searchHealthProductSubscription = this.searchHealthProductCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredHealthProducts = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          const name = {
            page: this.page,
            size: this.size,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder.toUpperCase(),
            active: true,
            name: value
          }
          return this.healthProductApiService.searchHealthProduct(name).pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        })
      )
      .subscribe((data: any) => {
        this.filteredHealthProducts = data
      });
  }

  public onHealthProductSelected(): void {
    this.selectedHealthProduct = this.selectedHealthProduct;
    this.healthProductApiService.findHealthSurveyDtoByHealthProductId(this.selectedHealthProduct.id).subscribe(productHealthSurvey => {
      this.selectedHealthProducts.push(productHealthSurvey);
    });
  }

  public removeHealthProduct(id: number): void {
    this.selectedHealthProducts = this.selectedHealthProducts.filter(selectedHealthProduct => {
      selectedHealthProduct.healthProductId != id;
    });
  }

  public displayWith(value: any): string {
    return value?.name;
  }

  public clearSelection(): void {
    this.selectedHealthProduct = "";
    this.filteredHealthProducts = [];
  }

  public changeUnitsUsed(event: any, unitsTotal: number, index1: number, index2: number): void {
    if (event > unitsTotal) {
      this.selectedHealthProducts[index1].healthSurveyStockDtos[index2].unitsUsed = 0;
    }
  }

  private getAllHealthProducts(): void {
    this.healthProductApiService.getAllHealthProducts().subscribe(healthProducts => {
      this.healthProducts = healthProducts;
    });
  }

  public addHealthRecord(): void {
    this.utilsService.presentLoading();
    this.flockStockApiService.addHealth(this.flockStockId, this.selectedHealthProducts).subscribe({
      next: (data: string) => {
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Medication / Vaccination record successfully added');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public openManureModal(element: ManureStockDto): void {
    this.initialiseManureEditForm(element);
    this.isManureModalOpen = true;
  }

  public initialiseManureEditForm(manureStockDto: ManureStockDto): void {
    this.manureEditForm = new FormGroup({
      id: new FormControl({ value: manureStockDto.id, disabled: false }),
      manureId: new FormControl({ value: manureStockDto.manureId, disabled: true }),
      weight: new FormControl({ value: manureStockDto.weight, disabled: true }),
      bags: new FormControl({ value: manureStockDto.bags, disabled: false }),
      cageId: new FormControl({ value: manureStockDto.cageId, disabled: false }),
    });
  }

  public cancelManureEdit(): void {
    this.isManureModalOpen = false;
    this.manureModal.dismiss(null, 'cancel');
  }

  public confirmManureEdit(): void {
    this.isManureModalOpen = false;
    this.manureModal.dismiss(null, 'confirm');
    this.editManureRecord();
  }

  public onManureModalWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isManureModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isManureModalOpen = false;
      this.editManureRecord();
    }
  }

  public editManureRecord(): void {
    this.utilsService.presentLoading();
    this.flockStockApiService.editManure(this.flockStockId, this.manureEditForm.value).subscribe({
      next: (data: string) => {
        this.manureEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Fertilizer record successfully edited');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private initialiseAddManureFormBuilder(): void {
    this.addManureDetailsForm = this.formBuilder.group({
      manureStocks: this.formBuilder.array([
        this.addManureStockFormGroup()
      ])
    });
  }

  addManureStockFormGroup() {
    return this.formBuilder.group({
      manureId: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      bags: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    })
  }

  addManureStock(): void {
    (this.addManureDetailsForm.get('manureStocks') as FormArray).push(this.addManureStockFormGroup());
  }

  removeManureStock(manureStockGroupIndex: number): void {
    (this.addManureDetailsForm.get('manureStocks') as FormArray).removeAt(manureStockGroupIndex);
  }

  get manureStockFields() {
    return this.addManureDetailsForm ? this.addManureDetailsForm.get('manureStocks') as FormArray : null;
  }

  public addManureRecord(): void {
    this.utilsService.presentLoading();
    this.flockStockApiService.addManure(this.flockStockId, this.addManureDetailsForm.get('manureStocks')?.value).subscribe({
      next: (data: string) => {
        this.addManureDetailsForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Fertilizer record successfully added');
        this.getFlockStockDetails(this.flockStockId);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public getManures() {
    this.manures = [];
    this.manureStockApiService.findManures().subscribe(manures => {
      this.manures = manures;
    })
  }

  format(value: number): number {
    return this.utilsService.formatEggQuantity(value);
  }
}
