import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { TranslateService } from '@ngx-translate/core';
import { EggCategoryDto, EggType } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-egg-category-list',
  templateUrl: './egg-category-list.component.html',
  styleUrls: ['./egg-category-list.component.scss'],
})
export class EggCategoryListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public eggCategoryEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'eggType', 'quantity', 'edit'];
  public eggCategories = new MatTableDataSource<EggCategoryDto>;
  private infiniteEggCategories: EggCategoryDto[] = [];
  public eggCategorySearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public active: boolean | string = '';
  public isModalOpen: boolean = false;
  public eggTypes!: string[];
  public stock = 'assets/flaticon/stock-table-icon.svg';
  public saleReport = 'assets/flaticon/money-icon.svg';

  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    type: [
      { type: 'required', message: 'Type is required' },
    ]
  };

  constructor(
    private eggCategoryApiService: EggCategoryApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private router: Router
  ) {
    this.eggTypes = Object.keys(EggType);
  }

  ionViewWillEnter(): void {
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteEggCategories = [];
      this.eggCategories = new MatTableDataSource<EggCategoryDto>([]);
    }
    const eggCategorySearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      // cageCategory: this.cageCategory,
      // active: this.active
    }

    this.eggCategoryApiService.search(eggCategorySearchCriteriaDto).subscribe(eggCategories => {
      this.infiniteEggCategories = [...this.infiniteEggCategories, ...eggCategories.content];
      this.eggCategories = new MatTableDataSource<EggCategoryDto>(this.infiniteEggCategories);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    // this.cageCategory = '';
    this.active = '';
    this.page = 0;
    this.utilsService.presentLoadingDuration(500).then(value => {
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

    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    })
  }

  public initialiseEggCategoryEditForm(eggCategoryDetail: EggCategoryDto): void {
    this.eggCategoryEditForm = new FormGroup({
      id: new FormControl({ value: eggCategoryDetail.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: eggCategoryDetail.name, disabled: false }, Validators.compose([Validators.required])),
      eggType: new FormControl({ value: EggType.GOOD, disabled: false }, Validators.compose([Validators.required]))
    })
  }

  public openModal(element: EggCategoryDto): void {
    this.initialiseEggCategoryEditForm(element);
    this.isModalOpen = true;
  }

  public cancel(): void {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }

  public confirm(): void {
    this.modal.dismiss(null, 'confirm');
  }

  public onWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isModalOpen = false;
    }
    if (ev.detail.role === 'confirm') {
      this.isModalOpen = false;
      this.edit();
    }
  }

  public edit(): void {
    this.utilsService.presentLoading();
    this.eggCategoryApiService.edit(this.eggCategoryEditForm.value).subscribe({
      next: (data: string) => {
        this.eggCategoryEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Egg Category successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public routeToStockDetails(eggCategory: EggCategoryDto): void {
    this.router.navigate([`egg/egg-stock-details/${eggCategory.id}`], { queryParams: { name: eggCategory.name, type: eggCategory.eggType } });
  }

  public routeToEggSaleReport(eggCategory: EggCategoryDto): void {
    this.router.navigate([`/sales-invoice/sales-invoice-by-type-list/EGG/${eggCategory.id}`], { queryParams: { name: eggCategory.name, type: eggCategory.eggType } });
  }
}
