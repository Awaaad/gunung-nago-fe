import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { FeedCategory, FeedDto, PurchaseInvoiceType, SupplierDto } from 'generated-src/model';
import { FeedStockApiService } from 'src/app/shared/apis/feed-stock.api.service';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { PurchaseDetailsFrontDto } from 'generated-src/model-front';

@Component({
  selector: 'app-feed-stock',
  templateUrl: './feed-stock.component.html',
  styleUrls: ['./feed-stock.component.scss'],
})
export class FeedStockComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public stockColor = '#4e342e';
  public isModalOpen: boolean = false;
  public confirmInvoiceForm!: FormGroup;
  public language = "en";
  public displayedColumns: string[] = ['name', 'feedCategory', 'recommendedWeight'];
  public displayedColumnsStock: string[] = ['name', 'feedCategory', 'weight', 'bags', 'bonus', 'wholesalePrice', 'price', 'discount', 'expiryDate', 'tax', 'remove'];
  public feeds = new MatTableDataSource<FeedDto>;
  public feedsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>;
  private infiniteFeeds: FeedDto[] = [];
  public feedSearchSubscription!: Subscription;
  public feedsInStock: PurchaseDetailsFrontDto[] = [];
  private page: number = 0;
  private size: number = 20;
  public subTotal = 0;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public feedName: string = '';
  public active: boolean = true;
  public feedCategory: FeedCategory | string = '';
  public showFeedTable: boolean = false;
  public isFeedInStockBox: boolean = false;
  public selectedSupplier: any = "";
  public selectedSuppliers: SupplierDto[] = [];
  public searchSupplierCtrl = new FormControl();
  public filteredSuppliers: any;
  public isLoading = false;
  public errorMsg!: string;
  public minLengthTerm = 1;
  public showFeedSearchBar: boolean = false;
  public today: Date = new Date();
  private searchSupplierSubscription!: Subscription;
  readonly predicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
  readonly maskitoOptions: MaskitoOptions = { mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/] };
  public errorMessages = {
    invoiceNumber: [
      { type: "required", message: "Invoice number is required" },
    ]
  };

  constructor(
    private feedApiService: FeedApiService,
    private feedStockApiService: FeedStockApiService,
    private formBuilder: FormBuilder,
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.searchSupplier();
  }

  ionViewWillEnter(): void {
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchSupplier(): void {
    if (this.searchSupplierSubscription) {
      this.searchSupplierSubscription.unsubscribe();
    }
    this.searchSupplierSubscription = this.searchSupplierCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredSuppliers = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          const name = {
            page: this.page,
            size: this.size,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder.toUpperCase(),
            name: value
          }
          return this.supplierApiService.search(name).pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        })
      )
      .subscribe((data: any) => {
        this.filteredSuppliers = data.content
      });
  }

  public onSupplierSelected(): void {
    this.selectedSupplier = this.selectedSupplier;
    this.showFeedSearchBar = true;
    this.reset();
  }

  public displayWith(value: any): string {
    return value?.name;
  }

  public clearSelection(): void {
    this.selectedSupplier = "";
    this.showFeedSearchBar = false;
    this.filteredSuppliers = [];
    this.reset();
  }

  public searchByFeedName(feedName: any): void {
    if (this.feedSearchSubscription) {
      this.feedSearchSubscription.unsubscribe();
    }
    this.feeds = new MatTableDataSource<FeedDto>;
    this.page = 0;
    this.feedName = feedName;
    this.search();
  }

  public search() {
    if (this.feedName === "") {
      this.showFeedTable = false;
      this.infiniteFeeds = [];
      this.feeds = new MatTableDataSource<FeedDto>([]);
    } else {
      this.showFeedTable = true;
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
      supplierId: this.selectedSupplier.id,
      sale: false
    }

    this.feedSearchSubscription = this.feedApiService.search(feedSearchCriteriaDto).subscribe(feeds => {
      this.infiniteFeeds = [...this.infiniteFeeds, ...feeds.content];
      this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);
    })
  }

  public async addFeedToStock(row: FeedDto): Promise<void> {
    await this.resolveAddFeedToStock(row).then(exist => {
      if (!exist) {
        this.feedApiService.findFeedStockByFeedId(row.id).subscribe(feed => {
          const purchase: PurchaseDetailsFrontDto = {
            purchaseInvoiceType: PurchaseInvoiceType.FEED,
            healthProductId: null,
            feedId: feed.feedId,
            name: feed.name,
            age: null,
            description: null,
            healthType: null,
            weight: feed.weight,
            feedCategory: feed.feedCategory,
            unitsPerBox: null,
            wholesalePrice: feed.wholesalePrice,
            expiryDate: null,
            discount: null,
            tax: null,
            quantity: null,
            bonus: null,
            price: feed.pricePerBag
          }
          this.feedsInStock.push(purchase);
          this.feedsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.feedsInStock);
        })
      }
    });
  }

  public resolveAddFeedToStock(feedRow: FeedDto) {
    this.isFeedInStockBox = false;
    return new Promise((resolve) => {
      resolve(
        this.feedsInStock.find(
          (feed) => feed.feedId === feedRow.id
        )
      );
    });
  }

  public checkIfPresent(id: number) {
    return this.feedsInStock.find((feed) => feed.feedId === id);
  }

  public removeFeedInStock(element: any): void {
    for (let i = 0; i < this.feedsInStock.length; i++) {
      if (this.feedsInStock[i].feedId === element.feedId) {
        this.feedsInStock.splice(i, 1);
      }
    }
    this.feedsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.feedsInStock);
  }

  public save(): void {
    const feedPurchaseDto = {
      invoiceNumber: this.confirmInvoiceForm.value.invoiceNumber,
      supplierId: this.selectedSupplier.id,
      discount: null,
      comment: this.confirmInvoiceForm.value.comment,
      purchaseDetailsDtos: this.feedsInStockTable.data
    }
    this.utilsService.presentLoading();
    this.feedStockApiService.save(feedPurchaseDto).subscribe({
      next: (data: string) => {
        this.subTotal = 0;
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Feed stock updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public reset(): void {
    this.showFeedTable = false;
    this.feedsInStock = [];
    this.feedsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.feedsInStock);
    this.infiniteFeeds = [];
    this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);
  }

  public calculateInvoice() {
    this.subTotal = 0;
    this.feedsInStockTable.data.forEach((product, index) => {
      if (this.feedsInStockTable.data[index].bonus && this.feedsInStockTable.data[index].tax && this.feedsInStockTable.data[index].discount) {
        this.subTotal = this.subTotal + (((this.feedsInStockTable.data[index].quantity - this.feedsInStockTable.data[index].bonus) * (this.feedsInStockTable.data[index].wholesalePrice * ((this.feedsInStockTable.data[index].tax + 100) / 100))) - ((this.feedsInStockTable.data[index].wholesalePrice * ((this.feedsInStockTable.data[index].tax + 100) / 100)) * (this.feedsInStockTable.data[index].discount / 100)));

      } else if (this.feedsInStockTable.data[index].bonus && this.feedsInStockTable.data[index].tax) {
        this.subTotal = this.subTotal + (this.feedsInStockTable.data[index].quantity - this.feedsInStockTable.data[index].bonus) * (this.feedsInStockTable.data[index].wholesalePrice * ((this.feedsInStockTable.data[index].tax + 100) / 100));

      } else if (this.feedsInStockTable.data[index].tax && this.feedsInStockTable.data[index].discount) {
        this.subTotal = this.subTotal + (((this.feedsInStockTable.data[index].quantity) * (this.feedsInStockTable.data[index].wholesalePrice * ((this.feedsInStockTable.data[index].tax + 100) / 100))) - ((this.feedsInStockTable.data[index].wholesalePrice * ((this.feedsInStockTable.data[index].tax + 100) / 100)) * (this.feedsInStockTable.data[index].discount / 100)));

      } else if (this.feedsInStockTable.data[index].bonus && this.feedsInStockTable.data[index].discount) {
        this.subTotal = this.subTotal + (this.feedsInStockTable.data[index].quantity - this.feedsInStockTable.data[index].bonus) * (this.feedsInStockTable.data[index].wholesalePrice * ((100 - this.feedsInStockTable.data[index].discount) / 100));

      } else if (this.feedsInStockTable.data[index].bonus) {
        this.subTotal = this.subTotal + (this.feedsInStockTable.data[index].quantity - this.feedsInStockTable.data[index].bonus) * this.feedsInStockTable.data[index].wholesalePrice;

      } else if (this.feedsInStockTable.data[index].tax) {
        this.subTotal = this.subTotal + (this.feedsInStockTable.data[index].quantity) * (this.feedsInStockTable.data[index].wholesalePrice * ((this.feedsInStockTable.data[index].tax + 100) / 100));

      } else if (this.feedsInStockTable.data[index].discount) {
        this.subTotal = this.subTotal + (this.feedsInStockTable.data[index].quantity) * (this.feedsInStockTable.data[index].wholesalePrice * ((100 - this.feedsInStockTable.data[index].discount) / 100));

      } else {
        this.subTotal = this.subTotal + (this.feedsInStockTable.data[index].quantity) * this.feedsInStockTable.data[index].wholesalePrice;
      }
    });
  }

  private initialiseConfirmPurchaseInvoiceForm(): void {
    this.confirmInvoiceForm = this.formBuilder.group({
      invoiceNumber: new FormControl("", Validators.compose([Validators.required])),
      total: new FormControl({ value: this.subTotal.toFixed(2), disabled: true }, Validators.compose([Validators.required])),
      comment: new FormControl(""),
    });
  }

  public openModal(): void {
    this.initialiseConfirmPurchaseInvoiceForm();
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
      this.save();
    }
  }
}

