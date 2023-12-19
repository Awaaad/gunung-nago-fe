import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserDto, SalesInvoiceType, SalesInvoiceStatus, SalesInvoiceCategory, BankAccountDto, PaymentModeDto, SalesInvoiceLineDto, ManureDto, EggQuantityType, EggCategoryDto, ReturnInvoiceLineDetailsDto, ReturnInvoiceType } from 'generated-src/model';
import { SalesInvoiceSettleCreditPaymentFrontDto } from 'generated-src/model-front';
import { Subscription } from 'rxjs';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { EggCategoryApiService } from 'src/app/shared/apis/egg-category.api.service';

@Component({
  selector: 'app-sales-invoice-by-type-list',
  templateUrl: './sales-invoice-by-type-list.component.html',
  styleUrls: ['./sales-invoice-by-type-list.component.scss'],
})
export class SalesInvoiceByTypeListComponent {
  public type: any = this.activatedRoute.snapshot.paramMap.get('type');
  @ViewChild('picker') picker: any;
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public returnInvoice = 'assets/flaticon/return-invoice-icon-list.svg';
  public language = "en";
  public displayedColumns: string[] = ['id', 'name', 'createdBy', 'createdDate', 'category', 'quantity', 'price', 'totalPrice', 'soldAt', 'return', 'returnTotalPrice', 'balance'];
  public salesInvoices = new MatTableDataSource<SalesInvoiceLineDto>;
  private infiniteSalesInvoices: SalesInvoiceLineDto[] = [];
  public salesInvoiceSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 50;
  public sortOrder: string = 'desc';
  public sortBy: string = 'createdDate';
  public customerName: string = '';
  public feedName: string = '';
  public dateFrom: Date | any = null;
  public dateTo: Date | any = null;
  public usernames: string[] = [];
  public username: string = '';
  public drivers: UserDto[] = [];
  public selectedDriverId: number | any = '0';
  public manureId: number | any = '0';
  public eggCategoryId: number | any = '0';
  public salesInvoiceTypes: string[] = [];
  public salesInvoiceType: SalesInvoiceType | string = '';
  public salesInvoiceStatuses: string[] = [];
  public salesInvoiceStatus: SalesInvoiceStatus | string = '';
  public salesInvoiceCategories: string[] = [];
  public salesInvoiceCategory: SalesInvoiceCategory | string = '';
  public eggQuantityTypes: string[] = [];
  public eggQuantityType: EggQuantityType | string = '';
  public isStatusModalOpen: boolean = false;
  public selectedInvoice!: SalesInvoiceLineDto;
  public selectedStatus!: SalesInvoiceStatus | null;
  public today: Date = new Date();
  public paymentForm!: FormGroup;
  private salesInvoiceSettleCreditPaymentFrontDto!: SalesInvoiceSettleCreditPaymentFrontDto;
  public amountDue!: number;
  public manures: ManureDto[] = [];
  public eggCategories: EggCategoryDto[] = [];

  public bankAccounts: BankAccountDto[] = [];
  public paymentModes: PaymentModeDto[] = [];

  public isToJakarta: boolean | string = '';


  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    email: [
      { type: 'required', message: 'Last Name is required' },
    ],
    telephoneNumber: [
      { type: 'required', message: 'Telephone Number is required' },
    ],
    amountPaid: [
      { type: 'required', message: 'Amount paid is required' },
      { type: 'min', message: 'Amount paid cannot be less than 0' },
      { type: 'max', message: 'Amount paid cannot be more than Sold at' }
    ],
    totalPrice: [
      { type: 'required', message: 'Total price is required' },
    ],
    soldAt: [
      { type: 'required', message: 'Sold at is required' },
      { type: 'min', message: 'Sold at cannot be less than 0' },
      { type: 'max', message: 'Sold at cannot be more than Total Price' },
    ],
    paymentModeId: [
      { type: 'required', message: 'Payment mode is required' },
    ],
    minValue: [
      { type: 'min', message: 'Value cannot be less than 0' }
    ],
    maxValue: [
      { type: 'max', message: 'Value cannot be greater than quantity in stock' }
    ],
    bankAccountId: [
      { type: 'required', message: 'Bank account is required' },
    ]
  };

  constructor(
    private salesInvoiceApiService: SalesInvoiceApiService,
    private router: Router,
    private securityApiService: SecurityApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private bankAccountApiService: BankAccountApiService,
    private paymentModeApiService: PaymentModeApiService,
    private readonly activatedRoute: ActivatedRoute,
    private manureStockApiService: ManureStockApiService,
    private eggCategoryApiService: EggCategoryApiService
  ) {
  }

  ionViewWillEnter(): void {
    this.isStatusModalOpen = false;
    this.salesInvoiceTypes = Object.keys(SalesInvoiceType);
    this.salesInvoiceStatuses = Object.keys(SalesInvoiceStatus);
    this.salesInvoiceCategories = Object.keys(SalesInvoiceCategory);
    this.eggQuantityTypes = Object.keys(EggQuantityType);
    this.getAllPaymentModes();
    this.getAllBankAccounts();
    this.getAllUsernames();
    this.getAllDrivers();
    if (this.type) {
      this.salesInvoiceType = this.type;
      if (this.type === SalesInvoiceType.MANURE) {
        this.getManures();
      }
      if (this.type === SalesInvoiceType.EGG) {
        this.getEggCategories();
      }
    }
    this.search();
  }

  public getAllPaymentModes() {
    this.paymentModeApiService.findAll().subscribe(paymentModes => {
      this.paymentModes = paymentModes;
    })
  }

  public getAllBankAccounts() {
    this.bankAccountApiService.findAll().subscribe(bankAccounts => {
      this.bankAccounts = bankAccounts;
    })
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getAllUsernames(): void {
    this.securityApiService.getAllUsernames().subscribe(usernames => {
      this.usernames = usernames;
    })
  }

  private getManures(): void {
    this.manureStockApiService.findManures().subscribe(manures => {
      this.manures = manures;
    })
  }

  private getEggCategories(): void {
    this.eggCategoryApiService.findAll().subscribe(eggCategories => {
      this.eggCategories = eggCategories;
    })
  }

  private getAllDrivers(): void {
    this.securityApiService.getAllDrivers().subscribe(drivers => {
      this.drivers = drivers;
    })
  }

  public searchByCustomerName(customerName: any): void {
    this.salesInvoiceSearchSubscription.unsubscribe();
    this.salesInvoices = new MatTableDataSource<SalesInvoiceLineDto>;
    this.page = 0;
    this.customerName = customerName;
    this.search();
  }

  public searchByFeedName(feedName: any): void {
    this.salesInvoiceSearchSubscription.unsubscribe();
    this.salesInvoices = new MatTableDataSource<SalesInvoiceLineDto>;
    this.page = 0;
    this.feedName = feedName;
    this.search();
  }

  public ionChangeType(event: any): void {
    this.salesInvoiceType = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
    if (event.detail.value === SalesInvoiceType.MANURE) {
      this.getManures();
    }
    if (event.detail.value === SalesInvoiceType.EGG) {
      this.getEggCategories();
    }
  }

  public ionChangeManure(event: any): void {
    this.manureId = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeEggCategory(event: any): void {
    this.eggCategoryId = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeEggQuantityType(event: any): void {
    this.eggQuantityType = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeStatus(event: any): void {
    this.salesInvoiceStatus = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeCategory(event: any): void {
    this.salesInvoiceCategory = event.detail.value;
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

  public ionChangeDriver(event: any): void {
    this.selectedDriverId = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public toggleToJakarta(event: any): void {
    this.isToJakarta = event.detail.checked;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public routeToSalesInvoiceDetails(salesInvoiceLineDto: SalesInvoiceLineDto): void {
    this.router.navigate([`sales-invoice/sales-invoice-details/${salesInvoiceLineDto.salesInvoiceId}`]);
  }

  public routeToPointOfSalesEdit(salesInvoiceLineDto: SalesInvoiceLineDto): void {
    this.router.navigate([`point-of-sale/sales-invoice-id/${salesInvoiceLineDto.salesInvoiceId}`]);
  }

  public routeToReturnInvoice(salesInvoiceLineDto: SalesInvoiceLineDto): void {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate([`return-invoice/${salesInvoiceLineDto.salesInvoiceId}`]);
  }

  public routeToReturnInvoiceList(salesInvoiceLineDto: SalesInvoiceLineDto): void {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate([`return-invoice/return-invoice-list/${salesInvoiceLineDto.salesInvoiceId}`]);
  }

  public selectDateFrom(): void {
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

  public selectDateTo(): void {
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

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteSalesInvoices = [];
      this.salesInvoices = new MatTableDataSource<SalesInvoiceLineDto>([]);
    }
    const salesInvoiceSearchCriteriaDto: any = {
      salesInvoiceType: this.salesInvoiceType === '' || this.salesInvoiceType === null ? null : this.salesInvoiceType,
      createdBy: this.username === '' || this.username === null ? null : this.username,
      driverId: this.selectedDriverId === '0' || this.selectedDriverId === null ? '' : this.selectedDriverId,
      dateFrom: this.dateFrom === null ? '' : this.dateFrom,
      dateTo: this.dateTo === null ? '' : this.dateTo,
      customerName: this.customerName,
      feedName: this.feedName,
      salesInvoiceStatus: this.salesInvoiceStatus,
      salesInvoiceCategory: this.salesInvoiceCategory,
      eggQuantityType: this.eggQuantityType,
      manureId: this.manureId === '0' || this.manureId === null ? '' : this.manureId,
      eggCategoryId: this.eggCategoryId === '0' || this.eggCategoryId === null ? '' : this.eggCategoryId,
      isToJakarta: this.isToJakarta,

      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (salesInvoiceSearchCriteriaDto.createdBy === null) {
      delete salesInvoiceSearchCriteriaDto.createdBy;
    }
    if (salesInvoiceSearchCriteriaDto.salesInvoiceType === null) {
      delete salesInvoiceSearchCriteriaDto.salesInvoiceType;
    }
    if (!salesInvoiceSearchCriteriaDto.isToJakarta) {
      delete salesInvoiceSearchCriteriaDto.isToJakarta;
    }

    this.salesInvoiceSearchSubscription = this.salesInvoiceApiService.searchForType(salesInvoiceSearchCriteriaDto).subscribe(salesInvoices => {
      this.infiniteSalesInvoices = [...this.infiniteSalesInvoices, ...salesInvoices.content];
      this.salesInvoices = new MatTableDataSource<SalesInvoiceLineDto>(this.infiniteSalesInvoices);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.selectedStatus = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedDriverId = '0';
    this.manureId = '0';
    this.customerName = '';
    this.salesInvoiceType = '';
    this.salesInvoiceStatus = '';
    this.salesInvoiceCategory = '';
    this.eggQuantityType = '';
    this.eggCategoryId = '0';
    this.feedName = '';
    this.username = '';
    this.amountDue = 0;
    this.utilsService.presentLoadingDuration(500).then(() => {
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

  public getTotalPrice(): any {
    const total = this.salesInvoices.data.map(data => data.price).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalTotalPrice(): any {
    const total = this.salesInvoices.data.map(data => data.totalPrice).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  private removeDuplicates(salesInvoiceLineDtos: SalesInvoiceLineDto[]) {
    const seen = new Set();
    return salesInvoiceLineDtos.filter(obj => {
      const value = obj.salesInvoiceId;
      if (!seen.has(value)) {
        seen.add(value);
        return true;
      }
      return false;
    });
  }

  public getTotalSoldAt(): any {
    const filteredSalesInvoiceDtos = this.removeDuplicates(this.salesInvoices.data);
    const total = filteredSalesInvoiceDtos.map(data => data.invoiceSoldAt).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalQuantityManure(): any {
    const total = this.salesInvoices.data.filter(data => data.salesInvoiceType === SalesInvoiceType.MANURE).map(data => data.quantity).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalQuantityFlock(): any {
    const total = this.salesInvoices.data.filter(data => data.salesInvoiceType === SalesInvoiceType.FLOCK).map(data => data.quantity).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalQuantityFeed(): any {
    const total = this.salesInvoices.data.filter(data => data.salesInvoiceType === SalesInvoiceType.FEED).map(data => data.quantity).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalQuantityEggTie(): any {
    const total = this.salesInvoices.data.filter(data => data.salesInvoiceType === SalesInvoiceType.EGG && data.eggQuantityType === EggQuantityType.TIE).map(data => data.quantity).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalQuantityEggTray(): any {
    const total = this.salesInvoices.data.filter(data => data.salesInvoiceType === SalesInvoiceType.EGG && data.eggQuantityType === EggQuantityType.TRAY).map(data => data.quantity).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalQuantityEggPiece(): any {
    const total = this.salesInvoices.data.filter(data => data.salesInvoiceType === SalesInvoiceType.EGG && data.eggQuantityType === EggQuantityType.PIECE).map(data => data.quantity).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalPriceForReturn(returns: ReturnInvoiceLineDetailsDto[]): number {
    let sum = 0;
    returns.forEach(returnInvoice => {
      sum = sum + returnInvoice.totalPrice;
    })
    return sum;
  }

  public getBalance(soldAt: number, returns: ReturnInvoiceLineDetailsDto[]): number {
    let sum = 0;
    returns.forEach(returnInvoice => {
      sum = sum + returnInvoice.totalPrice;
    })
    return soldAt - sum;
  }

  public getTableTotalPriceForReturn(): any {
    const total = this.salesInvoices.data.filter(data => data.returnInvoiceLineDetailsDtos && data.returnInvoiceLineDetailsDtos.length > 0)
      .map(data => data.returnInvoiceLineDetailsDtos)
      .map(data => {
        let sum = 0;
        data.forEach(returnInvoice => {
          sum = sum + returnInvoice.totalPrice;
        })
        return sum;
      })
      .reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalReturnQuantityEggPiece(): any {
    const total = this.salesInvoices.data.filter(data => data.returnInvoiceLineDetailsDtos && data.returnInvoiceLineDetailsDtos.length > 0)
      .map(data => data.returnInvoiceLineDetailsDtos)
      .map(data => {
        let sum = 0;
        data.filter(data => data.returnInvoiceType === ReturnInvoiceType.EGG).forEach(returnInvoice => {
          sum = sum + returnInvoice.quantity;
        })
        return sum;
      })
      .reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalReturnQuantityFlock(): any {
    const total = this.salesInvoices.data.filter(data => data.returnInvoiceLineDetailsDtos && data.returnInvoiceLineDetailsDtos.length > 0)
      .map(data => data.returnInvoiceLineDetailsDtos)
      .map(data => {
        let sum = 0;
        data.filter(data => data.returnInvoiceType === ReturnInvoiceType.FLOCK).forEach(returnInvoice => {
          sum = sum + returnInvoice.quantity;
        })
        return sum;
      })
      .reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalReturnQuantityManure(): any {
    const total = this.salesInvoices.data.filter(data => data.returnInvoiceLineDetailsDtos && data.returnInvoiceLineDetailsDtos.length > 0)
      .map(data => data.returnInvoiceLineDetailsDtos)
      .map(data => {
        let sum = 0;
        data.filter(data => data.returnInvoiceType === ReturnInvoiceType.MANURE).forEach(returnInvoice => {
          sum = sum + returnInvoice.quantity;
        })
        return sum;
      })
      .reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalReturnQuantityFeed(): any {
    const total = this.salesInvoices.data.filter(data => data.returnInvoiceLineDetailsDtos && data.returnInvoiceLineDetailsDtos.length > 0)
      .map(data => data.returnInvoiceLineDetailsDtos)
      .map(data => {
        let sum = 0;
        data.filter(data => data.returnInvoiceType === ReturnInvoiceType.FEED).forEach(returnInvoice => {
          sum = sum + returnInvoice.quantity;
        })
        return sum;
      })
      .reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTableTotalBalance(): any {
    return this.getTotalSoldAt() - this.getTableTotalPriceForReturn();
  }
}

