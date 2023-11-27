import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss'],
})
export class BankAccountListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public bankAccountEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['accountHolder', 'accountNumber', 'bankName', 'edit'];
  public bankAccounts = new MatTableDataSource<BankAccountDto>;
  private infiniteBankAccounts: BankAccountDto[] = [];
  public bankAccountSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'accountHolder';
  public active: boolean | string = '';
  public isModalOpen: boolean = false;
  public accountHolder: string = '';
  public errorMessages = {
    accountHolder: [
      { type: 'required', message: 'Account Holder is required' },
    ],
    accountNumber: [
      { type: 'required', message: 'Account Number is required' },
    ],
    bankName: [
      { type: 'required', message: 'Bank Name is required' },
    ]
  };

  constructor(
    private bankAccountApiService: BankAccountApiService,
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

  public searchByAccountHolder(accountHolder: any): void {
    this.bankAccountSearchSubscription.unsubscribe();
    this.bankAccounts = new MatTableDataSource<BankAccountDto>;
    this.page = 0;
    this.accountHolder = accountHolder;
    this.search();
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteBankAccounts = [];
      this.bankAccounts = new MatTableDataSource<BankAccountDto>([]);
    }
    const bankAccountSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      accountHolder: this.accountHolder,
      // active: this.active
    }

    this.bankAccountSearchSubscription = this.bankAccountApiService.search(bankAccountSearchCriteriaDto).subscribe(bankAccounts => {
      this.infiniteBankAccounts = [...this.infiniteBankAccounts, ...bankAccounts.content];
      this.bankAccounts = new MatTableDataSource<BankAccountDto>(this.infiniteBankAccounts);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.accountHolder = '';
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

  public initialiseBankAccountEditForm(bankAccountDetail: BankAccountDto): void {
    this.bankAccountEditForm = new FormGroup({
      id: new FormControl({ value: bankAccountDetail.id, disabled: false }, Validators.compose([Validators.required])),
      accountHolder: new FormControl({ value: bankAccountDetail.accountHolder, disabled: false }, Validators.compose([Validators.required])),
      accountNumber: new FormControl({ value: bankAccountDetail.accountNumber, disabled: false }, Validators.compose([Validators.required])),
      bankName: new FormControl({ value: bankAccountDetail.bankName, disabled: false }, Validators.compose([Validators.required])),
    })
  }

  public openModal(element: BankAccountDto): void {
    this.initialiseBankAccountEditForm(element);
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
    this.bankAccountApiService.edit(this.bankAccountEditForm.value).subscribe({
      next: (data: string) => {
        this.bankAccountEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Bank Account successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
