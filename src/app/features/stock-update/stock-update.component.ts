import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IonModal } from '@ionic/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import { TranslateService } from '@ngx-translate/core';
import { FeedCategory, FeedDto, HealthProductDto, HealthType, PurchaseInvoiceType, PurchaseType, SupplierDto } from 'generated-src/model';
import { Subscription, filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { FeedApiService } from 'src/app/shared/apis/feed.api.service';
import { PurchaseDetailsFrontDto } from 'generated-src/model-front';
import { PurchaseApiService } from 'src/app/shared/apis/purchase.api.service';

@Component({
  selector: 'app-stock-update',
  templateUrl: './stock-update.component.html',
  styleUrls: ['./stock-update.component.scss'],
})
export class StockUpdateComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public healthProductColor = '#068C38';
  public feedColor = '#cf9d06';
  public disableColor = '#686868';
  public isModalOpen: boolean = false;
  public language = "en";
  public confirmInvoiceForm!: FormGroup;
  public displayedHealthColumns: string[] = ['name', 'description', 'healthType', 'active'];
  public displayedFeedColumns: string[] = ['name', 'feedCategory', 'recommendedWeight'];
  public displayedColumnsStock: string[] = ['type', 'name', 'healthType', 'feedCategory', 'weight', 'age', 'quantity', 'bonus', 'wholesalePrice', 'price', 'discount', 'expiryDate', 'tax', 'remove'];
  public healthProducts = new MatTableDataSource<HealthProductDto>;
  public productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>;
  private infiniteHealthProducts: HealthProductDto[] = [];
  public healthProductSearchSubscription!: Subscription;
  public productsInStock: PurchaseDetailsFrontDto[] = [];

  public showFeedTable: boolean = false;
  public feeds = new MatTableDataSource<FeedDto>;
  private infiniteFeeds: FeedDto[] = [];
  public feedSearchSubscription!: Subscription;
  public feedName: string = '';
  public feedCategory: FeedCategory | string = '';

  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public subTotal = 0;
  public healthProductName: string = '';
  public active: boolean = true;
  public healthType: HealthType | string = '';
  public showHealthProductTable: boolean = false;
  public isHealthProductInStockBox: boolean = false;
  public isFeedInStockBox: boolean = false;
  public selectedSupplier: any = "";
  public selectedSuppliers: SupplierDto[] = [];
  public searchSupplierCtrl = new FormControl();
  public filteredSuppliers: any;
  public isLoading = false;
  public errorMsg!: string;
  public minLengthTerm = 1;
  public showSearchBar: boolean = false;
  private searchSupplierSubscription!: Subscription;
  public today: Date = new Date();
  readonly predicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
  readonly maskitoOptions: MaskitoOptions = { mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/] };
  public errorMessages = {
    invoiceNumber: [
      { type: "required", message: "Invoice number is required" },
    ]
  };
  public type: PurchaseType = PurchaseType.PURCHASE;
  public purchaseTypes: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private feedApiService: FeedApiService,
    private healthProductApiService: HealthProductApiService,
    private purchaseApiService: PurchaseApiService,
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.searchSupplier();
    this.purchaseTypes = Object.keys(PurchaseType);
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
    if (this.selectedSupplier.internal) {
      this.type = PurchaseType.TRANSFER;
    } else {
      this.type = PurchaseType.PURCHASE;
    }
    this.showSearchBar = true;
    this.reset();
  }

  public displayWith(value: any): string {
    return value?.name;
  }

  public clearSelection(): void {
    this.selectedSupplier = "";
    this.showSearchBar = false;
    this.filteredSuppliers = [];
    this.reset();
  }

  public searchByHealthProductName(healthProductName: any): void {
    if (this.healthProductSearchSubscription) {
      this.healthProductSearchSubscription.unsubscribe();
    }
    this.healthProducts = new MatTableDataSource<HealthProductDto>;
    this.page = 0;
    this.healthProductName = healthProductName;
    this.searchHealthProduct();
  }

  public searchHealthProduct() {
    if (this.healthProductName === "") {
      this.showHealthProductTable = false;
      this.infiniteHealthProducts = [];
      this.healthProducts = new MatTableDataSource<HealthProductDto>([]);
    } else {
      this.showHealthProductTable = true;
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
      healthType: this.healthType,
      supplierId: this.selectedSupplier.id
    }

    this.healthProductSearchSubscription = this.healthProductApiService.search(healthProductSearchCriteriaDto).subscribe(healthProducts => {
      this.infiniteHealthProducts = [...this.infiniteHealthProducts, ...healthProducts.content];
      this.healthProducts = new MatTableDataSource<HealthProductDto>(this.infiniteHealthProducts);
    })
  }

  public searchByFeedName(feedName: any): void {
    if (this.feedSearchSubscription) {
      this.feedSearchSubscription.unsubscribe();
    }
    this.feeds = new MatTableDataSource<FeedDto>;
    this.page = 0;
    this.feedName = feedName;
    this.searchFeed();
  }

  public searchFeed() {
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
      supplierId: this.selectedSupplier.id
    }

    this.feedSearchSubscription = this.feedApiService.search(feedSearchCriteriaDto).subscribe(feeds => {
      this.infiniteFeeds = [...this.infiniteFeeds, ...feeds.content];
      this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);
    })
  }

  public async addHealthProductToStock(row: HealthProductDto): Promise<void> {
    await this.resolveAddProductToStock(row).then(exist => {
      if (!exist) {
        this.healthProductApiService.findHealthProductStockByHealthProductId(row.id).subscribe(healthProduct => {
          const product: PurchaseDetailsFrontDto = {
            purchaseInvoiceType: PurchaseInvoiceType.HEALTH_PRODUCT,

            healthProductId: healthProduct.healthProductId,
            feedId: null,

            name: healthProduct.name,
            age: null,
            description: healthProduct.description,
            healthType: healthProduct.healthType,
            weight: null,
            feedCategory: null,

            unitsPerBox: healthProduct.unitsPerBox,
            wholesalePrice: healthProduct.wholesalePrice,

            expiryDate: healthProduct.expiryDate,
            discount: null,
            tax: null,
            quantity: null,
            bonus: null,
            price: healthProduct.pricePerBox,
          }
          this.productsInStock.push(product);
          this.productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.productsInStock);
        })
      }
    });
  }

  public resolveAddProductToStock(healthProductRow: HealthProductDto) {
    this.isHealthProductInStockBox = false;
    return new Promise((resolve) => {
      resolve(
        this.productsInStock.find(
          (product) => product.purchaseInvoiceType === PurchaseInvoiceType.HEALTH_PRODUCT && product.healthProductId === healthProductRow.id
        )
      );
    });
  }

  public checkIfHealthProductPresent(id: number) {
    return this.productsInStock.find((product) => product.purchaseInvoiceType === PurchaseInvoiceType.HEALTH_PRODUCT && product.healthProductId === id);
  }

  public removeHealthProductInStock(element: any): void {
    for (let i = 0; i < this.productsInStock.length; i++) {
      if (this.productsInStock[i].healthProductId === element.healthProductId) {
        this.productsInStock.splice(i, 1);
      }
    }
    this.productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.productsInStock);
    this.calculateInvoice();
  }

  public addFlockToStock(): void {
    const product: PurchaseDetailsFrontDto = {
      purchaseInvoiceType: PurchaseInvoiceType.FLOCK,

      healthProductId: null,
      feedId: null,

      name: null,
      age: null,
      description: null,
      healthType: null,
      weight: null,
      feedCategory: null,

      unitsPerBox: null,
      wholesalePrice: null,

      expiryDate: null,
      discount: null,
      tax: null,
      quantity: null,
      bonus: null,
      price: null,
    }
    this.productsInStock.push(product);
    this.productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.productsInStock);
  }

  public removeFlockInStock(element: any, index: number): void {
    this.productsInStock.splice(index, 1);
    this.productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.productsInStock);
    this.calculateInvoice();
  }

  public async addFeedToStock(row: FeedDto): Promise<void> {
    await this.resolveAddFeedToStock(row).then(exist => {
      if (!exist) {
        this.feedApiService.findFeedStockByFeedId(row.id).subscribe(feed => {
          const product: PurchaseDetailsFrontDto = {
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
            price: feed.pricePerBag,
          }
          this.productsInStock.push(product);
          this.productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.productsInStock);
        })
      }
    });
  }

  public resolveAddFeedToStock(feedRow: FeedDto) {
    this.isFeedInStockBox = false;
    return new Promise((resolve) => {
      resolve(
        this.productsInStock.find(
          (product) => product.purchaseInvoiceType === PurchaseInvoiceType.FEED && product.feedId === feedRow.id
        )
      );
    });
  }

  public checkIfFeedPresent(id: number) {
    return this.productsInStock.find((product) => product.purchaseInvoiceType === PurchaseInvoiceType.FEED && product.feedId === id);
  }

  public removeFeedInStock(element: any): void {
    for (let i = 0; i < this.productsInStock.length; i++) {
      if (this.productsInStock[i].feedId === element.feedId) {
        this.productsInStock.splice(i, 1);
      }
    }
    this.productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.productsInStock);
  }

  public save(): void {
    const productPurchaseDto = {
      invoiceNumber: this.confirmInvoiceForm.value.invoiceNumber,
      supplierId: this.selectedSupplier.id,
      discount: null,
      comment: this.confirmInvoiceForm.value.comment,
      purchaseDetailsDtos: this.productsInStockTable.data,
      type: this.type
    }
    this.utilsService.presentLoading();
    this.purchaseApiService.save(productPurchaseDto).subscribe({
      next: (data: string) => {
        this.subTotal = 0;
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Product(s) stock updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public reset(): void {
    this.showHealthProductTable = false;
    this.showFeedTable = false;
    this.productsInStock = [];
    this.productsInStockTable = new MatTableDataSource<PurchaseDetailsFrontDto>(this.productsInStock);
    this.infiniteHealthProducts = [];
    this.healthProducts = new MatTableDataSource<HealthProductDto>(this.infiniteHealthProducts);
    this.infiniteFeeds = [];
    this.feeds = new MatTableDataSource<FeedDto>(this.infiniteFeeds);
  }

  public calculateInvoice() {
    this.subTotal = 0;
    this.productsInStockTable.data.forEach((product, index) => {
      if (this.productsInStockTable.data[index].bonus && this.productsInStockTable.data[index].tax && this.productsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (((this.productsInStockTable.data[index].quantity - this.productsInStockTable.data[index].bonus) * (this.productsInStockTable.data[index].wholesalePrice * ((this.productsInStockTable.data[index].tax + 100) / 100))) -
            ((this.productsInStockTable.data[index].wholesalePrice * ((this.productsInStockTable.data[index].tax + 100) / 100)) * (this.productsInStockTable.data[index].discount / 100)));
      } else if (this.productsInStockTable.data[index].bonus && this.productsInStockTable.data[index].tax) {
        this.subTotal = this.subTotal +
          (this.productsInStockTable.data[index].quantity -
            this.productsInStockTable.data[index].bonus) *
          (this.productsInStockTable.data[index].wholesalePrice * ((this.productsInStockTable.data[index].tax + 100) / 100));
      } else if (this.productsInStockTable.data[index].tax && this.productsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (((this.productsInStockTable.data[index].quantity) * (this.productsInStockTable.data[index].wholesalePrice * ((this.productsInStockTable.data[index].tax + 100) / 100))) -
            ((this.productsInStockTable.data[index].wholesalePrice * ((this.productsInStockTable.data[index].tax + 100) / 100)) * (this.productsInStockTable.data[index].discount / 100)));
      } else if (this.productsInStockTable.data[index].bonus && this.productsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (this.productsInStockTable.data[index].quantity - this.productsInStockTable.data[index].bonus) *
          (this.productsInStockTable.data[index].wholesalePrice * ((100 - this.productsInStockTable.data[index].discount) / 100));
      } else if (this.productsInStockTable.data[index].bonus) {
        this.subTotal =
          this.subTotal +
          (this.productsInStockTable.data[index].quantity - this.productsInStockTable.data[index].bonus) *
          this.productsInStockTable.data[index].wholesalePrice;
      } else if (this.productsInStockTable.data[index].tax) {
        this.subTotal =
          this.subTotal +
          (this.productsInStockTable.data[index].quantity) *
          (this.productsInStockTable.data[index].wholesalePrice * ((this.productsInStockTable.data[index].tax + 100) / 100));
      } else if (this.productsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (this.productsInStockTable.data[index].quantity) *
          (this.productsInStockTable.data[index].wholesalePrice * ((100 - this.productsInStockTable.data[index].discount) / 100));
      } else {
        this.subTotal =
          this.subTotal +
          (this.productsInStockTable.data[index].quantity) *
          this.productsInStockTable.data[index].wholesalePrice;
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
