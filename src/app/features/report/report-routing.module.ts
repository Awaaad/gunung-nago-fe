import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyReportComponent } from './daily-report/daily-report.component';

const routes: Routes = [
  {
    path: 'daily-report',
    component: DailyReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
