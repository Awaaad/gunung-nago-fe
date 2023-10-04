import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FeedSurveyDto, FlockCategory, FlockFeedLineDto, HealthProductDto, HealthSurveyDto, SurveyDto } from 'generated-src/model';
import { SurveyFrontDto } from 'generated-src/model-front';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { FlockFeedLineApiService } from 'src/app/shared/apis/flock-feed-line.api.service';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { SurveyApiService } from '../../../shared/apis/survey.api.service';

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
  public mediumEggsItem: number = 0;
  public mediumEggsTie: number = 0;
  public smallEggsItem: number = 0;
  public smallEggsTie: number = 0;
  public broken: number = 0;
  public totalItem: number = 0;
  public flockStockId!: number;
  public eggStockId!: number;
  public today: string = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en');
  public language = "en";
  public cageId: any = this.activatedRoute.snapshot.paramMap.get('cageId');
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

  // feedSection
  public feedSurvey: FeedSurveyDto[] = [];
  public feedLines: FlockFeedLineDto[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private flockFeedLineApiService: FlockFeedLineApiService,
    private healthProductApiService: HealthProductApiService,
    private router: Router,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.initialiseFormGroup();
    this.findSurveyDtoForSelectedCage();
    this.getAllHealthProducts();
    this.searchHealthProduct();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  private initialiseFormGroup(): void {
    this.surveyForm = new FormGroup({
      population: new FormControl({ value: this.population, disabled: false }, Validators.compose([])),
      dead: new FormControl({ value: this.dead, disabled: false }, Validators.compose([])),
      sterile: new FormControl({ value: this.sterile, disabled: false }, Validators.compose([])),
      bigEggsTie: new FormControl({ value: this.bigEggsTie, disabled: false }, Validators.compose([])),
      bigEggsItem: new FormControl({ value: this.bigEggsItem, disabled: false }, Validators.compose([])),
      mediumEggsTie: new FormControl({ value: this.mediumEggsTie, disabled: false }, Validators.compose([])),
      mediumEggsItem: new FormControl({ value: this.mediumEggsItem, disabled: false }, Validators.compose([])),
      smallEggsTie: new FormControl({ value: this.smallEggsTie, disabled: false }, Validators.compose([])),
      smallEggsItem: new FormControl({ value: this.smallEggsItem, disabled: false }, Validators.compose([])),
      broken: new FormControl({ value: this.broken, disabled: false }, Validators.compose([])),
      upDownProduction: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      vaccineMedication: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      standardFeed: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      givenFeed: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      comments: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      cageId: new FormControl({ value: 0, disabled: false }, Validators.compose([])),
      flockId: new FormControl({ value: 0, disabled: false }, Validators.compose([])),
      flockStockId: new FormControl({ value: this.flockStockId, disabled: false }, Validators.compose([])),
      eggStockId: new FormControl({ value: this.eggStockId, disabled: false }, Validators.compose([])),
      comment: new FormControl({ value: '', disabled: false }, Validators.compose([]))
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
    this.totalItem = (this.bigEggsTie * 300) + this.bigEggsItem + (this.mediumEggsTie * 300) + this.mediumEggsItem + (this.smallEggsTie * 300) + this.smallEggsItem + this.broken;
  }

  public validateItem(event: any) {
    // if (event > 300) {
    //   this.item = 300
    // }
    // if (event < 0) {
    //   this.item = 0;
    // }
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
        this.dead = 0;
        this.sterile = 0;
        this.broken = 0;
        this.surveyForm.setValue({
          population: surveyDetails.good,
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
          cageId: surveyDetails.cageId,
          flockId: surveyDetails.flockId,
          flockStockId: null,
          eggStockId: null,
          comment: null
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
        this.bigEggsTie = Math.floor(surveyDetails.bigEggs / 300);
        this.bigEggsItem = surveyDetails.bigEggs % 300;
        this.mediumEggsTie = Math.floor(surveyDetails.mediumEggs / 300);
        this.mediumEggsItem = surveyDetails.mediumEggs % 300;
        this.smallEggsTie = Math.floor(surveyDetails.smallEggs / 300);
        this.smallEggsItem = surveyDetails.smallEggs % 300;
        this.broken = surveyDetails.badEggs;

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
          cageId: surveyDetails.cageId,
          flockId: surveyDetails.flockId,
          flockStockId: surveyDetails.flockStockId,
          eggStockId: surveyDetails.eggStockId,
          comment: surveyDetails.comment
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
      badEggs: null,
      bigEggs: null,
      mediumEggs: null,
      smallEggs: null,
      healthSurveyDtos: [],
      feedSurveyDtos: [],
      comment: null
    }
  }

  private populateSurveyDtoWithFormValues(): void {
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
      badEggs: this.broken,
      bigEggs: (this.bigEggsTie * 300) + this.surveyForm.value.bigEggsItem,
      mediumEggs: (this.mediumEggsTie * 300) + this.surveyForm.value.mediumEggsItem,
      smallEggs: (this.smallEggsTie * 300) + this.surveyForm.value.smallEggsItem,
      healthSurveyDtos: this.selectedHealthProducts,
      feedSurveyDtos: this.feedSurvey,
      comment: this.surveyForm.value.comment
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
