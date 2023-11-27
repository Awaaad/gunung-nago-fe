import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountApiService } from 'src/app/shared/apis/bank-account.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-bank-account-details',
  templateUrl: './bank-account-details.component.html',
  styleUrls: ['./bank-account-details.component.scss'],
})
export class BankAccountDetailsComponent implements OnInit {
  public bankAccountDetailsForm!: FormGroup;
  public language = "en";

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
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.initialiseFormBuilder();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public matChangeLanguage(event: any): void {
    this.translateService.use(event.value);
  }

  private initialiseFormBuilder(): void {
    this.bankAccountDetailsForm = this.formBuilder.group({
      bankAccountDetails: this.formBuilder.array([
        this.addBankAccountDetailsFormGroup()
      ])
    });
  }

  public addBankAccountDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      accountHolder: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      accountNumber: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      bankName: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addBankAccountDetails(): void {
    (this.bankAccountDetailsForm.get('bankAccountDetails') as FormArray).push(this.addBankAccountDetailsFormGroup());
  }

  removeBankAccountDetails(bankAccountDetailsGroupIndex: number): void {
    (this.bankAccountDetailsForm.get('bankAccountDetails') as FormArray).removeAt(bankAccountDetailsGroupIndex);
  }

  get bankAccountDetailsFields() {
    return this.bankAccountDetailsForm ? this.bankAccountDetailsForm.get('bankAccountDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.bankAccountApiService.save(this.bankAccountDetailsForm.value.bankAccountDetails).subscribe({
      next: (data: string) => {
        this.bankAccountDetailsForm.reset();
        (this.bankAccountDetailsForm.get('bankAccountDetails') as FormArray).clear();
        this.addBankAccountDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Bank account(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
