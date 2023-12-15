import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SupplierDto, PurchaseInvoiceDto, PurchaseInvoiceType } from 'generated-src/model';
import { Subscription, debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs';
import { PurchaseInvoiceApiService } from 'src/app/shared/apis/purchase-invoice.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { Router } from '@angular/router';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { SecurityApiService } from 'src/app/shared/apis/security.api.service';

@Component({
  selector: 'app-purchase-invoice-list',
  templateUrl: './purchase-invoice-list.component.html',
  styleUrls: ['./purchase-invoice-list.component.scss'],
})
export class PurchaseInvoiceListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public supplierEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['number', 'supplier', 'createdBy', 'createdDate', 'totalPrice', 'actions'];
  public purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>;
  private infinitePurchaseInvoices: PurchaseInvoiceDto[] = [];
  public purchaseInvoiceSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'desc';
  public sortBy: string = 'createdDate';
  public invoiceNumber: string = '';
  public supplierId!: number | null | undefined | string;
  public dateFrom: Date | any = null;
  public dateTo: Date | any = null;
  public isModalOpen: boolean = false;
  public usernames: string[] = [];
  public username: string = '';
  public purchaseInvoiceTypes: string[] = [];
  public purchaseInvoiceType: PurchaseInvoiceType | string = '';

  public selectedSupplier: any = "";
  public selectedSuppliers: SupplierDto[] = [];
  public searchSupplierCtrl = new FormControl();
  public filteredSuppliers: any;
  public isLoading = false;
  public errorMsg!: string;
  public minLengthTerm = 1;
  private searchSupplierSubscription!: Subscription;
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
  };

  constructor(
    private purchaseInvoiceApiService: PurchaseInvoiceApiService,
    private router: Router,
    private securityApiService: SecurityApiService,
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
    this.purchaseInvoiceTypes = Object.keys(PurchaseInvoiceType);
    this.getAllUsernames();
    this.searchSupplier();
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getAllUsernames(): void {
    this.securityApiService.getAllUsernames().subscribe(usernames => {
      this.usernames = usernames;
    })
  }

  public searchByInvoiceNumber(invoiceNumber: any): void {
    this.purchaseInvoiceSearchSubscription.unsubscribe();
    this.purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>;
    this.page = 0;
    this.invoiceNumber = invoiceNumber;
    this.search();
  }

  public ionChangeUsername(event: any): void {
    this.username = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
  }

  public ionChangeType(event: any): void {
    this.purchaseInvoiceType = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    });
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
    this.search();
  }

  public displayWith(value: any): string {
    return value?.name;
  }

  public clearSelection(): void {
    this.selectedSupplier = null;
    this.filteredSuppliers = [];
    this.reset();
  }

  public routeToPurchaseInvoiceDetails(purchaseInvoiceDto: PurchaseInvoiceDto): void {
    this.router.navigate([`purchase-invoice/purchase-invoice-details/${purchaseInvoiceDto.id}`]);
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infinitePurchaseInvoices = [];
      this.purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>([]);
    }
    const purchaseInvoiceSearchCriteriaDto: any = {
      createdBy: this.username === '' || this.username === null ? null : this.username,
      invoiceNumber: this.invoiceNumber,
      purchaseInvoiceType: this.purchaseInvoiceType,
      dateFrom: this.dateFrom === null ? '' : this.dateFrom,
      dateTo: this.dateTo === null ? '' : this.dateTo,
      supplierId: this.selectedSupplier === null || this.selectedSupplier === undefined || this.selectedSupplier.id === undefined ? '' : this.selectedSupplier.id,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    if (purchaseInvoiceSearchCriteriaDto.createdBy === null) {
      delete purchaseInvoiceSearchCriteriaDto.createdBy;
    }

    this.purchaseInvoiceSearchSubscription = this.purchaseInvoiceApiService.search(purchaseInvoiceSearchCriteriaDto).subscribe(purchaseInvoices => {
      this.infinitePurchaseInvoices = [...this.infinitePurchaseInvoices, ...purchaseInvoices.content];
      this.purchaseInvoices = new MatTableDataSource<PurchaseInvoiceDto>(this.infinitePurchaseInvoices);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedSupplier = null;
    this.purchaseInvoiceType = '';
    this.username = '';
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

    this.utilsService.presentLoadingDuration(500).then(() => {
      this.search();
    })
  }

  public initialiseSupplierEditForm(supplierDetails: SupplierDto): void {
    this.supplierEditForm = new FormGroup({
      id: new FormControl({ value: supplierDetails.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: supplierDetails.name, disabled: false }, Validators.compose([Validators.required])),
      email: new FormControl({ value: supplierDetails.email, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: supplierDetails.address, disabled: false }),
      telephoneNumber: new FormControl({ value: supplierDetails.telephoneNumber, disabled: false }, Validators.compose([Validators.required]))
    })
  }

  public getTotalPrice(): any {
    const total = this.purchaseInvoices.data.map(data => data.totalPrice).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }
}

