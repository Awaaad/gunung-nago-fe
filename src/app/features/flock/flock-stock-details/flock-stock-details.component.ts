import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FlockStockDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-flock-stock-details',
  templateUrl: './flock-stock-details.component.html',
  styleUrls: ['./flock-stock-details.component.scss'],
})
export class FlockStockDetailsComponent implements OnInit {
  public flockId: any = this.activatedRoute.snapshot.paramMap.get('id');
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public adjustmentForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['age', 'flockCategory', 'cageName', 'alive', 'death', 'sterile', 'good', 'amountOfChickenWeighted', 'totalWeight', 'averageWeight', 'createdBy', 'createdDate', 'lastModifiedBy', 'lastModifiedDate', 'surveyDate', 'actions'];
  public flockStocks = new MatTableDataSource<FlockStockDto>;
  private infiniteflockStocks: FlockStockDto[] = [];
  public flockStockSearchSubscription!: Subscription;
  public name!: string;
  private page: number = 0;
  private size: number = 20;
  public createdBy: string = '';
  public lastModifiedBy: string = '';
  public usernames: string[] = [];
  public createdDateFrom: Date | any = null;
  public createdDateTo: Date | any = null;
  public lastModifiedDateFrom: Date | any = null;
  public lastModifiedDateTo: Date | any = null;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private flockApiService: FlockApiService,
    private translateService: TranslateService,
    private securityApiService: SecurityApiService,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getRouteParams();
    this.getAllUsernames();
    this.search();
  }

  private getRouteParams(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.name = params['name'];
      }
      );
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getAllUsernames(): void {
    this.securityApiService.getAllUsernames().subscribe(usernames => {
      this.usernames = usernames;
    })
  }

  public ionChangeCreatedBy(event: any): void {
    this.createdBy = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeLastModifiedBy(event: any): void {
    this.lastModifiedBy = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectCreatedDateFrom(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearCreatedDateFrom(): void {
    this.createdDateFrom = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectCreatedDateTo(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearCreatedDateTo(): void {
    this.createdDateTo = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectLastModifiedDateFrom(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearLastModifiedDateFrom(): void {
    this.lastModifiedDateFrom = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectLastModifiedDateTo(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearLastModifiedDateTo(): void {
    this.lastModifiedDateTo = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteflockStocks = [];
      this.flockStocks = new MatTableDataSource<FlockStockDto>([]);
    }
    const flockStockSearchCriteriaDto: any = {
      flockId: this.flockId,
      page: this.page,
      size: this.size,
      createdBy: this.createdBy === '' || this.createdBy === null ? null : this.createdBy,
      lastModifiedBy: this.lastModifiedBy === '' || this.lastModifiedBy === null ? null : this.lastModifiedBy,
      createdDateFrom: this.createdDateFrom === null ? '' : this.createdDateFrom,
      createdDateTo: this.createdDateTo === null ? '' : this.createdDateTo,
      lastModifiedDateFrom: this.lastModifiedDateFrom === null ? '' : this.lastModifiedDateFrom,
      lastModifiedDateTo: this.lastModifiedDateTo === null ? '' : this.lastModifiedDateTo,
    }

    if (flockStockSearchCriteriaDto.createdBy === null) {
      delete flockStockSearchCriteriaDto.createdBy;
    }

    if (flockStockSearchCriteriaDto.lastModifiedBy === null) {
      delete flockStockSearchCriteriaDto.lastModifiedBy;
    }

    this.flockApiService.searchFlockStock(flockStockSearchCriteriaDto).subscribe(flockStocks => {
      this.infiniteflockStocks = [...this.infiniteflockStocks, ...flockStocks.content];
      this.flockStocks = new MatTableDataSource<FlockStockDto>(this.infiniteflockStocks);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.search(event, true);
    }, 500);
  }

  public reset(): void {
    this.createdBy = '';
    this.createdDateFrom = null;
    this.createdDateTo = null;
    this.lastModifiedBy = '';
    this.lastModifiedDateFrom = null;
    this.lastModifiedDateTo = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public routeToFlockStockEditDetails(element: FlockStockDto): void {
    this.router.navigate([`flock/flock-stock-edit-details/${element.id}`], { queryParams: { name: this.name, surveyDate: element.surveyDate, cageName: element.cageName } });
  }

  public isTodayOrYesterday(date: Date): boolean {
    console.log(date);
    const today = new Date();
    console.log(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateYear = new Date(date).getFullYear();
    const dateMonth = new Date(date).getMonth();
    const dateDay = new Date(date).getDate();

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = yesterday.getMonth();
    const yesterdayDay = yesterday.getDate();

    return (
      (dateYear === todayYear && dateMonth === todayMonth && dateDay === todayDay) ||
      (dateYear === yesterdayYear && dateMonth === yesterdayMonth && dateDay === yesterdayDay)
    );
  }
}