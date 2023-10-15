import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CageApiService } from '../../../shared/apis/cage.api.service';
import { CageCategory, CageDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { Sort } from '@angular/material/sort';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cage-list',
  templateUrl: './cage-list.component.html',
  styleUrls: ['./cage-list.component.scss'],
})
export class CageListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public cageEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['name', 'cageCategory', 'active', 'edit'];
  public cages = new MatTableDataSource<CageDto>;
  private infiniteCages: CageDto[] = [];
  public cageSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'name';
  public cageCategories: string[] = [];
  public cageCategory: CageCategory | string = '';
  public active: boolean = true;
  public isModalOpen: boolean = false;
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    cageCategory: [
      { type: 'required', message: 'Category is required' },
    ]
  };

  constructor(
    private cageApiService: CageApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
    this.cageCategories = Object.keys(CageCategory);
    this.search();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public ionChangeCageCategory(event: any): void {
    this.cageCategory = event.detail.value;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public toggleActive(event: any): void {
    this.active = event.detail.checked;
    this.utilsService.presentLoadingDuration(500).then(value => {
      this.search();
    });
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteCages = [];
      this.cages = new MatTableDataSource<CageDto>([]);
    }
    const cageSearchCriteriaDto = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
      cageCategory: this.cageCategory,
      active: this.active
    }

    this.cageApiService.search(cageSearchCriteriaDto).subscribe(cages => {
      this.infiniteCages = [...this.infiniteCages, ...cages.content];
      this.cages = new MatTableDataSource<CageDto>(this.infiniteCages);

      if (event) {
        event.target.complete();
        event.returnValue = false;
      }
    })
  }

  public reset(): void {
    this.cageCategory = '';
    this.active = true;
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

  public initialiseCageEditForm(cageDetails: CageDto): void {
    this.cageEditForm = new FormGroup({
      id: new FormControl({ value: cageDetails.id, disabled: false }, Validators.compose([Validators.required])),
      name: new FormControl({ value: cageDetails.name, disabled: false }, Validators.compose([Validators.required])),
      active: new FormControl({ value: cageDetails.active, disabled: false }, Validators.compose([Validators.required])),
      cageCategory: new FormControl({ value: cageDetails.cageCategory, disabled: false }, Validators.compose([Validators.required]))
    })
  }

  public openModal(element: CageDto): void {
    this.initialiseCageEditForm(element);
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
    this.cageApiService.edit(this.cageEditForm.value).subscribe({
      next: (data: string) => {
        this.cageEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Cage successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
