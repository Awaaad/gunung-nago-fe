import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FarmDto, RoleDto, UserDto } from 'generated-src/model';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { FarmApiService } from 'src/app/shared/apis/farm.api.service';
import { RoleApiService } from 'src/app/shared/apis/role.api.service';
import { UserApiService } from 'src/app/shared/apis/user.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  public userDetailsForm!: FormGroup;
  public initialQuantity: number = 0;
  public initialAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public customerId: number = 0;
  public today: Date = new Date();
  public language = "en";
  public farms: FarmDto[] = [];
  public roles: RoleDto[] = [];
  private userDtos: UserDto[] = [];
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
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.initialiseFormBuilder();
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

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  private initialiseFormBuilder(): void {
    this.userDetailsForm = this.formBuilder.group({
      userDetails: this.formBuilder.array([
        this.addUserDetailsFormGroup()
      ])
    });
  }

  public addUserDetailsFormGroup(): any {
    return this.formBuilder.group({
      username: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      firstName: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      lastName: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      address: new FormControl({ value: null, disabled: false }),
      email: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.email])),
      phone: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      dateOfBirth: new FormControl({ value: null, disabled: false }),
      password: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      roles: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      farms: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addUserDetails(): void {
    (this.userDetailsForm.get('userDetails') as FormArray).push(this.addUserDetailsFormGroup());
  }

  removeUserDetails(userDetailsGroupIndex: number): void {
    (this.userDetailsForm.get('userDetails') as FormArray).removeAt(userDetailsGroupIndex);
  }

  get userDetailsFields() {
    return this.userDetailsForm ? this.userDetailsForm.get('userDetails') as FormArray : null;
  }

  public formatUserDto(): void {
    this.userDtos = [];
    (this.userDetailsForm.get('userDetails') as FormArray).value.forEach((userDetails: any) => {
      const user = {
        id: userDetails.id,
        username: userDetails.username,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        dateOfBirth: userDetails.dateOfBirth,
        address: userDetails.address,
        email: userDetails.email,
        phone: userDetails.phone,
        password: userDetails.password,
        roles: userDetails.roles.map((role: any) => {
          const roleDto: RoleDto = {
            roleId: role,
            role: ""
          };
          return roleDto;
        }),
        farms: userDetails.farms.map((farm: any) => {
          const farmDto: FarmDto = {
            id: farm,
            name: "",
            address: "",
            telephoneNumber: 0
          };
          return farmDto;
        }),
      }
      this.userDtos.push(user);
    });
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.formatUserDto();
    this.userApiService.save(this.userDtos).subscribe({
      next: (data: string) => {
        this.userDetailsForm.reset();
        (this.userDetailsForm.get('userDetails') as FormArray).clear();
        this.addUserDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('User(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.userDetailsForm.reset();
          (this.userDetailsForm.get('userDetails') as FormArray).clear();
          this.addUserDetails();
          this.utilsService.dismissLoading();
          this.utilsService.successMsg('User(s) successfully saved');
        } else {
          this.utilsService.dismissLoading();
          this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
        }
      }
    });
  }
}
