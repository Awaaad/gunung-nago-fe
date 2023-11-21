import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EggCategoryDto, FeedSurveyDto, FlockCategory, FlockFeedLineDto, HealthProductDto, HealthSurveyDto, SurveyDto, SurveyEggCountDto } from 'generated-src/model';
import { SurveyFrontDto } from 'generated-src/model-front';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { FlockFeedLineApiService } from 'src/app/shared/apis/flock-feed-line.api.service';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { SurveyApiService } from '../../../shared/apis/survey.api.service';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';

@Component({
  selector: 'app-survery-details',
  templateUrl: './survery-details.component.html',
  styleUrls: ['./survery-details.component.scss'],
})
export class SurveryDetailsComponent implements OnInit {
  public population: number = 0;
  public dead: number = 0;
  public sterile: number = 0;
  public remaining: number = 0;
  public bigEggsItem: number = 0;
  public bigEggsTie: number = 0;
  public bigEggsTray: number = 0;
  public mediumEggsItem: number = 0;
  public mediumEggsTie: number = 0;
  public mediumEggsTray: number = 0;
  public smallEggsItem: number = 0;
  public smallEggsTie: number = 0;
  public smallEggsTray: number = 0;
  public manureBags: number = 0;
  public manureWeight: number = 0;
  public amountOfChickenWeighted: number = 0;
  public totalWeight: number = 0;
  public averageWeight: number = 0;
  public broken: number = 0;
  public totalItem: number = 0;
  public flockStockId!: number;
  public eggStockId!: number;
  public today: string = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en');
  public language = "en";
  public cageId: any = this.activatedRoute.snapshot.paramMap.get('cageId');
  public flockId: any = 0;
  public edit: any = this.activatedRoute.snapshot.paramMap.get('edit');
  public cageName: string = '';
  public flockCategory!: FlockCategory;
  public flockAge: number = 0;
  private surveyDto: SurveyFrontDto = new SurveyFrontDto();
  public surveyForm!: FormGroup;

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

  //egg section
  public eggCategories: EggCategoryDto[] = [];
  public surveyEggCountDtos: SurveyEggCountDto[] = [];

  // feed section
  public feedSurvey: FeedSurveyDto[] = [];
  public feedLines: FlockFeedLineDto[] = [];

  public errorMessages = {
    tray: [
      { type: 'max', message: 'Tray cannot be more than 9' },
    ],
    item: [
      { type: 'max', message: 'Item cannot be more than 29' },
    ],
    eggCategory: [
      { type: 'required', message: 'Egg category is required' },
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private eggCategoryApiService: EggCategoryApiService,
    private formBuilder: FormBuilder,
    private flockFeedLineApiService: FlockFeedLineApiService,
    private healthProductApiService: HealthProductApiService,
    private router: Router,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.getAllEggCategories();
    this.initialiseFormGroup();
    this.findSurveyDtoForSelectedCage();
    this.getAllHealthProducts();
    this.searchHealthProduct();
  }

  ionViewWillEnter(): void {
    this.initialiseFormGroup();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  public getAllEggCategories() {
    this.eggCategoryApiService.findAll().subscribe(eggCategories => {
      this.eggCategories = eggCategories;
    })
  }

  private initialiseFormGroup(): void {
    this.surveyForm = this.formBuilder.group({
      population: new FormControl({ value: this.population, disabled: false }, Validators.compose([])),
      dead: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      sterile: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      upDownProduction: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      vaccineMedication: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      standardFeed: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      givenFeed: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      comments: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      cageId: new FormControl({ value: this.cageId, disabled: false }, Validators.compose([])),
      flockId: new FormControl({ value: this.flockId, disabled: false }, Validators.compose([])),
      flockStockId: new FormControl({ value: this.flockStockId, disabled: false }, Validators.compose([])),
      eggStockId: new FormControl({ value: this.eggStockId, disabled: false }, Validators.compose([])),
      comment: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      manureBags: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      manureWeight: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      amountOfChickenWeighted: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      totalWeight: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      averageWeight: new FormControl({ value: null, disabled: false }, Validators.compose([])),
      eggCategories: this.formBuilder.array([
        this.addEggCategoryFormGroup()
      ]),
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
    (this.surveyForm.get('eggCategories') as FormArray).push(this.addEggCategoryFormGroup());
  }

  removeEggCategory(eggCategoryGroupIndex: number): void {
    (this.surveyForm.get('eggCategories') as FormArray).removeAt(eggCategoryGroupIndex);
  }

  get eggCategoryFields() {
    return this.surveyForm ? this.surveyForm.get('eggCategories') as FormArray : null;
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

  private findAllActiveFlockLinesByFlockId(flockId: number): void {
    this.flockFeedLineApiService.findAllActiveFlockFeedLinesByFlockId(flockId).subscribe(feedLines => {
      this.feedLines = feedLines;
      this.feedLines.forEach(feeLine => {
        feeLine.bagsEaten = 0;
      });
    });
  }

  public calculateRemaining() {
    this.remaining = this.population - (this.dead + this.sterile)
  }

  public calculateTotalItem() {
    this.totalItem = 0;
    (this.surveyForm.get('eggCategories') as FormArray).value.forEach((form: any) => {
      this.totalItem = this.totalItem + (form.tie * 300) + (form.tray * 30) + form.item;
    })
  }

  private getAllHealthProducts(): void {
    this.healthProductApiService.getAllHealthProducts().subscribe(healthProducts => {
      this.healthProducts = healthProducts;
    });
  }

  private findSurveyDtoForSelectedCage(): void {
    if (!JSON.parse(this.edit)) {
      this.surveyApiService.findMostRecentSurveyDtoForCage(this.cageId).subscribe((surveyDetails: SurveyDto) => {
        this.cageName = surveyDetails.cageName;
        this.flockCategory = surveyDetails.flockCategory;
        this.flockAge = surveyDetails.age;
        this.population = surveyDetails.good;
        this.cageId = surveyDetails.cageId;
        this.flockId = surveyDetails.flockId;
        this.dead = 0;
        this.sterile = 0;
        this.broken = 0;
        this.surveyForm.setValue({
          population: surveyDetails.good,
          dead: this.dead,
          sterile: this.sterile,
          upDownProduction: '',
          vaccineMedication: '',
          standardFeed: '',
          givenFeed: '',
          comments: '',
          cageId: this.cageId,
          flockId: this.flockId,
          flockStockId: null,
          eggStockId: null,
          comment: null,
          manureBags: this.manureBags,
          manureWeight: this.manureWeight,
          amountOfChickenWeighted: this.amountOfChickenWeighted,
          totalWeight: this.totalWeight,
          averageWeight: this.averageWeight,
          eggCategories:
            [{
              eggCategoryId: null,
              tie: null,
              tray: null,
              item: null
            }]
        })
        this.findAllActiveFlockLinesByFlockId(surveyDetails.flockId);
      });
    } else {
      this.surveyApiService.findSurveyByCageId(this.cageId).subscribe((surveyDetails: SurveyDto) => {
        this.cageName = surveyDetails.cageName;
        this.flockCategory = surveyDetails.flockCategory;
        this.flockAge = surveyDetails.age;
        this.population = surveyDetails.good + surveyDetails.death + surveyDetails.sterile;
        this.flockStockId = surveyDetails.flockStockId;
        this.eggStockId = surveyDetails.eggStockId;
        this.dead = surveyDetails.death;
        this.sterile = surveyDetails.sterile;
        this.cageId = surveyDetails.cageId;
        this.flockId = surveyDetails.flockId;

        this.surveyForm.setValue({
          population: surveyDetails.good + surveyDetails.death + surveyDetails.sterile,
          dead: this.dead,
          sterile: this.sterile,
          bigEggsTie: this.bigEggsTie,
          bigEggsItem: this.bigEggsItem,
          mediumEggsTie: this.mediumEggsTie,
          mediumEggsItem: this.mediumEggsItem,
          smallEggsTie: this.smallEggsTie,
          smallEggsItem: this.smallEggsItem,
          broken: this.broken,
          upDownProduction: '',
          vaccineMedication: '',
          standardFeed: '',
          givenFeed: '',
          comments: '',
          cageId: this.cageId,
          flockId: this.flockId,
          flockStockId: surveyDetails.flockStockId,
          eggStockId: surveyDetails.eggStockId,
          comment: surveyDetails.comment,
          manureBags: this.manureBags,
          manureWeight: this.manureWeight,
          amountOfChickenWeighted: this.amountOfChickenWeighted,
          totalWeight: this.totalWeight,
          averageWeight: this.averageWeight
        })
      });
    }
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseSurveyDto();
    this.setFeedSurvey();
    this.populateSurveyDtoWithFormValues();
    if (!JSON.parse(this.edit)) {
      this.surveyApiService.save(this.surveyDto).subscribe({
        next: (data: string) => {
          this.utilsService.dismissLoading();
          this.utilsService.successMsg('Survey successfully saved');
          this.router.navigate([`cage/cage-survey-list`])
        },
        error: (error: HttpErrorResponse) => {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      });
    } else {
      this.surveyApiService.edit(this.surveyDto).subscribe({
        next: (data: string) => {
          this.utilsService.dismissLoading();
          this.utilsService.successMsg('Survey edited added');
          this.router.navigate([`cage/cage-survey-list`])
        },
        error: (error: HttpErrorResponse) => {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      });
    }
  }

  public cancel(): void {
    this.findSurveyDtoForSelectedCage();
  }

  private initialiseSurveyDto(): void {
    this.surveyDto = {
      cageId: null,
      flockId: null,
      flockStockId: null,
      eggStockId: null,
      activeFlock: null,
      cageName: null,
      cageCategory: null,
      flockCategory: null,
      age: null,
      death: null,
      sterile: null,
      good: null,
      healthSurveyDtos: [],
      feedSurveyDtos: [],
      surveyEggCountDtos: [],
      comment: null,
      manureBags: null,
      manureWeight: null,
      amountOfChickenWeighted: null,
      totalWeight: null,
      averageWeight: null
    }
  }

  private populateSurveyDtoWithFormValues(): void {
    this.surveyEggCountDtos = [];
    this.surveyEggCountDtos = (this.surveyForm.get('eggCategories') as FormArray).value.map((form: any) => {
      const surveyEggCountDto: SurveyEggCountDto = {
        eggCategoryId: form.eggCategoryId,
        quantity: (form.tie * 300) + (form.tray * 30) + form.item
      }
      return surveyEggCountDto;
    });
    this.surveyDto = {
      cageId: this.surveyForm.value.cageId,
      flockId: this.surveyForm.value.flockId,
      flockStockId: this.surveyForm.value.flockStockId,
      eggStockId: this.surveyForm.value.flockStockId,
      activeFlock: true,
      cageName: null,
      cageCategory: null,
      flockCategory: null,
      age: null,
      death: this.surveyForm.value.dead,
      sterile: this.surveyForm.value.sterile,
      good: this.remaining,
      healthSurveyDtos: this.selectedHealthProducts,
      feedSurveyDtos: this.feedSurvey,
      surveyEggCountDtos: this.surveyEggCountDtos,
      comment: this.surveyForm.value.comment,
      manureBags: this.surveyForm.value.manureBags,
      manureWeight: this.surveyForm.value.manureWeight,
      amountOfChickenWeighted: this.surveyForm.value.amountOfChickenWeighted,
      totalWeight: this.surveyForm.value.totalWeight,
      averageWeight: this.surveyForm.value.averageWeight
    };
  }

  private setFeedSurvey(): void {
    this.feedSurvey = [];
    this.feedLines.filter(feedLine => { return feedLine.bagsEaten !== 0 }).forEach(feedLine => {
      const feedSurvey: FeedSurveyDto = new FeedSurveyDto();
      feedSurvey.flockFeedLineId = feedLine.id;
      feedSurvey.bagsEaten = feedLine.bagsEaten;
      this.feedSurvey.push(feedSurvey);
    })
  }
}
