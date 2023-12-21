import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HealthProductStockDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-health-stock-details',
  templateUrl: './health-stock-details.component.html',
  styleUrls: ['./health-stock-details.component.scss'],
})
export class HealthStockDetailsComponent implements OnInit {
  public healthProductId: any = this.activatedRoute.snapshot.paramMap.get('id');
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public adjustmentForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['quantity', 'unitsPerBox', 'unitsTotal', 'pricePerBox', 'expiryDate', 'createdBy', 'createdDate', 'lastModifiedBy', 'lastModifiedDate'];
  public healthProductStocks = new MatTableDataSource<HealthProductStockDto>;
  private infiniteHealthProductStocks: HealthProductStockDto[] = [];
  public healthProductStockSearchSubscription!: Subscription;
  public name!: string;
  public type!: string;
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
    private healthProductApiService: HealthProductApiService,
    private translateService: TranslateService,
    private securityApiService: SecurityApiService,
    private utilsService: UtilsService
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
        this.type = params['type'];
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
      this.infiniteHealthProductStocks = [];
      this.healthProductStocks = new MatTableDataSource<HealthProductStockDto>([]);
    }
    const healthProductStockSearchCriteriaDto: any = {
      healthProductId: this.healthProductId,
      page: this.page,
      size: this.size,
      createdBy: this.createdBy === '' || this.createdBy === null ? null : this.createdBy,
      lastModifiedBy: this.lastModifiedBy === '' || this.lastModifiedBy === null ? null : this.lastModifiedBy,
      createdDateFrom: this.createdDateFrom === null ? '' : this.createdDateFrom,
      createdDateTo: this.createdDateTo === null ? '' : this.createdDateTo,
      lastModifiedDateFrom: this.lastModifiedDateFrom === null ? '' : this.lastModifiedDateFrom,
      lastModifiedDateTo: this.lastModifiedDateTo === null ? '' : this.lastModifiedDateTo,
    }

    if (healthProductStockSearchCriteriaDto.createdBy === null) {
      delete healthProductStockSearchCriteriaDto.createdBy;
    }

    if (healthProductStockSearchCriteriaDto.lastModifiedBy === null) {
      delete healthProductStockSearchCriteriaDto.lastModifiedBy;
    }

    this.healthProductApiService.searchHealthProductStock(healthProductStockSearchCriteriaDto).subscribe(healthProductStocks => {
      this.infiniteHealthProductStocks = [...this.infiniteHealthProductStocks, ...healthProductStocks.content];
      this.healthProductStocks = new MatTableDataSource<HealthProductStockDto>(this.infiniteHealthProductStocks);

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
}