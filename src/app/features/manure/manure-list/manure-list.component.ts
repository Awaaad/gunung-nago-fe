import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ManureDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { ManureStockApiService } from 'src/app/shared/apis/manure-stock.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manure-list',
  templateUrl: './manure-list.component.html',
  styleUrls: ['./manure-list.component.scss'],
})
export class ManureListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public manureEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['weight', 'bags', 'edit'];
  public manures = new MatTableDataSource<ManureDto>;
  private infiniteManures: ManureDto[] = [];
  public manureSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public active: boolean | string = '';
  public isModalOpen: boolean = false;
  public stock = 'assets/flaticon/stock-table-icon.svg';

  public errorMessages = {
    weight: [
      { type: 'required', message: 'Weight is required' },
    ],
  };

  constructor(
    private manureStockApiService: ManureStockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private router: Router
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
      this.infiniteManures = [];
      this.manures = new MatTableDataSource<ManureDto>([]);
    }
    const paymentModeSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.manureStockApiService.search(paymentModeSearchCriteriaDto).subscribe(paymentModes => {
      this.infiniteManures = [...this.infiniteManures, ...paymentModes.content];
      this.manures = new MatTableDataSource<ManureDto>(this.infiniteManures);

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

  public initialisePaymentModeEditForm(manureDetail: ManureDto): void {
    this.manureEditForm = new FormGroup({
      id: new FormControl({ value: manureDetail.id, disabled: false }, Validators.compose([Validators.required])),
      weight: new FormControl({ value: manureDetail.weight, disabled: false }, Validators.compose([Validators.required]))
    })
  }

  public openModal(element: ManureDto): void {
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
    this.manureStockApiService.edit(this.manureEditForm.value).subscribe({
      next: (data: string) => {
        this.manureEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Manure successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public routeToStockDetails(id: number): void {
    this.router.navigate([`manure/manure-stock-details/${id}`]);
  }
}