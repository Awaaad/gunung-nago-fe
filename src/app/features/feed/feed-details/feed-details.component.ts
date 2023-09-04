import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FeedCategory } from 'generated-src/model';
import { FeedApiService } from 'src/app/shared/api/feed.api.service';
import { UtilsService } from 'src/app/shared/util/utils.service';

@Component({
  selector: 'app-feed-details',
  templateUrl: './feed-details.component.html',
  styleUrls: ['./feed-details.component.scss'],
})
export class FeedDetailsComponent implements OnInit {
  public feedDetailsForm!: FormGroup;
  public initialQuantity: number = 0;
  public initialAge: number = 0;
  public aquisitionDate: Date = new Date();
  public aquisitionType: string = '';
  public feedId: number = 0;
  public today: Date = new Date();
  public language = "en";
  public feedCategories!: string[];
  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    category: [
      { type: 'required', message: 'Category is required' },
    ],
    recommendedWeight: [
      { type: 'required', message: 'Recommended weight is required' },
    ]
  };

  constructor(
    private feedApiService: FeedApiService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
    this.feedCategories = Object.keys(FeedCategory);
  }

  ngOnInit(): void {
    this.initialiseFormBuilder();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private initialiseFormBuilder(): void {
    this.feedDetailsForm = this.formBuilder.group({
      feedDetails: this.formBuilder.array([
        this.addFeedDetailsFormGroup()
      ])
    });
  }

  public addFeedDetailsFormGroup(): any {
    return this.formBuilder.group({
      id: null,
      name: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      feedCategory: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      recommendedWeight: new FormControl({ value: 0, disabled: false }, Validators.compose([Validators.required])),
    });
  }

  addFeedDetails(): void {
    (this.feedDetailsForm.get('feedDetails') as FormArray).push(this.addFeedDetailsFormGroup());
  }

  removeFeedDetails(healthProductDetailsGroupIndex: number): void {
    (this.feedDetailsForm.get('feedDetails') as FormArray).removeAt(healthProductDetailsGroupIndex);
  }

  get feedDetailsFields() {
    return this.feedDetailsForm ? this.feedDetailsForm.get('feedDetails') as FormArray : null;
  }

  public save(): void {
    this.utilsService.presentLoading();
    this.feedApiService.save(this.feedDetailsForm.value.feedDetails).subscribe({
      next: (data: string) => {
        this.feedDetailsForm.reset();
        (this.feedDetailsForm.get('feedDetails') as FormArray).clear();
        this.addFeedDetails();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Feed(s) successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}
