import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { HealthProductDto, HealthProductStockSaveDto, HealthType, SupplierDto } from 'generated-src/model';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { HealthProductStockApiService } from 'src/app/shared/apis/health-product-stock.api.service';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-health-stock',
  templateUrl: './health-stock.component.html',
  styleUrls: ['./health-stock.component.scss'],
})
export class HealthStockComponent implements OnInit {
  public language = "en";
  public displayedColumns: string[] = ['name', 'description', 'healthType', 'active'];
  public displayedColumnsStock: string[] = ['name', 'healthType', 'boxesReceived', 'price', 'expiryDate', 'remove'];
  public healthProducts = new MatTableDataSource<HealthProductDto>;
  public healthProductsInStockTable = new MatTableDataSource<HealthProductStockSaveDto>;
  private infiniteHealthProducts: HealthProductDto[] = [];
  public healthProductSearchSubscription!: Subscription;
  public healthProductsInStock: HealthProductStockSaveDto[] = [];
  private page: number = 0;
  private size: number = 20;
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

  constructor(
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
    this.searchSupplierCtrl.valueChanges
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
    console.log(this.healthProductsInStock);
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
  }

  public save(): void {
    console.log(this.healthProductsInStockTable.data)
    const healthProductPurchaseDto = {
      invoiceNumber: 12345,
      supplierId: 1,
      discount: null,
      healthProductStockDtos: this.healthProductsInStockTable.data
    }
    this.utilsService.presentLoading();
    this.healthProductStockApiService.save(healthProductPurchaseDto).subscribe({
      next: (data: string) => {
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
}
