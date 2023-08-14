import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public language = "en";

  constructor(
    private translateService: TranslateService
  ) {}

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }
  
  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }
}
