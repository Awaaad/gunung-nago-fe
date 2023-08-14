import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CageApiService } from '../service/api/cage.api.service';
import { CageDto } from 'generated-src/model';

@Component({
  selector: 'app-cage-list',
  templateUrl: './cage-survey-list.component.html',
  styleUrls: ['./cage-survey-list.component.scss'],
})
export class CageSurveyListComponent implements OnInit {

  public cages: any[] = [];
  public cagesDara: any[] = [];
  public cagesDoc: any[] = [];

  public language = "en";

  constructor(
    private cageApiService: CageApiService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public routeToSurveyDetails(cage: CageDto) {
    this.router.navigate([`survey/survey-details/${cage.id}`])
  }

  public routeToCageDetails(cage: string) {
    this.router.navigate([`stock/stock-details`])
  }

  public search() {
    const test = {
      page: 0,
      size: 20,
      sortBy: "name",
      sortOrder: "ASC",
    }
    this.cageApiService.search(test).subscribe(cages => {
      this.cagesDoc = cages.content.filter((cage: { cageCategory: string; }) => cage.cageCategory === 'DOC');
      this.cagesDara = cages.content.filter((cage: { cageCategory: string; }) => cage.cageCategory === 'DARA');
      this.cages = cages.content.filter((cage: { cageCategory: string; }) => cage.cageCategory === 'NORM');
    })
  }

}
