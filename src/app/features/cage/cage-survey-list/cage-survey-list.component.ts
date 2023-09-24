import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CageApiService } from '../../../shared/apis/cage.api.service';
import { AquisitionType, CageCategory, CageDto } from 'generated-src/model';
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
export class CageSurveyListComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public cages: CageDto[] = [];
  public cagesDara: CageDto[] = [];
  public cagesDoc: CageDto[] = [];
  public language = "en";
  public isModalOpen: boolean = false;
  public isNoActiveFlockAlertOpen: boolean = false;
  public isSurveyAlreadyRecordedAlertOpen: boolean = false;
  public warningMessage: string = '';
  public alertButtons: any[] = [];
  public isResponsePositive: boolean = false;
  public selectedCageId!: number;

  // flock form values
  public population: number = 0;
  public dead: number = 0;
  public sterile: number = 0;
  public remaining: number = 0;
  public tie: number = 0;
  public item: number = 0;
  public broken: number = 0;
  public totalItem: number = 0;
  private flockSaveDto!: FlockSaveFrontDto;
  public aquisitionTypes: string[] = [];
  public date: Date = new Date();
  public today: Date = new Date();

  constructor(
    private cageApiService: CageApiService,
    private flockApiService: FlockApiService,
    private surveyApiService: SurveyApiService,
    private translateService: TranslateService,
    private router: Router,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.aquisitionTypes = Object.keys(AquisitionType);
    this.initialiseAlertButtons();
    this.getAllActiveCages();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public routeToSurveyDetails(cage: CageDto) {
    this.isNoActiveFlockAlertOpen = false;
    this.isSurveyAlreadyRecordedAlertOpen = false;
    this.selectedCageId = cage.id;
    this.surveyApiService.findIfSurveyHasBeenRegisteredForCage(cage.id).subscribe(data => {
      if (data == null) {
        this.warningMessage = 'There are no active flocks for the selected cage. \n Would you like to create one?';
        this.isNoActiveFlockAlertOpen = true;
      } else if (data === moment(new Date()).startOf('day').format(moment.HTML5_FMT.DATE)) {
        this.warningMessage = 'A survey has already been recorded today for the selected cage. \n Would you like to edit the recorded survey?';
        this.isSurveyAlreadyRecordedAlertOpen = true;
      } else {
        this.isNoActiveFlockAlertOpen = false;
        this.isSurveyAlreadyRecordedAlertOpen = false;
        this.router.navigate([`survey/survey-details/${cage.id}/${false}`]);
      }
    })
  }

  public getAllActiveCages() {
    this.cageApiService.getAllActiveCages().subscribe(cages => {
      this.cagesDoc = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DOC);
      this.cagesDara = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.DARA);
      this.cages = cages.filter((cage: { cageCategory: string; }) => cage.cageCategory === CageCategory.NORM);
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
    if (this.isNoActiveFlockAlertOpen && this.isResponsePositive === true) {
      this.isNoActiveFlockAlertOpen = false;
      this.isModalOpen = true;
    }
  }

  public flockForm = new FormGroup({
    age: new FormControl({ value: 1, disabled: false }, Validators.compose([])),
    population: new FormControl({ value: this.population, disabled: false }, Validators.compose([])),
    dead: new FormControl({ value: this.dead, disabled: false }, Validators.compose([])),
    sterile: new FormControl({ value: this.sterile, disabled: false }, Validators.compose([])),
    tie: new FormControl({ value: this.tie, disabled: false }, Validators.compose([])),
    item: new FormControl({ value: this.item, disabled: false }, Validators.compose([])),
    broken: new FormControl({ value: this.broken, disabled: false }, Validators.compose([])),
    aquisitionDate: new FormControl({ value: this.date, disabled: false }, Validators.compose([])),
    aquisitionType: new FormControl({ value: AquisitionType.PURCHASE, disabled: false }, Validators.compose([])),
    cageId: new FormControl({ value: this.selectedCageId, disabled: false }),
  });

  public calculateRemaining() {
    this.remaining = this.population - (this.dead + this.sterile)
  }

  public calculateTotalItem() {
    this.totalItem = (this.tie * 300) + this.item + this.broken;
  }

  private initialiseFlockSaveDto(): void {
    this.flockSaveDto = {
      id: null,
      active: true,
      initialAge: null,
      initialQuantity: null,
      aquisitionDate: null,
      aquisitionType: null,
      cageId: null,
      death: null,
      sterile: null,
      badEggs: null,
      goodEggs: null
    }
  }

  private populateFlockSaveDtoWithFormValues(): void {
    this.flockSaveDto = {
      id: null,
      active: true,
      initialAge: this.flockForm.value.age,
      initialQuantity: this.flockForm.value.population,
      aquisitionDate: this.flockForm.value.aquisitionDate,
      aquisitionType: this.flockForm.value.aquisitionType,
      cageId: this.selectedCageId,
      death: this.flockForm.value.dead,
      sterile: this.flockForm.value.sterile,
      badEggs: this.broken,
      goodEggs: (this.tie * 300) + this.item
    };
  }

  private saveFlock(): void {
    this.utilsService.presentLoading();
    this.initialiseFlockSaveDto();
    this.populateFlockSaveDtoWithFormValues();
    this.flockApiService.save(this.flockSaveDto).subscribe({
      next: (data: string) => {
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Flock successfully saved');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
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
      this.saveFlock();
    }
  }
}
