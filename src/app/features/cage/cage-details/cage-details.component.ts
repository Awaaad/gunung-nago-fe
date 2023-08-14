import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cage-details',
  templateUrl: './cage-details.component.html',
  styleUrls: ['./cage-details.component.scss'],
})
export class CageDetailsComponent {
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

  public cageDetailsForm = new FormGroup({
    name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    active: new FormControl({ value: true, disabled: false }, Validators.compose([Validators.required])),
  });
}
