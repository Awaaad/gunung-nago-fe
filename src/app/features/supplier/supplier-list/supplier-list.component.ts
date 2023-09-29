import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SupplierDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'email', 'address', 'telephoneNumber'];
  public suppliers = new MatTableDataSource<SupplierDto>;
  private infiniteSuppliers: SupplierDto[] = [];
  public supplierSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public supplierName: string = '';

  constructor(
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchBySupplierName(supplierName: any): void {
    this.supplierSearchSubscription.unsubscribe();
    this.suppliers = new MatTableDataSource<SupplierDto>;
    this.page = 0;
    this.supplierName = supplierName;
    this.search();
  }


  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteSuppliers = [];
      this.suppliers = new MatTableDataSource<SupplierDto>([]);
    }
    const supplierSearchCriteriaDto = {
      name: this.supplierName,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.supplierSearchSubscription = this.supplierApiService.search(supplierSearchCriteriaDto).subscribe(suppliers => {
      this.infiniteSuppliers = [...this.infiniteSuppliers, ...suppliers.content];
      this.suppliers = new MatTableDataSource<SupplierDto>(this.infiniteSuppliers);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.utilService.presentLoadingDuration(500).then(value => {
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

    this.utilService.presentLoadingDuration(500).then(value => {
      this.search();
    })
  }
}
