import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FeedCategory, FeedDto, SupplierDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
})
export class FeedListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public feedEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'feedCategory', 'recommendedWeight', 'quantity', 'supplier', 'edit'];
  public feeds = new MatTableDataSource<FeedDto>;
  private infiniteFeeds: FeedDto[] = [];
  public feedSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public feedCategories: string[] = [];
  public feedName: string = '';
  public feedCategory: FeedCategory | string = '';
  public suppliers: SupplierDto[] = [];
  public isModalOpen: boolean = false;
  public stock = 'assets/flaticon/stock-table-icon.svg';

  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    category: [
      { type: 'required', message: 'Category is required' },
    ],
    recommendedWeight: [
      { type: 'required', message: 'Recommended weight is required' },
    ],
    supplierId: [
      { type: 'required', message: 'Supplier is required' },
    ]
  };

  constructor(
    private feedApiService: FeedApiService,
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ionViewWillEnter(): void {
    this.feedCategories = Object.keys(FeedCategory);
    this.search();
    this.findAllSuppliers();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchByFeedName(feedName: any): void {
    this.feedSearchSubscription.unsubscribe();
    this.feeds = new MatTableDataSource<FeedDto>;
    this.page = 0;
    this.feedName = feedName;
    this.search();
  }

  public ionChangeFeedCategory(event: any): void {
    this.feedCategory = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteFeeds = [];
      this.feeds = new MatTableDataSource<FeedDto>([]);
    }
    const feedSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      name: this.feedName,
      feedCategory: this.feedCategory,
      sale: false
    }

    this.feedSearchSubscription = this.feedApiService.search(feedSearchCriteriaDto).subscribe(feeds => {
      this.infiniteFeeds = [...this.infiniteFeeds, ...feeds.content];
      this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.feedName = '';
    this.feedCategory = '';
    this.sortOrder = 'asc'.toLocaleUpperCase();
    this.sortBy = 'name';
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

  private findAllSuppliers(): void {
    this.supplierApiService.findAll().subscribe((data: SupplierDto[]) => {
      this.suppliers = data;
    });
  }

  public initialiseFeedEditForm(feedDetails: FeedDto): void {
    this.feedEditForm = new FormGroup({
      id: new FormControl({ value: feedDetails.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: feedDetails.name, disabled: false }, Validators.compose([Validators.required])),
      feedCategory: new FormControl({ value: feedDetails.feedCategory, disabled: false }, Validators.compose([Validators.required])),
      recommendedWeight: new FormControl({ value: feedDetails.recommendedWeight, disabled: false }, Validators.compose([Validators.required])),
      supplierId: new FormControl({ value: feedDetails.supplierId, disabled: false }, Validators.compose([Validators.required])),
    })
  }

  public openModal(element: FeedDto): void {
    this.initialiseFeedEditForm(element);
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
    this.feedApiService.edit(this.feedEditForm.value).subscribe({
      next: (data: string) => {
        this.feedEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Feed successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public routeToStockDetails(feed: FeedDto): void {
    this.router.navigate([`feed/feed-stock-details/${feed.id}`], { queryParams: { name: feed.name, weight: feed.recommendedWeight } });
  }
}