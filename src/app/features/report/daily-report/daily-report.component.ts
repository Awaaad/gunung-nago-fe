import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DailyProductionReportDto } from 'generated-src/model';
import { Subscription } from 'rxjs';
import { ReportApiService } from '../../../shared/api/report.api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss'],
})
export class DailyReportComponent {
  public language = "en";
  public displayedColumns: string[] = ['cageName', 'surveyDate', 'flockAge', 'flockCategory', 'initialFlockQuantity', 'deadChicken', 'sterileChicken', 'goodChicken', 'goodEggsInTie', 'goodEggsNotInTie', 'badEggsNotInTray', 'totalEggs', 'percentageHD', 'healthReportDtos', 'goodEggsInTray', 'bagsEaten', 'comment'];
  public dailyReport = new MatTableDataSource<DailyProductionReportDto>;
  public cageSearchSubscription!: Subscription;
  public date: Date = new Date();
  public today: Date = new Date();

  constructor(
    private reportApiService: ReportApiService,
    private translateService: TranslateService,
  ) { }

  ionViewWillEnter(): void {
    this.findDailyProductionReport(moment(new Date()).startOf('day').format(moment.HTML5_FMT.DATE));
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public reportForm = new FormGroup({
    date: new FormControl(moment(this.date), Validators.compose([Validators.required]))
  });

  public findDailyProductionReport(date: any) {
    this.dailyReport = new MatTableDataSource<DailyProductionReportDto>([]);

    this.reportApiService.findDailyProductionReport(date).subscribe(dailyReport => {
      this.dailyReport = new MatTableDataSource<DailyProductionReportDto>(dailyReport);
    })
  }

  public search() {
    const date = moment(this.reportForm.value.date).startOf('day').format(moment.HTML5_FMT.DATE);
    this.findDailyProductionReport(date);
  }

  public reset() {
    this.date = new Date();
    this.findDailyProductionReport(moment(new Date()).startOf('day').format(moment.HTML5_FMT.DATE));
  }

  public getTotalGoodChicken(): any {
    const total = this.dailyReport.data.map(data => data.goodChicken).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalSterileChicken(): any {
    const total = this.dailyReport.data.map(data => data.sterileChicken).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalDeadChicken(): any {
    const total = this.dailyReport.data.map(data => data.deadChicken).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalGoodEggsInTie(): any {
    const total = this.dailyReport.data.map(data => data.goodEggsInTie).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalGoodEggsNotInTie(): any {
    const total = this.dailyReport.data.map(data => data.goodEggsNotInTie).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalBadEggsNotInTray(): any {
    const total = this.dailyReport.data.map(data => data.badEggsNotInTray).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }

  public getTotalEggs(): any {
    const total = this.dailyReport.data.map(data => data.totalEggs).reduce((acc, value) => acc + value, 0);
    if (total != 0) {
      return total;
    }
  }
}

