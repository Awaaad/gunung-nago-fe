import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SurveyApiService } from '../service/api/survey.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlockCategory, SurveyDto } from 'generated-src/model';
import { SurveyFrontDto } from 'generated-src/model-front';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from 'src/app/shared/services/utils.service';

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
  public tie: number = 0;
  public item: number = 0;
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.initialiseFormGroup();
    this.findSurveyDtoForSelectedCage();
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
      tie: new FormControl({ value: this.tie, disabled: false }, Validators.compose([])),
      item: new FormControl({ value: this.item, disabled: false }, Validators.compose([])),
      broken: new FormControl({ value: this.broken, disabled: false }, Validators.compose([])),
      upDownProduction: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      vaccineMedication: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      standardFeed: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      givenFeed: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      comments: new FormControl({ value: '', disabled: false }, Validators.compose([])),
      cageId: new FormControl({ value: 0, disabled: false }, Validators.compose([])),
      flockId: new FormControl({ value: 0, disabled: false }, Validators.compose([])),
      flockStockId: new FormControl({ value: this.flockStockId, disabled: false }, Validators.compose([])),
      eggStockId: new FormControl({ value: this.eggStockId, disabled: false }, Validators.compose([]))
    });
  }

  public calculateRemaining() {
    this.remaining = this.population - (this.dead + this.sterile)
  }

  public calculateTotalItem() {
    this.totalItem = (this.tie * 300) + this.item + this.broken;
  }

  private findSurveyDtoForSelectedCage(): void {
    this.surveyApiService.findSurveyByCageId(this.cageId).subscribe((surveyDetails: SurveyDto) => {
      if (!JSON.parse(this.edit)) {
        this.cageName = surveyDetails.cageName;
        this.flockCategory = surveyDetails.flockCategory;
        this.flockAge = surveyDetails.age;
        this.population = surveyDetails.good;
        this.dead = 0;
        this.sterile = 0;
        this.tie = 0;
        this.item = 0;
        this.broken = 0;
        this.surveyForm.setValue({
          population: surveyDetails.good,
          dead: this.dead,
          sterile: this.sterile,
          tie: this.tie,
          item: this.item,
          broken: this.broken,
          upDownProduction: '',
          vaccineMedication: '',
          standardFeed: '',
          givenFeed: '',
          comments: '',
          cageId: surveyDetails.cageId,
          flockId: surveyDetails.flockId,
          flockStockId: null,
          eggStockId: null
        })
      } else {
        this.cageName = surveyDetails.cageName;
        this.flockCategory = surveyDetails.flockCategory;
        this.flockAge = surveyDetails.age;
        this.population = surveyDetails.good + surveyDetails.death + surveyDetails.sterile;
        this.flockStockId = surveyDetails.flockStockId;
        this.eggStockId = surveyDetails.eggStockId;
        this.dead = surveyDetails.death;
        this.sterile = surveyDetails.sterile;
        this.tie = Math.floor(surveyDetails.goodEggs / 300);
        this.item = surveyDetails.goodEggs % 300;
        this.broken = surveyDetails.badEggs;

        this.surveyForm.setValue({
          population: surveyDetails.good + surveyDetails.death + surveyDetails.sterile,
          dead: this.dead,
          sterile: this.sterile,
          tie: this.tie,
          item: this.item,
          broken: this.broken,
          upDownProduction: '',
          vaccineMedication: '',
          standardFeed: '',
          givenFeed: '',
          comments: '',
          cageId: surveyDetails.cageId,
          flockId: surveyDetails.flockId,
          flockStockId: surveyDetails.flockStockId,
          eggStockId: surveyDetails.eggStockId
        })
      }
    })
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.initialiseSurveyDto();
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
      goodEggs: null
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
      goodEggs: (this.tie * 300) + this.item
    };
  }
}
