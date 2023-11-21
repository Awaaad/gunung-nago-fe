import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { EggReportDto } from 'generated-src/model';
import * as _moment from 'moment';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { default as _rollupMoment, Moment } from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { EggStockFrontDto } from 'generated-src/model-front';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-egg-report',
  templateUrl: './egg-report.component.html',
  styleUrls: ['./egg-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EggReportComponent {
  public eggCategoryId!: number | null;
  public eggStock!: EggStockFrontDto;
  public date = new FormControl(moment());
  public language = "en";
  public displayedColumns: string[] = ['date', 'yesterdayTie', 'yesterdayPiece', 'yesterdayBad', 'todayInTie', 'todayInPiece', 'todayInBad', 'todayOutTie', 'todayOutPiece', 'todayOutBad', 'todayRemainingTie', 'todayRemainingPiece', 'todayRemainingBad'];
  public displayedDetailedColumns: string[] = ['date', 'name', 'yesterdayTie', 'yesterdayPiece', 'yesterdayBad', 'todayInTie', 'todayInPiece', 'todayInBad', 'todayOutTie', 'todayOutPiece', 'todayOutBad', 'todayRemainingTie', 'todayRemainingPiece', 'todayRemainingBad'];
  public eggReport = new MatTableDataSource<EggReportDto>;
  public today: Date = new Date();
  public selectedDate: Date = new Date();
  public showDetailedReport: boolean = false;

  constructor(
    private eggStockApiService: EggStockApiService,
    private translateService: TranslateService,
  ) { }

  ionViewWillEnter(): void {
    this.getEggStock();
    this.findEggReport(moment(new Date()).startOf('day').format(moment.HTML5_FMT.DATE), false, this.eggCategoryId);
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

  public changeReportDate(event: any): void {
    this.date = event;
    this.search(this.showDetailedReport, this.eggCategoryId);
  }

  public detailedReportChange(event: any): void {
    this.showDetailedReport = event.detail.checked;
    if (this.showDetailedReport) {
      this.search(this.showDetailedReport, this.eggCategoryId);
    } else {
      this.search(this.showDetailedReport, null);
    }
  }

  public ionSelectEggCategory(event: any) {
    this.eggCategoryId = event.detail.value;
    this.search(this.showDetailedReport, this.eggCategoryId);
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.selectedDate.setMonth(normalizedMonthAndYear.month());
    this.selectedDate.setFullYear(normalizedMonthAndYear.year());
    this.search(this.showDetailedReport, this.eggCategoryId);
    datepicker.close();
  }

  public findEggReport(date: any, detailed: boolean, eggCategoryId: number | null) {
    this.eggReport = new MatTableDataSource<EggReportDto>([]);

    if (eggCategoryId) {
      const eggReportSearchCriteriaDto = {
        date: date,
        detailed: detailed,
        eggCategoryId: eggCategoryId
      }
      this.eggStockApiService.findEggCategoryStockTransactionsByEggStockAndDate(eggReportSearchCriteriaDto).subscribe(eggReport => {
        this.eggReport = new MatTableDataSource<EggReportDto>(eggReport);
      })
    } else {
      const eggReportSearchCriteriaDto = {
        date: date,
        detailed: detailed
      }
      this.eggStockApiService.findEggCategoryStockTransactionsByEggStockAndDate(eggReportSearchCriteriaDto).subscribe(eggReport => {
        this.eggReport = new MatTableDataSource<EggReportDto>(eggReport);
      })
    }
  }

  public search(detailed: boolean, eggCategoryId: number | null) {
    const date = moment(this.selectedDate).startOf('day').format(moment.HTML5_FMT.DATE);
    this.findEggReport(date, detailed, eggCategoryId);
  }

  public reset() {
    this.selectedDate = new Date();
    this.eggCategoryId = null;
    this.showDetailedReport = false;
    this.findEggReport(moment(new Date()).startOf('day').format(moment.HTML5_FMT.DATE), false, null);
  }
}

