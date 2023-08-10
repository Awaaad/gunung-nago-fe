import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cage-list',
  templateUrl: './cage-list.component.html',
  styleUrls: ['./cage-list.component.scss'],
})
export class CageListComponent implements OnInit {

  public cages: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  public cagesDara: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  public cagesDoc: string[] = ['A', 'B', 'C'];

  public language = "en";

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public routeToCageDetails(cage: string) {
    this.router.navigate([`stock/stock-details`])
  }

}
