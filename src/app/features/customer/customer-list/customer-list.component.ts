import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CustomerDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public customerEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['firstName', 'lastName', 'address', 'telephoneNumber', 'edit'];
  public customers = new MatTableDataSource<CustomerDto>;
  private infiniteCustomers: CustomerDto[] = [];
  public customerSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public customerName: string = '';
  public isModalOpen: boolean = false;
  public errorMessages = {
    firstName: [
      { type: 'required', message: 'First Name is required' },
    ],
    lastName: [
      { type: 'required', message: 'Last Name is required' },
    ],
    telephoneNumber: [
      { type: 'required', message: 'Telephone Number is required' },
    ],
  };

  constructor(
    private customerApiService: CustomerApiService,
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

  public initialiseCustomerEditForm(customerDetails: CustomerDto): void {
    this.customerEditForm = new FormGroup({
      id: new FormControl({ value: customerDetails.id, disabled: false }, Validators.compose([Validators.required])),
      firstName: new FormControl({ value: customerDetails.firstName, disabled: false }, Validators.compose([Validators.required])),
      lastName: new FormControl({ value: customerDetails.lastName, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: customerDetails.address, disabled: false }),
      telephoneNumber: new FormControl({ value: customerDetails.telephoneNumber, disabled: false }, Validators.compose([Validators.required])),
      telephoneNumberTwo: new FormControl({ value: customerDetails.telephoneNumberTwo, disabled: false }),
      telephoneNumberThree: new FormControl({ value: customerDetails.telephoneNumberThree, disabled: false }),
    })
  }

  public openModal(element: CustomerDto): void {
    this.initialiseCustomerEditForm(element);
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
    this.customerApiService.edit(this.customerEditForm.value).subscribe({
      next: (data: string) => {
        this.customerEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Customer successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
