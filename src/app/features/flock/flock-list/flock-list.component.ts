import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AquisitionType, CageDto, FlockCategory, FlockDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { FlockApiService } from '../../../shared/apis/flock.api.service';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import moment from 'moment';

@Component({
  selector: 'app-flock-list',
  templateUrl: './flock-list.component.html',
  styleUrls: ['./flock-list.component.scss'],
})
export class FlockListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'cageName', 'active', 'initialAge', 'actualAge', 'initialFlockCategory', 'actualFlockCategory', 'initialQuantity', 'actualQuantity', 'actualGood', 'actualSterile', 'aquisitionDate', 'aquisitionType', 'edit'];
  public flocks = new MatTableDataSource<FlockDto>;
  private infiniteFlocks: FlockDto[] = [];
  public flockSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public cages: CageDto[] = [];
  public stock = 'assets/flaticon/stock-table-icon.svg';
  public saleReport = 'assets/flaticon/money-icon.svg';
  public cageId: number | string = '';
  public flockCategory: FlockCategory | string = '';
  public flockCategories: string[] = [];
  public acquisitionType: AquisitionType | string = '';
  public acquisitionTypes: string[] = [];
  public active: boolean | string = '';
  public acquisitionDate!: Date | null;
  public today: Date = new Date();
  public flockName: string = '';

  constructor(
    private cageApiService: CageApiService,
    private flockApiService: FlockApiService,
    private translateService: TranslateService,
    private router: Router,
    private utilsService: UtilsService
  ) { }

  ionViewWillEnter(): void {
    this.flockCategories = Object.keys(FlockCategory);
    this.acquisitionTypes = Object.keys(AquisitionType);
    this.getAllActiveCages();
    this.search();
  }

  public searchByFlockName(flockName: any): void {
    this.flockSearchSubscription.unsubscribe();
    this.flocks = new MatTableDataSource<FlockDto>([]);
    this.page = 0;
    this.flockName = flockName;
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public ionChangeCage(event: any): void {
    this.cageId = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeFlockCategory(event: any): void {
    this.flockCategory = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeAcquisitionType(event: any): void {
    this.acquisitionType = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public changeAcquisitionDate(event: any): void {
    this.acquisitionDate = event;
    this.search();
  }

  public toggleActive(event: any): void {
    this.active = event.detail.checked;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public getAllActiveCages() {
    this.cages = [];
    this.cageApiService.getAllActiveCages().subscribe(cages => {
      this.cages = cages;
    })
  }

  public flockForm = new FormGroup({
    cageId: new FormControl('', Validators.compose([
    ]))
  });

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteFlocks = [];
      this.flocks = new MatTableDataSource<FlockDto>([]);
    }
    const flocksSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      cageId: this.cageId,
      actualFlockCategory: this.flockCategory,
      aquisitionType: this.acquisitionType,
      active: this.active,
      name: this.flockName,
      aquisitionDate: this.acquisitionDate ? moment(this.acquisitionDate).startOf('day').format(moment.HTML5_FMT.DATE) : '',
    }
    this.flockSearchSubscription = this.flockApiService.search(flocksSearchCriteriaDto).subscribe(flocks => {
      this.infiniteFlocks = [...this.infiniteFlocks, ...flocks.content];
      this.flocks = new MatTableDataSource<FlockDto>(this.infiniteFlocks);

      if (event) {
        event.target.complete();
      }
    })
  }

  public loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.search(event, true);
    }, 500);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction.toUpperCase();

    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    })
  }

  public routeToStockDetails(flock: FlockDto): void {
    this.router.navigate([`flock/flock-stock-details/${flock.id}`], { queryParams: { name: flock.name } });
  }

  public routeToFlockSaleReport(flock: FlockDto): void {
    this.router.navigate([`/sales-invoice/sales-invoice-by-type-list/FLOCK/${flock.id}`], { queryParams: { name: flock.name } });
  }

  public reset(): void {
    this.acquisitionDate = null;
    this.cageId = '';
    this.flockCategory = '';
    this.acquisitionType = '';
    this.active = '';
    this.flockName = '';
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }
}
