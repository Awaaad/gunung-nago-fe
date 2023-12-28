import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonInfiniteScroll, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FarmDto, RoleDto, UserDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { UserApiService } from 'src/app/shared/apis/user.api.service';
import { RoleApiService } from 'src/app/shared/apis/role.api.service';
import { FarmApiService } from 'src/app/shared/apis/farm.api.service';

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
  private editUserDto!: UserDto;
  public userSearchSubscription!: Subscription;
  private page: number = 0;
  private size: number = 20;
  public sortOrder: string = 'asc';
  public sortBy: string = 'username';
  public userName: string = '';
  public isModalOpen: boolean = false;
  public farms: FarmDto[] = [];
  public roles: RoleDto[] = [];
  public errorMessages = {
    firstName: [
      { type: 'required', message: 'First Name is required' },
    ],
    username: [
      { type: 'required', message: 'Username is required' },
    ],
    email: [
      { type: 'email', message: 'Email is invalid' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
    ],
    lastName: [
      { type: 'required', message: 'Last Name is required' },
    ],
    phone: [
      { type: 'required', message: 'Telephone Number is required' },
    ],
    role: [
      { type: 'required', message: 'Role is required' },
    ],
    farm: [
      { type: 'required', message: 'Farm is required' },
    ],
  };

  constructor(
    private userApiService: UserApiService,
    private roleApiService: RoleApiService,
    private farmApiService: FarmApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ionViewWillEnter(): void {
    this.search();
    this.getAllFarms();
    this.getAllRoles();
  }

  private getAllFarms(): void {
    this.farmApiService.findAll().subscribe(farms => {
      this.farms = farms;
    })
  }

  private getAllRoles(): void {
    this.roleApiService.findAll().subscribe(roles => {
      this.roles = roles;
    })
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
      username: new FormControl({ value: userDetails.username, disabled: false }, Validators.compose([Validators.required])),
      firstName: new FormControl({ value: userDetails.firstName, disabled: false }, Validators.compose([Validators.required])),
      lastName: new FormControl({ value: userDetails.lastName, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: userDetails.address, disabled: false }),
      email: new FormControl({ value: userDetails.email, disabled: false }, Validators.compose([Validators.email])),
      phone: new FormControl({ value: userDetails.phone, disabled: false }, Validators.compose([Validators.required])),
      dateOfBirth: new FormControl({ value: userDetails.dateOfBirth, disabled: false }),
      password: new FormControl({ value: userDetails.password, disabled: false }, Validators.compose([Validators.required])),
      roles: new FormControl({ value: userDetails.roles.map(role => role.roleId), disabled: false }, Validators.compose([Validators.required])),
      farms: new FormControl({ value: userDetails.farms.map(farm => farm.id), disabled: false }, Validators.compose([Validators.required])),
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

  public formatEditUserDto(): void {
    this.editUserDto = {
      id: this.userEditForm.get("id")?.value,
      username: this.userEditForm.get("username")?.value,
      firstName: this.userEditForm.get("firstName")?.value,
      lastName: this.userEditForm.get("lastName")?.value,
      dateOfBirth: this.userEditForm.get("dateOfBirth")?.value,
      address: this.userEditForm.get("address")?.value,
      email: this.userEditForm.get("email")?.value,
      phone: this.userEditForm.get("phone")?.value,
      password: this.userEditForm.get("password")?.value,
      roles: this.userEditForm.get("roles")?.value.map((role: any) => {
        const roleDto: RoleDto = {
          roleId: role,
          role: ""
        };
        return roleDto;
      }),
      farms: this.userEditForm.get("farms")?.value.map((farm: any) => {
        const farmDto: FarmDto = {
          id: farm,
          name: "",
          address: "",
          telephoneNumber: 0
        };
        return farmDto;
      }),
    }
  }

  public edit(): void {
    this.formatEditUserDto();
    this.utilsService.presentLoading();
    this.userApiService.edit(this.editUserDto).subscribe({
      next: (data: string) => {
        this.userEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('User successfully edited');
        this.search();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.userEditForm.reset();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg('User successfully edited');
          this.search();
        } else {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      }
    });
  }
}
