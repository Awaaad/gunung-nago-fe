import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FarmDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { FarmApiService } from 'src/app/shared/apis/farm.api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.scss'],
})
export class FarmListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public farmEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'telephoneNumber', 'address', 'edit'];
  public farms = new MatTableDataSource<FarmDto>;
  private infiniteFarms: FarmDto[] = [];
  private editFarmDto!: FarmDto;
  public farmSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public name: string = '';
  public isModalOpen: boolean = false;
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    telephoneNumber: [
      { type: 'required', message: 'Telephone Number is required' },
    ],
    address: [
      { type: 'required', message: 'Address is required' },
    ],
  };

  constructor(
    private farmApiService: FarmApiService,
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

  public searchByName(name: any): void {
    this.farmSearchSubscription.unsubscribe();
    this.farms = new MatTableDataSource<FarmDto>;
    this.page = 0;
    this.name = name;
    this.search();
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteFarms = [];
      this.farms = new MatTableDataSource<FarmDto>([]);
    }
    const farmSearchCriteriaDto = {
      name: this.name,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.farmSearchSubscription = this.farmApiService.search(farmSearchCriteriaDto).subscribe(farms => {
      this.infiniteFarms = [...this.infiniteFarms, ...farms.content];
      this.farms = new MatTableDataSource<FarmDto>(this.infiniteFarms);

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

  public initialiseFarmEditForm(farmDetails: FarmDto): void {
    this.farmEditForm = new FormGroup({
      id: new FormControl({ value: farmDetails.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: farmDetails.name, disabled: false }, Validators.compose([Validators.required])),
      telephoneNumber: new FormControl({ value: farmDetails.telephoneNumber, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: farmDetails.address, disabled: false }, Validators.compose([Validators.required]))
    })
  }

  public openModal(element: FarmDto): void {
    this.initialiseFarmEditForm(element);
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
    this.farmApiService.edit(this.farmEditForm.value).subscribe({
      next: (data: string) => {
        this.farmEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Farm successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.farmEditForm.reset();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg('Farm successfully edited');
          this.search();
        } else {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      }
    });
  }
}
