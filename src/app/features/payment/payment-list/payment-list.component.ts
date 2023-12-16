import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { TranslateService } from '@ngx-translate/core';
import { PaymentModeDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public paymentModeEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'requireBankAccount', 'edit'];
  public paymentModes = new MatTableDataSource<PaymentModeDto>;
  private infinitePaymentModes: PaymentModeDto[] = [];
  public paymentModeSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public active: boolean | string = '';
  public isModalOpen: boolean = false;
  public errorMessages = {
    name: [
      { type: 'required', message: 'Payment Mode is required' },
    ],
    requireBankAccount: [
      { type: 'required', message: 'Account Number is required' },
    ]
  };

  constructor(
    private paymentModeApiService: PaymentModeApiService,
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

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infinitePaymentModes = [];
      this.paymentModes = new MatTableDataSource<PaymentModeDto>([]);
    }
    const paymentModeSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.paymentModeApiService.search(paymentModeSearchCriteriaDto).subscribe(paymentModes => {
      this.infinitePaymentModes = [...this.infinitePaymentModes, ...paymentModes.content];
      this.paymentModes = new MatTableDataSource<PaymentModeDto>(this.infinitePaymentModes);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.active = '';
    this.page = 0;
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

  public initialisePaymentModeEditForm(paymentModeDetail: PaymentModeDto): void {
    this.paymentModeEditForm = new FormGroup({
      id: new FormControl({ value: paymentModeDetail.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: paymentModeDetail.name, disabled: false }, Validators.compose([Validators.required])),
      requireBankAccount: new FormControl({ value: paymentModeDetail.requireBankAccount, disabled: false }, Validators.compose([Validators.required]))
    })
  }

  public openModal(element: PaymentModeDto): void {
    this.initialisePaymentModeEditForm(element);
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
    this.paymentModeApiService.edit(this.paymentModeEditForm.value).subscribe({
      next: (data: string) => {
        this.paymentModeEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Payment Mode successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
