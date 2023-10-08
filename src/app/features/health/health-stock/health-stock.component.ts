import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IonModal } from '@ionic/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import { TranslateService } from '@ngx-translate/core';
import { HealthProductDto, HealthProductStockSaveDto, HealthType, SupplierDto } from 'generated-src/model';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { HealthProductStockApiService } from 'src/app/shared/apis/health-product-stock.api.service';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-health-stock',
  templateUrl: './health-stock.component.html',
  styleUrls: ['./health-stock.component.scss'],
})
export class HealthStockComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public isModalOpen: boolean = false;
  public language = "en";
  public confirmInvoiceForm!: FormGroup;
  public displayedColumns: string[] = ['name', 'description', 'healthType', 'active'];
  public displayedColumnsStock: string[] = ['name', 'healthType', 'boxesReceived', 'bonus', 'wholesalePrice', 'price', 'discount', 'expiryDate', 'tax', 'remove'];
  public healthProducts = new MatTableDataSource<HealthProductDto>;
  public healthProductsInStockTable = new MatTableDataSource<HealthProductStockSaveDto>;
  private infiniteHealthProducts: HealthProductDto[] = [];
  public healthProductSearchSubscription!: Subscription;
  public healthProductsInStock: HealthProductStockSaveDto[] = [];
  private page: number = 0;
  private size: number = 20;
  public subTotal = 0;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public healthProductName: string = '';
  public active: boolean = true;
  public healthType: HealthType | string = '';
  public showHealthProductTable: boolean = false;
  public isHealthProductInStockBox: boolean = false;
  public selectedSupplier: any = "";
  public selectedSuppliers: SupplierDto[] = [];
  public searchSupplierCtrl = new FormControl();
  public filteredSuppliers: any;
  public isLoading = false;
  public errorMsg!: string;
  public minLengthTerm = 1;
  public showHealthSearchBar: boolean = false;
  private searchSupplierSubscription!: Subscription;
  public today: Date = new Date();
  readonly predicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
  readonly maskitoOptions: MaskitoOptions = { mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/] };
  public errorMessages = {
    invoiceNumber: [
      { type: "required", message: "Invoice number is required" },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private healthProductApiService: HealthProductApiService,
    private healthProductStockApiService: HealthProductStockApiService,
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
    this.showHealthSearchBar = true;
    this.reset();
  }

  public displayWith(value: any): string {
    return value?.name;
  }

  public clearSelection(): void {
    this.selectedSupplier = "";
    this.showHealthSearchBar = false;
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
    this.search();
  }

  public search() {
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

  public async addHealthProductToStock(row: HealthProductDto): Promise<void> {
    await this.resolveAddProductToStock(row).then(exist => {
      if (!exist) {
        this.healthProductApiService.findHealthProductStockByHealthProductId(row.id).subscribe(healthProduct => {
          this.healthProductsInStock.push(healthProduct);
          this.healthProductsInStockTable = new MatTableDataSource<HealthProductStockSaveDto>(this.healthProductsInStock);
        })
      }
    });
  }

  public resolveAddProductToStock(healthProductRow: HealthProductDto) {
    this.isHealthProductInStockBox = false;
    return new Promise((resolve) => {
      resolve(
        this.healthProductsInStock.find(
          (healthProduct) => healthProduct.healthProductId === healthProductRow.id
        )
      );
    });
  }

  public checkIfPresent(id: number) {
    return this.healthProductsInStock.find((healthProduct) => healthProduct.healthProductId === id);
  }

  public removeHealthProductInStock(element: any): void {
    for (let i = 0; i < this.healthProductsInStock.length; i++) {
      if (this.healthProductsInStock[i].healthProductId === element.healthProductId) {
        this.healthProductsInStock.splice(i, 1);
      }
    }
    this.healthProductsInStockTable = new MatTableDataSource<HealthProductStockSaveDto>(this.healthProductsInStock);
    this.calculateInvoice();
  }

  public save(): void {
    const healthProductPurchaseDto = {
      invoiceNumber: this.confirmInvoiceForm.value.invoiceNumber,
      supplierId: this.selectedSupplier.id,
      discount: null,
      comment: this.confirmInvoiceForm.value.comment,
      healthProductStockDtos: this.healthProductsInStockTable.data
    }
    this.utilsService.presentLoading();
    this.healthProductStockApiService.save(healthProductPurchaseDto).subscribe({
      next: (data: string) => {
        this.subTotal = 0;
        this.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Health product(s) stock updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public reset(): void {
    this.showHealthProductTable = false;
    this.healthProductsInStock = [];
    this.healthProductsInStockTable = new MatTableDataSource<HealthProductStockSaveDto>(this.healthProductsInStock);
    this.infiniteHealthProducts = [];
    this.healthProducts = new MatTableDataSource<HealthProductDto>(this.infiniteHealthProducts);
  }

  public calculateInvoice() {
    this.subTotal = 0;
    this.healthProductsInStockTable.data.forEach((product, index) => {
      if (this.healthProductsInStockTable.data[index].bonusBoxesReceived && this.healthProductsInStockTable.data[index].tax && this.healthProductsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (((this.healthProductsInStockTable.data[index].boxesReceived - this.healthProductsInStockTable.data[index].bonusBoxesReceived) * (this.healthProductsInStockTable.data[index].wholesalePrice * ((this.healthProductsInStockTable.data[index].tax + 100) / 100))) -
            ((this.healthProductsInStockTable.data[index].wholesalePrice * ((this.healthProductsInStockTable.data[index].tax + 100) / 100)) * (this.healthProductsInStockTable.data[index].discount / 100)));
      } else if (this.healthProductsInStockTable.data[index].bonusBoxesReceived && this.healthProductsInStockTable.data[index].tax) {
        this.subTotal = this.subTotal +
          (this.healthProductsInStockTable.data[index].boxesReceived -
            this.healthProductsInStockTable.data[index].bonusBoxesReceived) *
          (this.healthProductsInStockTable.data[index].wholesalePrice * ((this.healthProductsInStockTable.data[index].tax + 100) / 100));
      } else if (this.healthProductsInStockTable.data[index].tax && this.healthProductsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (((this.healthProductsInStockTable.data[index].boxesReceived) * (this.healthProductsInStockTable.data[index].wholesalePrice * ((this.healthProductsInStockTable.data[index].tax + 100) / 100))) -
            ((this.healthProductsInStockTable.data[index].wholesalePrice * ((this.healthProductsInStockTable.data[index].tax + 100) / 100)) * (this.healthProductsInStockTable.data[index].discount / 100)));
      } else if (this.healthProductsInStockTable.data[index].bonusBoxesReceived && this.healthProductsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (this.healthProductsInStockTable.data[index].boxesReceived - this.healthProductsInStockTable.data[index].bonusBoxesReceived) *
          (this.healthProductsInStockTable.data[index].wholesalePrice * ((100 - this.healthProductsInStockTable.data[index].discount) / 100));
      } else if (this.healthProductsInStockTable.data[index].bonusBoxesReceived) {
        this.subTotal =
          this.subTotal +
          (this.healthProductsInStockTable.data[index].boxesReceived - this.healthProductsInStockTable.data[index].bonusBoxesReceived) *
          this.healthProductsInStockTable.data[index].wholesalePrice;
      } else if (this.healthProductsInStockTable.data[index].tax) {
        this.subTotal =
          this.subTotal +
          (this.healthProductsInStockTable.data[index].boxesReceived) *
          (this.healthProductsInStockTable.data[index].wholesalePrice * ((this.healthProductsInStockTable.data[index].tax + 100) / 100));
      } else if (this.healthProductsInStockTable.data[index].discount) {
        this.subTotal =
          this.subTotal +
          (this.healthProductsInStockTable.data[index].boxesReceived) *
          (this.healthProductsInStockTable.data[index].wholesalePrice * ((100 - this.healthProductsInStockTable.data[index].discount) / 100));
      } else {
        this.subTotal =
          this.subTotal +
          (this.healthProductsInStockTable.data[index].boxesReceived) *
          this.healthProductsInStockTable.data[index].wholesalePrice;
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
