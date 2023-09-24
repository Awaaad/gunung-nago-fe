import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveryDetailsComponent } from './survery-details/survery-details.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SurveyApiService } from '../../shared/apis/survey.api.service';
import { HealthProductApiService } from 'src/app/shared/apis/health-product.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { FlockFeedLineApiService } from 'src/app/shared/apis/flock-feed-line.api.service';

@NgModule({
  declarations: [SurveyListComponent, SurveryDetailsComponent],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatChipsModule
  ],
  providers: [SurveyApiService, HealthProductApiService, FlockFeedLineApiService]
})
export class SurveyModule { }
