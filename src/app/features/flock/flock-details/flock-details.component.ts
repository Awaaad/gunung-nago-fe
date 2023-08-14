import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private translateService: TranslateService
  ) { }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  public flockDetailsForm = new FormGroup({
    cageId: new FormControl({ value: 1, disabled: false }, Validators.compose([Validators.required])),
    initialQuantity: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    initialAge: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    aquisitionDate: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    aquisitionType: new FormControl({ value: 'PURCHASE', disabled: false }, Validators.compose([Validators.required])),
  });
}
