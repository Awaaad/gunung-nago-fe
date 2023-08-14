import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveryDetailsComponent } from './survery-details/survery-details.component';

const routes: Routes = [
  {
    path: 'survey-list',
    component: SurveyListComponent
  },
  {
    path: 'survey-details',
    component: SurveryDetailsComponent
  },
  {
    path: 'survey-details/:cageId',
    component: SurveryDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
