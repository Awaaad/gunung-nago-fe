import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EggCategoryStockDto, EggTransferDto } from 'generated-src/model';
import { EggStockFrontDto, EggTransferAmountFrontDto, EggTransferFrontDto } from 'generated-src/model-front';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-egg-transfer',
  templateUrl: './egg-transfer.component.html',
  styleUrls: ['./egg-transfer.component.scss'],
})
export class EggTransferComponent implements OnInit {
  public language = "en";
  public eggStock!: EggStockFrontDto;
  public eggTransferDtos: EggTransferFrontDto[] = [];
  public eggTransferAmountDtos: EggTransferAmountFrontDto[] = [];

  public pieceBad: number = 0;
  public pieceUnsellable: number = 0;
  public tieBad: number = 0;
  public tieUnsellable: number = 0;
  public trayBad: number = 0;
  public trayUnsellable: number = 0;

  constructor(
    private eggStockApiService: EggStockApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
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
      lastModifiedBy: 0,
      createdDate: '',
      lastModifiedDate: 0,
    }
    this.eggStockApiService.findEggStockForSale().subscribe(eggStock => {
      this.eggStock = eggStock;
    })
  }

  public addEggCategory(event: any, eggCategory: EggCategoryStockDto): void {
    if (!event.detail.checked) {
      for (let i = 0; i < this.eggTransferAmountDtos.length; i++) {
        if (this.eggTransferAmountDtos[i].eggCategoryId === eggCategory.eggCategoryId) {
          this.eggTransferAmountDtos.splice(i, 1);
        }
      }
    } else {
      const eggTransferAmountDto = {
        eggCategoryId: eggCategory.eggCategoryId,
        name: eggCategory.name,
        eggType: eggCategory.eggType,
        quantity: eggCategory.quantity,
        pieceBad: null,
        pieceUnsellable: null,
        tieBad: null,
        tieUnsellable: null,
        trayBad: null,
        trayUnsellable: null,
      }
      this.eggTransferAmountDtos.push(eggTransferAmountDto);
    }
  }

  private mapToEggTransferDto(): void {
    this.eggTransferDtos = this.eggTransferAmountDtos.map(eggTransferAmountDto => {
      return {
        eggCategoryId: eggTransferAmountDto.eggCategoryId,
        bad: (eggTransferAmountDto.tieBad * 300) + (eggTransferAmountDto.trayBad * 30) + eggTransferAmountDto.pieceBad,
        unsellable: (eggTransferAmountDto.tieUnsellable * 300) + (eggTransferAmountDto.trayUnsellable * 30) + eggTransferAmountDto.pieceUnsellable
      }
    })
  }

  public save(): void {
    this.mapToEggTransferDto();
    this.utilsService.presentLoading();
    this.eggStockApiService.transfer(this.eggTransferDtos).subscribe({
      next: (data: string) => {
        this.reset();
        this.getEggStock();
        this.utilsService.dismissLoading();
        this.utilsService.successMsg('Eggs transfered successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.utilsService.dismissLoading();
        this.utilsService.unsuccessMsg('Error', 'gunung-nago-warehouse');
      }
    });
  }

  private reset(): void {
    this.eggTransferAmountDtos = [];
    this.eggTransferDtos = [];
  }

  public cancel(): void {
    this.reset();
    this.getEggStock();
  }
}
