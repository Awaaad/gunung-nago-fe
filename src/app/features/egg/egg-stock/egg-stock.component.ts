import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EggStockFrontDto } from 'generated-src/model-front';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-egg-stock',
  templateUrl: './egg-stock.component.html',
  styleUrls: ['./egg-stock.component.scss'],
})
export class EggStockComponent implements OnInit {
  public language = "en";
  public eggStock!: EggStockFrontDto;
  @ViewChild(IonModal) modal!: IonModal;
  public eggStockEditForm!: FormGroup;
  public isModalOpen: boolean = false;
  public errorMessages = {
    bigEggs: [
      { type: 'required', message: 'Big Eggs is required' },
    ],
    mediumEggs: [
      { type: 'required', message: 'Medium Eggs is required' },
    ],
    smallEggs: [
      { type: 'required', message: 'Small Eggs is required' },
    ],
    badEggs: [
      { type: 'required', message: 'Bad Eggs is required' },
    ],
  };
  constructor(
    private eggStockApiService: EggStockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit() {
    this.getEggStock();
  }

  ionViewWillEnter(): void {
    this.getEggStock();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getEggStock(): void {
    this.eggStock = {
      goodEggs: null,
      badEggs: null,
      totalEggs: null,
      eggCategoryStockDtos: [],
      createdBy: '',
      lastModifiedBy: '',
      createdDate: 0,
      lastModifiedDate: 0,
    }
    this.eggStockApiService.findEggStockForSale().subscribe(eggStock => {
      this.eggStock = eggStock;
    })
  }
  public initialiseEggStockEditForm(eggStockDetails: EggStockFrontDto): void {
    this.eggStockEditForm = new FormGroup({
      bigEggs: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      mediumEggs: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      smallEggs: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
      badEggs: new FormControl({ value: null, disabled: false }, Validators.compose([Validators.required])),
    })
  }

  public openModal(eggStock: EggStockFrontDto): void {
    this.initialiseEggStockEditForm(eggStock);
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
    this.eggStockApiService.edit(this.eggStockEditForm.value).subscribe({
      next: (data: string) => {
        this.eggStockEditForm.reset();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Egg Stock successfully edited');
        this.getEggStock();
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }
}

