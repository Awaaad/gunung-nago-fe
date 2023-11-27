import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PaymentModeApiService } from 'src/app/shared/apis/payment-mode.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnInit {
  public paymentModeDetailsForm!: FormGroup;
  public language = "en";

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
    this.paymentModeDetailsForm = this.formBuilder.group({
      paymentModeDetails: this.formBuilder.array([
        this.addPaymentModeDetailsFormGroup()
      ])
    });
  }

  public addPaymentModeDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      requireBankAccount: new FormControl({ value: true, disabled: false }, Validators.compose([Validators.required]))
    });
  }

  addPaymentModeDetails(): void {
    (this.paymentModeDetailsForm.get('paymentModeDetails') as FormArray).push(this.addPaymentModeDetailsFormGroup());
  }

  removePaymentModeDetails(paymentModeDetailsGroupIndex: number): void {
    (this.paymentModeDetailsForm.get('paymentModeDetails') as FormArray).removeAt(paymentModeDetailsGroupIndex);
  }

  get paymentModeDetailsFields() {
    return this.paymentModeDetailsForm ? this.paymentModeDetailsForm.get('paymentModeDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.paymentModeApiService.save(this.paymentModeDetailsForm.value.paymentModeDetails).subscribe({
      next: (data: string) => {
        this.paymentModeDetailsForm.reset();
        (this.paymentModeDetailsForm.get('paymentModeDetails') as FormArray).clear();
        this.addPaymentModeDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Payment Mode(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
