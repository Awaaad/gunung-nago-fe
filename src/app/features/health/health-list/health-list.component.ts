import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HealthProductDto, HealthSurveyStockDto, HealthType, SupplierDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpErrorResponse } from '@angular/common/http';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-health-list',
  templateUrl: './health-list.component.html',
  styleUrls: ['./health-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: "*" })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HealthListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public healthProductEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'description', 'healthType', 'active', 'totalQuantity', 'totalUnits', 'supplier', 'edit'];
  public displayedSubColumns: string[] = ['boxesTotal', 'unitsTotal', 'unitsUsed', 'expiryDate'];
  public healthProducts = new MatTableDataSource<HealthProductDto>;
  private infiniteHealthProducts: HealthProductDto[] = [];
  public healthProductSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public healthTypes: string[] = [];
  public healthProductName: string = '';
  public active: boolean = true;
  public healthType: HealthType | string = '';
  public expandedElement: any | null;
  public healthSurveyStocks: HealthSurveyStockDto[] = [];
  public suppliers: SupplierDto[] = [];
  public isModalOpen: boolean = false;
  public stock = 'assets/flaticon/stock-table-icon.svg';

  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    healthType: [
      { type: 'required', message: 'Health type is required' },
    ],
    unitsPerBox: [
      { type: 'required', message: 'Units per box is required' },
    ],
    supplierId: [
      { type: 'required', message: 'Supplier is required' },
    ]
  };

  constructor(
    private healthProductApiService: HealthProductApiService,
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private router: Router
  ) {
  }

  ionViewWillEnter(): void {
    this.healthTypes = Object.keys(HealthType);
    this.search();
    this.findAllSuppliers();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public searchByHealthProductName(healthProductName: any): void {
    this.healthProductSearchSubscription.unsubscribe();
    this.healthProducts = new MatTableDataSource<HealthProductDto>;
    this.page = 0;
    this.healthProductName = healthProductName;
    this.search();
  }

  public toggleActive(event: any): void {
    this.active = event.detail.checked;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public ionChangeHealthType(event: any): void {
    this.healthType = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
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

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.healthProductName = '';
    this.active = true;
    this.healthType = '';
    this.sortOrder = 'asc'.toLocaleUpperCase();
    this.sortBy = 'name';
    this.utilsService.presentLoadingDuration(500).then(value => {
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

  toggleRow(element: any) {
    // Uncommnet to open only single row at once
    // ELEMENT_DATA.forEach(row => {
    //   row.expanded = false;
    // })
    element.expanded = !element.expanded
    this.healthSurveyStocks = [];
    this.healthProductApiService.findHealthSurveyDtoByHealthProductId(element.id).subscribe(productHealthSurvey => {
      this.healthSurveyStocks = productHealthSurvey.healthSurveyStockDtos;
    })
  }

  private findAllSuppliers(): void {
    this.supplierApiService.findAll().subscribe((data: SupplierDto[]) => {
      this.suppliers = data;
    });
  }

  public initialiseHealthProductEditForm(healthProductDetails: HealthProductDto): void {
    this.healthProductEditForm = new FormGroup({
      id: new FormControl({ value: healthProductDetails.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: healthProductDetails.name, disabled: false }, Validators.compose([Validators.required])),
      active: new FormControl({ value: healthProductDetails.active, disabled: false }, Validators.compose([Validators.required])),
      description: new FormControl({ value: healthProductDetails.description, disabled: false }, Validators.compose([])),
      healthType: new FormControl({ value: healthProductDetails.healthType, disabled: false }, Validators.compose([Validators.required])),
      unitsPerBox: new FormControl({ value: healthProductDetails.unitsPerBox, disabled: false }, Validators.compose([Validators.required])),
      supplierId: new FormControl({ value: healthProductDetails.supplierId, disabled: false }, Validators.compose([Validators.required])),
    })
  }

  public openModal(element: HealthProductDto): void {
    this.initialiseHealthProductEditForm(element);
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
      this.edit();
    }
  }

  public edit(): void {
    this.utilsService.presentLoading();
    this.healthProductApiService.edit(this.healthProductEditForm.value).subscribe({
      next: (data: string) => {
        this.healthProductEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Health Product successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public routeToStockDetails(healthProduct: HealthProductDto): void {
    this.router.navigate([`health/health-stock-details/${healthProduct.id}`], { queryParams: { name: healthProduct.name, type: healthProduct.healthType } });
  }
}

