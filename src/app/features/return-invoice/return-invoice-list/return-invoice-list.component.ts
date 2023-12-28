import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReturnInvoiceListDto, SalesInvoiceType, UserDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { ReturnApiService } from 'src/app/shared/apis/return.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-return-invoice-list',
  templateUrl: './return-invoice-list.component.html',
  styleUrls: ['./return-invoice-list.component.scss'],
})
export class ReturnInvoiceListComponent implements OnInit {
  public salesInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('salesInvoiceId');
  public language = "en";
  public returnInvoiceList = new MatTableDataSource<ReturnInvoiceListDto>;
  private infiniteReturnInvoices: ReturnInvoiceListDto[] = [];
  public displayedColumns: string[] = ['id', 'name', 'createdBy', 'createdDate', 'totalPrice', 'salesInvoiceId', 'actions'];
  private page: number = 0;
  private size: number = 50;
  public sortOrder: string = 'desc';
  public sortBy: string = 'createdDate';
  public customerName: string = '';
  public returnInvoiceNumber: string = '';
  public salesInvoiceNumber: string = '';
  public dateFrom: Date | any = null;
  public dateTo: Date | any = null;
  public usernames: string[] = [];
  public username: string = '';
  public drivers: UserDto[] = [];
  public selectedDriverId: number | any = '0';
  public returnInvoiceSearchSubscription!: Subscription;
  public showSummary: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private returnApiService: ReturnApiService,
    private router: Router,
    private utilsService: UtilsService,
    private securityApiService: SecurityApiService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter(): void {
    if (this.salesInvoiceId) {
      this.salesInvoiceNumber = this.salesInvoiceId;
    }
    this.search();
    this.getAllUsernames();
    this.getAllDrivers();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteReturnInvoices = [];
      this.returnInvoiceList = new MatTableDataSource<ReturnInvoiceListDto>([]);
    }
    const salesInvoiceSearchCriteriaDto: any = {
      createdBy: this.username === '' || this.username === null ? null : this.username,
      driverId: 3,
      dateFrom: this.dateFrom === null ? '' : this.dateFrom,
      dateTo: this.dateTo === null ? '' : this.dateTo,
      customerName: this.customerName,
      returnInvoiceId: this.returnInvoiceNumber,
      salesInvoiceId: this.salesInvoiceNumber,
      salesInvoiceStatus: '',
      salesInvoiceCategory: '',

      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (salesInvoiceSearchCriteriaDto.createdBy === null) {
      delete salesInvoiceSearchCriteriaDto.createdBy;
    }

    this.returnInvoiceSearchSubscription = this.returnApiService.search(salesInvoiceSearchCriteriaDto).subscribe(returnInvoices => {
      this.infiniteReturnInvoices = [...returnInvoices.content];
      this.returnInvoiceList = new MatTableDataSource<ReturnInvoiceListDto>(this.infiniteReturnInvoices);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.search(event, true);
    }, 500);
  }

  public routeToSalesInvoiceDetails(element: any) {
    this.router.navigate([`sales-invoice/sales-invoice-details/${element.salesInvoiceId}`]);
  }

  public routeToReturnInvoice(element: any) {
    this.router.navigate([`return-invoice/return-invoice-details/${element.id}`]);
  }

  public searchByCustomerName(customerName: any): void {
    this.returnInvoiceSearchSubscription.unsubscribe();
    this.returnInvoiceList = new MatTableDataSource<ReturnInvoiceListDto>;
    this.page = 0;
    this.customerName = customerName;
    this.search();
  }

  public searchBySalesInvoiceNumber(salesInvoiceNumber: any): void {
    this.returnInvoiceSearchSubscription.unsubscribe();
    this.returnInvoiceList = new MatTableDataSource<ReturnInvoiceListDto>;
    this.page = 0;
    this.salesInvoiceNumber = salesInvoiceNumber;
    this.search();
  }

  public searchByReturnInvoiceNumber(returnInvoiceNumber: any): void {
    this.returnInvoiceSearchSubscription.unsubscribe();
    this.returnInvoiceList = new MatTableDataSource<ReturnInvoiceListDto>;
    this.page = 0;
    this.returnInvoiceNumber = returnInvoiceNumber;
    this.search();
  }

  public reset(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedDriverId = '0';
    this.customerName = '';
    this.username = '';
    this.salesInvoiceNumber = '';
    this.returnInvoiceNumber = '';
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeDriver(event: any): void {
    this.selectedDriverId = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearDateFrom(): void {
    this.dateFrom = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectDateFrom(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public clearDateTo(): void {
    this.dateTo = null;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeUsername(event: any): void {
    this.username = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public selectDateTo(): void {
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  private getAllUsernames(): void {
    this.securityApiService.getAllUsernames().subscribe(usernames => {
      this.usernames = usernames;
    })
  }

  private getAllDrivers(): void {
    this.securityApiService.getAllDrivers().subscribe(drivers => {
      this.drivers = drivers;
    })
  }

  public getTotalPrice(): any {
    const total = this.returnInvoiceList.data.map(data => data.totalPrice).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }
}
