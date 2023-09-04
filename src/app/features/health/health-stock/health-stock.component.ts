import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { HealthProductDto, HealthProductStockSaveDto, HealthType } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { HealthProductStockApiService } from 'src/app/shared/api/health-product-stock.api.service';
import { HealthProductApiService } from 'src/app/shared/api/health-product.api.service';
import { UtilsService } from 'src/app/shared/util/utils.service';

@Component({
  selector: 'app-health-stock',
  templateUrl: './health-stock.component.html',
  styleUrls: ['./health-stock.component.scss'],
})
export class HealthStockComponent {
  public language = "en";
  public displayedColumns: string[] = ['name', 'description', 'healthType', 'active'];
  public displayedColumnsStock: string[] = ['name', 'healthType', 'quantity', 'price', 'expiryDate', 'remove'];
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

  constructor(
    private healthProductApiService: HealthProductApiService,
    private healthProductStockApiService: HealthProductStockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
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
      healthType: this.healthType
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
    this.utilsService.presentLoading();
    this.healthProductStockApiService.save(this.healthProductsInStockTable.data).subscribe({
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
