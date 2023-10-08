import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SupplierDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { SupplierApiService } from 'src/app/shared/apis/supplier.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public supplierEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'email', 'address', 'telephoneNumber', 'edit'];
  public suppliers = new MatTableDataSource<SupplierDto>;
  private infiniteSuppliers: SupplierDto[] = [];
  public supplierSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public supplierName: string = '';
  public isModalOpen: boolean = false;
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
    private supplierApiService: SupplierApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
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

  public initialiseSupplierEditForm(supplierDetails: SupplierDto): void {
    this.supplierEditForm = new FormGroup({
      id: new FormControl({ value: supplierDetails.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: supplierDetails.name, disabled: false }, Validators.compose([Validators.required])),
      email: new FormControl({ value: supplierDetails.email, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: supplierDetails.address, disabled: false }),
      telephoneNumber: new FormControl({ value: supplierDetails.telephoneNumber, disabled: false }, Validators.compose([Validators.required])),
      telephoneNumberTwo: new FormControl({ value: supplierDetails.telephoneNumberTwo, disabled: false }),
      telephoneNumberThree: new FormControl({ value: supplierDetails.telephoneNumberThree, disabled: false }),
    })
  }

  public openModal(element: SupplierDto): void {
    this.initialiseSupplierEditForm(element);
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
    this.supplierApiService.edit(this.supplierEditForm.value).subscribe({
      next: (data: string) => {
        this.supplierEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Supplier successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
