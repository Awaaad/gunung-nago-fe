import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { UserApiService } from 'src/app/shared/apis/user.api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild(IonModal) modal!: IonModal;
  public userEditForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public language = "en";
  public displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'telephoneNumber', 'address', 'dob', 'farms', 'roles', 'edit'];
  public users = new MatTableDataSource<UserDto>;
  private infiniteUsers: UserDto[] = [];
  public userSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'username';
  public userName: string = '';
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
    private userApiService: UserApiService,
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

  public searchByUserName(userName: any): void {
    this.userSearchSubscription.unsubscribe();
    this.users = new MatTableDataSource<UserDto>;
    this.page = 0;
    this.userName = userName;
    this.search();
  }

  public search(event?: any, isLoadevent?: any) {
    if (!isLoadevent) {
      this.page = 0;
      this.infiniteUsers = [];
      this.users = new MatTableDataSource<UserDto>([]);
    }
    const usersearchCriteriaDto = {
      name: this.userName,
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder.toUpperCase(),
    }

    this.userSearchSubscription = this.userApiService.search(usersearchCriteriaDto).subscribe(suppliers => {
      this.infiniteUsers = [...this.infiniteUsers, ...suppliers.content];
      this.users = new MatTableDataSource<UserDto>(this.infiniteUsers);

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

  public initialiseUserEditForm(userDetails: UserDto): void {
    this.userEditForm = new FormGroup({
      id: new FormControl({ value: userDetails.id, disabled: false }, Validators.compose([Validators.required])),
      firstName: new FormControl({ value: userDetails.firstName, disabled: false }, Validators.compose([Validators.required])),
      lastName: new FormControl({ value: userDetails.lastName, disabled: false }, Validators.compose([Validators.required])),
      // address: new FormControl({ value: userDetails.address, disabled: false }),
      // telephoneNumber: new FormControl({ value: userDetails.telephoneNumber, disabled: false }, Validators.compose([Validators.required])),
      // telephoneNumberTwo: new FormControl({ value: userDetails.telephoneNumberTwo, disabled: false }),
      // telephoneNumberThree: new FormControl({ value: userDetails.telephoneNumberThree, disabled: false }),
    })
  }

  public openModal(element: UserDto): void {
    this.initialiseUserEditForm(element);
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
    this.userApiService.edit(this.userEditForm.value).subscribe({
      next: (data: string) => {
        this.userEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('User successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
