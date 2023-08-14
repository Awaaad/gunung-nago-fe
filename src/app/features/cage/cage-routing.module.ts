import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CageSurveyListComponent } from './cage-survey-list/cage-survey-list.component';
import { CageDetailsComponent } from './cage-details/cage-details.component';
import { CageListComponent } from './cage-list/cage-list.component';

const routes: Routes = [
  {
    path: 'cage-survey-list',
    component: CageSurveyListComponent
  },
  {
    path: 'cage-list',
    component: CageListComponent
  },
  {
    path: 'cage-details',
    component: CageDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CageRoutingModule { }
