import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CageApiService } from '../service/api/cage.api.service';
import { CageCategory, CageDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll } from '@ionic/angular';
import { Sort } from '@angular/material/sort';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-cage-list',
  templateUrl: './cage-list.component.html',
  styleUrls: ['./cage-list.component.scss'],
})
export class CageListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'active', 'cageCategory', 'edit'];
  public cages = new MatTableDataSource<CageDto>;
  private infiniteCages: CageDto[] = [];
  public cageSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public cageCategories: string[] = [];
  public cageForm!: FormGroup;
  constructor(
    private cageApiService: CageApiService,
    private translateService: TranslateService,
    private utilService: UtilsService
  ) {
    this.initialiseFormGroup();
   }

  ionViewWillEnter(): void {
    this.cageCategories = Object.keys(CageCategory);
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public initialiseFormGroup(): void {
    this.cageForm = new FormGroup({
      cageCategory: new FormControl('', Validators.compose([])),
      active: new FormControl(true, Validators.compose([]))
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteCages = [];
      this.cages = new MatTableDataSource<CageDto>([]);
    }
    const cageSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      cageCategory: this.cageForm.value.cageCategory,
      active: this.cageForm.value.active
    }
    this.cages = new MatTableDataSource<CageDto>;
    this.cageApiService.search(cageSearchCriteriaDto).subscribe(cages => {
      this.infiniteCages = [...this.infiniteCages, ...cages.content];
      this.cages = new MatTableDataSource<CageDto>(this.infiniteCages);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.cageForm.reset();
    this.initialiseFormGroup();
    this.search();
  }

  public loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.search(event, true);
    }, 500);
  }

  handleScrollEnd() {

  }

  onScroll(event: any) {
    event.returnValue = false;
  }

  scroll(el: HTMLElement) {
    console.log(el);
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
