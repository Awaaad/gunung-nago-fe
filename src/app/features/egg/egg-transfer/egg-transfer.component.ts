import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EggStockDto, EggTransferDto } from 'generated-src/model';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-egg-transfer',
  templateUrl: './egg-transfer.component.html',
  styleUrls: ['./egg-transfer.component.scss'],
})
export class EggTransferComponent implements OnInit {
  public language = "en";
  public eggStock!: EggStockDto;
  public eggTransferDto!: EggTransferDto;

  public big: boolean = false;
  public medium: boolean = false;
  public small: boolean = false;
  public bad: boolean = false;

  public bigGoodPieceBad: number = 0;
  public bigGoodPieceBroken: number = 0;
  public bigGoodTieBad: number = 0;
  public bigGoodTieBroken: number = 0;
  public bigGoodTrayBad: number = 0;
  public bigGoodTrayBroken: number = 0;

  public mediumGoodPieceBad: number = 0;
  public mediumGoodPieceBroken: number = 0;
  public mediumGoodTieBad: number = 0;
  public mediumGoodTieBroken: number = 0;
  public mediumGoodTrayBad: number = 0;
  public mediumGoodTrayBroken: number = 0;

  public smallGoodPieceBad: number = 0;
  public smallGoodPieceBroken: number = 0;
  public smallGoodTieBad: number = 0;
  public smallGoodTieBroken: number = 0;
  public smallGoodTrayBad: number = 0;
  public smallGoodTrayBroken: number = 0;

  public badPieceBroken: number = 0;
  public badTieBroken: number = 0;
  public badTrayBroken: number = 0;

  constructor(
    private eggStockApiService: EggStockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getEggStock();
    this.initialiseEggTransferDto();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  private getEggStock(): void {
    this.eggStock = {
      totalEggs: 0,
      bigEggs: 0,
      mediumEggs: 0,
      smallEggs: 0,
      goodEggs: 0,
      badEggs: 0
    }
    this.eggStockApiService.findEggStockForSale().subscribe(eggStock => {
      this.eggStock = eggStock;
    })
  }

  private initialiseEggTransferDto(): void {
    this.eggTransferDto = {
      bigGoodToBadEggs: 0,
      bigGoodBrokenEggs: 0,
      mediumGoodToBadEggs: 0,
      mediumGoodBrokenEggs: 0,
      smallGoodToBadEggs: 0,
      smallGoodBrokenEggs: 0,
      badBrokenEggs: 0,
    }
  }

  public bigCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.bigGoodPieceBad = 0;
      this.bigGoodPieceBroken = 0;
      this.bigGoodTrayBad = 0;
      this.bigGoodTrayBroken = 0;
      this.bigGoodTieBad = 0;
      this.bigGoodTieBroken = 0;
    }
  }

  public mediumCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.mediumGoodPieceBad = 0;
      this.mediumGoodPieceBroken = 0;
      this.mediumGoodTrayBad = 0;
      this.mediumGoodTrayBroken = 0;
      this.mediumGoodTieBad = 0;
      this.mediumGoodTieBroken = 0;
    }
  }

  public smallCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.smallGoodPieceBad = 0;
      this.smallGoodPieceBroken = 0;
      this.smallGoodTrayBad = 0;
      this.smallGoodTrayBroken = 0;
      this.smallGoodTieBad = 0;
      this.smallGoodTieBroken = 0;
    }
  }

  public badCheckboxChange(event: any): void {
    if (!event.detail.checked) {
      this.badPieceBroken = 0;
      this.badTrayBroken = 0;
      this.badTieBroken = 0;
    }
  }

  private mapToEggTransferDto(): void {
    this.eggTransferDto = {
      bigGoodToBadEggs: (this.bigGoodTieBad ? this.bigGoodTieBad * 300 : 0) + (this.bigGoodTrayBad ? this.bigGoodTrayBad * 30 : 0) + (this.bigGoodPieceBad ? this.bigGoodPieceBad : 0),
      bigGoodBrokenEggs: (this.bigGoodTieBroken ? this.bigGoodTieBroken * 300 : 0) + (this.bigGoodTrayBroken ? this.bigGoodTrayBroken * 30 : 0) + (this.bigGoodPieceBroken ? this.bigGoodPieceBroken : 0),
      mediumGoodToBadEggs: (this.mediumGoodTieBad ? this.mediumGoodTieBad * 300 : 0) + (this.mediumGoodTrayBad ? this.mediumGoodTrayBad * 30 : 0) + (this.mediumGoodPieceBad ? this.mediumGoodPieceBad : 0),
      mediumGoodBrokenEggs: (this.mediumGoodTieBroken ? this.mediumGoodTieBroken * 300 : 0) + (this.mediumGoodTrayBroken ? this.mediumGoodTrayBroken * 300 : 0) + (this.mediumGoodPieceBroken ? this.mediumGoodPieceBroken : 0),
      smallGoodToBadEggs: (this.smallGoodTieBad ? this.smallGoodTieBad * 300 : 0) + (this.smallGoodTrayBad ? this.smallGoodTrayBad * 30 : 0) + (this.smallGoodPieceBad ? this.smallGoodPieceBad : 0),
      smallGoodBrokenEggs: (this.smallGoodTieBroken ? this.smallGoodTieBroken * 300 : 0) + (this.smallGoodTrayBroken ? this.smallGoodTrayBroken * 30 : 0) + (this.smallGoodPieceBroken ? this.smallGoodPieceBroken : 0),
      badBrokenEggs: (this.badTieBroken ? this.badTieBroken * 300 : 0) + (this.badTrayBroken ? this.badTrayBroken * 30 : 0) + (this.badPieceBroken ? this.badPieceBroken : 0),
    }
  }

  public save(): void {
    this.mapToEggTransferDto();
    console.log(this.eggTransferDto)
    this.utilsService.presentLoading();
    this.eggStockApiService.transfer(this.eggTransferDto).subscribe({
      next: (data: string) => {
        this.reset();
        this.getEggStock();
        this.initialiseEggTransferDto();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Manure stock successfully updated');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private reset(): void {
    this.big = false;
    this.medium = false;
    this.small = false;
    this.bad = false;

    this.bigGoodPieceBad = 0;
    this.bigGoodPieceBroken = 0;
    this.bigGoodTieBad = 0;
    this.bigGoodTieBroken = 0;
    this.bigGoodTrayBad = 0;
    this.bigGoodTrayBroken = 0;

    this.mediumGoodPieceBad = 0;
    this.mediumGoodPieceBroken = 0;
    this.mediumGoodTieBad = 0;
    this.mediumGoodTieBroken = 0;
    this.mediumGoodTrayBad = 0;
    this.mediumGoodTrayBroken = 0;

    this.smallGoodPieceBad = 0;
    this.smallGoodPieceBroken = 0;
    this.smallGoodTieBad = 0;
    this.smallGoodTieBroken = 0;
    this.smallGoodTrayBad = 0;
    this.smallGoodTrayBroken = 0;

    this.badPieceBroken = 0;
    this.badTieBroken = 0;
    this.badTrayBroken = 0;
  }

  public cancel(): void {
    this.reset();
    this.getEggStock();
    this.initialiseEggTransferDto();
  }
}
