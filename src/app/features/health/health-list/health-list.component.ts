import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HealthProductDto, HealthSurveyStockDto, HealthType } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-health-list',
  templateUrl: './health-list.component.html',
  styleUrls: ['./health-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: "*" })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HealthListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'description', 'healthType', 'active', 'supplier', 'edit'];
  public displayedSubColumns: string[] = ['boxesTotal', 'unitsTotal', 'unitsUsed', 'expiryDate'];
  public healthProducts = new MatTableDataSource<HealthProductDto>;
  private infiniteHealthProducts: HealthProductDto[] = [];
  public healthProductSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public healthTypes: string[] = [];
  public healthProductName: string = '';
  public active: boolean = true;
  public healthType: HealthType | string = '';
  public expandedElement: any | null;
  public healthSurveyStocks: HealthSurveyStockDto[] = [];

  constructor(
    private healthProductApiService: HealthProductApiService,
    private translateService: TranslateService,
    private utilService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
    this.healthTypes = Object.keys(HealthType);
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchByHealthProductName(healthProductName: any): void {
    this.healthProductSearchSubscription.unsubscribe();
    this.healthProducts = new MatTableDataSource<HealthProductDto>;
    this.page = 0;
    this.healthProductName = healthProductName;
    this.search();
  }

  public toggleActive(event: any): void {
    this.active = event.detail.checked;
    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public ionChangeHealthType(event: any): void {
    this.healthType = event.detail.value;
    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteHealthProducts = [];
      this.healthProducts = new MatTableDataSource<HealthProductDto>([]);
    }
    const healthProductSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      name: this.healthProductName,
      active: this.active,
      healthType: this.healthType
    }

    this.healthProductSearchSubscription = this.healthProductApiService.search(healthProductSearchCriteriaDto).subscribe(healthProducts => {
      this.infiniteHealthProducts = [...this.infiniteHealthProducts, ...healthProducts.content];
      this.healthProducts = new MatTableDataSource<HealthProductDto>(this.infiniteHealthProducts);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.healthProductName = '';
    this.active = true;
    this.healthType = '';
    this.sortOrder = 'asc'.toLocaleUpperCase();
    this.sortBy = 'name';
    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.search(event, true);
    }, 500);
  }

  onScroll(event: any) {
    event.returnValue = false;
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction.toUpperCase();

    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    })
  }

  toggleRow(element: any) {
    // Uncommnet to open only single row at once
    // ELEMENT_DATA.forEach(row => {
    //   row.expanded = false;
    // })
    console.log(element);
    element.expanded = !element.expanded
    this.healthSurveyStocks = [];
    this.healthProductApiService.findHealthSurveyDtoByHealthProductId(element.id).subscribe(productHealthSurvey => {
      this.healthSurveyStocks = productHealthSurvey.healthSurveyStockDtos;
    })
  }
}
