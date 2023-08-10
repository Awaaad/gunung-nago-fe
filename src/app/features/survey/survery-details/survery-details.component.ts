import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-survery-details',
  templateUrl: './survery-details.component.html',
  styleUrls: ['./survery-details.component.scss'],
})
export class SurveryDetailsComponent {
  public population: number = 4832;
  public dead: number = 0;
  public sterile: number = 0;
  public remaining: number = 0;
  public tie: number = 0;
  public item: number = 0;
  public broken: number = 0;
  public totalItem: number = 0;
  public today: string = formatDate(new Date(), 'dd-MM-yyyy HH:mm', 'en');
  public language = "en";

  constructor(
    private translateService: TranslateService
  ) { }

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
}
