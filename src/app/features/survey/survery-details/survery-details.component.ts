import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SurveyApiService } from '../service/api/survey.api.service';
import { ActivatedRoute } from '@angular/router';
import { FlockCategory, SurveyDto } from 'generated-src/model';

@Component({
  selector: 'app-survery-details',
  templateUrl: './survery-details.component.html',
  styleUrls: ['./survery-details.component.scss'],
})
export class SurveryDetailsComponent {
  public population: number = 0;
  public dead: number = 0;
  public sterile: number = 0;
  public remaining: number = 0;
  public tie: number = 0;
  public item: number = 0;
  public broken: number = 0;
  public totalItem: number = 0;
  public today: string = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en');
  public language = "en";
  public cageId: any = this.activatedRoute.snapshot.paramMap.get('cageId');
  public cageName: string = '';
  public flockCategory!: FlockCategory;
  public flockAge: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService
  ) {
  }

  ionViewWillEnter() {
    this.findSurveyDtoForSelectedCage();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  public stockForm = new FormGroup({
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
  });

  public calculateRemaining() {
    this.remaining = this.population - (this.dead + this.sterile)
  }

  public calculateTotalItem() {
    this.totalItem = (this.tie * 300) + this.item + this.broken;
  }

  private findSurveyDtoForSelectedCage(): void {
    this.surveyApiService.findById(this.cageId).subscribe((surveyDetails: SurveyDto) => {
      this.cageName = surveyDetails.cageName;
      this.flockCategory = surveyDetails.flockCategory;
      this.flockAge = surveyDetails.age;
      this.population = surveyDetails.good;
      this.stockForm.setValue({
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
        comments: ''
      })
    })
  }
}
