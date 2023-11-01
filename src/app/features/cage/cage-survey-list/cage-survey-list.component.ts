import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CageApiService } from '../../../shared/apis/cage.api.service';
import { AquisitionType, CageCategory, CageDto, FlockCategory } from 'generated-src/model';
import { SurveyApiService } from '../../../shared/apis/survey.api.service';
import * as moment from 'moment';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FlockSaveFrontDto } from 'generated-src/model-front';
import { FlockApiService } from '../../../shared/apis/flock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-cage-survey-list',
  templateUrl: './cage-survey-list.component.html',
  styleUrls: ['./cage-survey-list.component.scss'],
})
export class CageSurveyListComponent {
  @ViewChild(IonModal) modal!: IonModal;
  public cages: CageDto[] = [];
  public cagesDara: CageDto[] = [];
  public cagesDoc: CageDto[] = [];
  public language = "en";
  public isModalOpen: boolean = false;
  public isSurveyAlreadyRecordedAlertOpen: boolean = false;
  public isFlockAndCageIncompatible: boolean = false;
  public warningMessage: string = '';
  public alertButtons: any[] = [];
  public isResponsePositive: boolean = false;
  public selectedCageId!: number;

  public transferForm!: FormGroup;
  public transferCages: CageDto[] = [];
  public flockId!: number;
  public flockCategory!: FlockCategory;
  public cageCategory!: CageCategory;

  public today: Date = new Date();

  constructor(
    private cageApiService: CageApiService,
    private flockApiService: FlockApiService,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService,
    private router: Router,
    private utilsService: UtilsService
  ) { }

  ionViewWillEnter(): void {
    this.initialiseAlertButtons();
    this.getAllActiveCages();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public routeToSurveyDetails(cage: CageDto) {
    this.isSurveyAlreadyRecordedAlertOpen = false;
    this.isFlockAndCageIncompatible = false;
    this.selectedCageId = cage.id;
    this.surveyApiService.findIfSurveyHasBeenRegisteredForCage(cage.id).subscribe(data => {
      // if (data == null) {
      //   this.warningMessage = 'There are no active flocks for the selected cage. \n Would you like to create one?';
      //   this.isNoActiveFlockAlertOpen = true;
      // } else 
      if (data === moment(new Date()).startOf('day').format(moment.HTML5_FMT.DATE)) {
        this.warningMessage = 'A survey has already been recorded today for the selected cage. \n Would you like to edit the recorded survey?';
        this.isSurveyAlreadyRecordedAlertOpen = true;
      } else {
        this.surveyApiService.findMostRecentSurveyDtoForCage(cage.id).subscribe(data => {
          if (data.flockCategory != (cage.cageCategory) as unknown as FlockCategory) {
            this.isFlockAndCageIncompatible = true;
            this.flockId = data.flockId;
            this.flockCategory = data.flockCategory;
            this.cageCategory = data.cageCategory;
            this.getAllFreeCages(data.flockCategory);
            this.initialiseFormBuilder(this.flockId);
          } else {
            this.isSurveyAlreadyRecordedAlertOpen = false;
            this.isFlockAndCageIncompatible = false;
            this.router.navigate([`survey/survey-details/${cage.id}/${false}`]);
          }
        })
      }
    })
  }

  public skip(): void {
    this.isFlockAndCageIncompatible = false;
    this.modal.dismiss(null, 'cancel');
    this.router.navigate([`survey/survey-details/${this.selectedCageId}/${false}`]);
  }

  public getAllActiveCages() {
    this.cageApiService.getAllActiveCages().subscribe(cages => {
      this.cagesDoc = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DOC);
      this.cagesDara = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DARA);
      this.cages = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.NORM);
    })
  }

  public getAllFreeCages(cageCategory: string) {
    this.cageApiService.getAllInactiveCagesByCategory(cageCategory).subscribe(cages => {
      this.transferCages = cages;
    })
  }

  public initialiseAlertButtons(): void {
    this.alertButtons = [
      {
        text: 'No',
        role: false,
        cssClass: 'alert-negative-btn',
        handler: () => {
          this.isResponsePositive = false;
        },
      },
      {
        text: 'Yes',
        role: true,
        cssClass: 'alert-positive-btn',
        handler: () => {
          this.isResponsePositive = true;
        },
      },
    ]
  }

  public setAlertResult(event: any): void {
    this.isResponsePositive = event.detail.role;
    if (this.isSurveyAlreadyRecordedAlertOpen && this.isResponsePositive === true) {
      this.router.navigate([`survey/survey-details/${this.selectedCageId}/${true}`]);
    }
  }

  private initialiseFormBuilder(flockId: number): void {
    this.transferForm = new FormGroup({
      flockId: new FormControl({ value: flockId, disabled: false }, Validators.compose([])),
      cageId: new FormControl({ value: null, disabled: false }, Validators.compose([])),
    });
  }

  private saveTransfer(): void {
    this.utilsService.presentLoading();
    this.flockApiService.transferFlockToCage([this.transferForm.value]).subscribe({
      next: (data: string) => {
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock transferred successfully');
        this.router.navigate([`survey/survey-details/${this.transferForm.value.cageId}/${false}`]);
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  public cancel(): void {
    this.isFlockAndCageIncompatible = false;
    this.modal.dismiss(null, 'cancel');
  }

  public confirm(): void {
    this.modal.dismiss(null, 'confirm');
  }

  public onWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'backdrop') {
      this.isFlockAndCageIncompatible = false;
    }
    if (ev.detail.role === 'confirm') {
      this.saveTransfer();
    }
  }
}
