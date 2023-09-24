import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CageDto, FlockDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { FlockApiService } from '../../../shared/apis/flock.api.service';

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
  public displayedColumns: string[] = ['cageName', 'active', 'initialAge', 'initialFlockCategory', 'initialQuantity', 'aquisitionDate', 'aquisitionType'];
  public flocks = new MatTableDataSource<FlockDto>;
  private infiniteFlocks: FlockDto[] = [];
  public flockSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';

  constructor(
    private flockApiService: FlockApiService,
    private translateService: TranslateService,
    private router: Router,
    private utilService: UtilsService
  ) { }

  ionViewWillEnter(): void {
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
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
    }
    this.flockApiService.search(flocksSearchCriteriaDto).subscribe(flocks => {
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

    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    })
  }
}
