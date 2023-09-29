import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CageDto, CageCategory, CustomerDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { CageApiService } from 'src/app/shared/apis/cage.api.service';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['firstName', 'lastName', 'address', 'telephoneNumber'];
  public customers = new MatTableDataSource<CustomerDto>;
  private infiniteCustomers: CustomerDto[] = [];
  public customerSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public customerName: string = '';

  constructor(
    private customerApiService: CustomerApiService,
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

  public searchByCustomerName(customerName: any): void {
    this.customerSearchSubscription.unsubscribe();
    this.customers = new MatTableDataSource<CustomerDto>;
    this.page = 0;
    this.customerName = customerName;
    this.search();
  }


  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteCustomers = [];
      this.customers = new MatTableDataSource<CustomerDto>([]);
    }
    const customerSearchCriteriaDto = {
      name: this.customerName,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.customerSearchSubscription = this.customerApiService.search(customerSearchCriteriaDto).subscribe(suppliers => {
      this.infiniteCustomers = [...this.infiniteCustomers, ...suppliers.content];
      this.customers = new MatTableDataSource<CustomerDto>(this.infiniteCustomers);

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
