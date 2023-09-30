import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlockRoutingModule } from './flock-routing.module';
import { FlockListComponent } from './flock-list/flock-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FlockDetailsComponent } from './flock-details/flock-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FlockApiService } from '../../shared/apis/flock.api.service';
import { FlockSaleApiService } from '../../shared/apis/flock-sale.api.service';
import { FlockSaleDetailsComponent } from './flock-sale-details/flock-sale-details.component';
import { FlockSaleListComponent } from './flock-sale-list/flock-sale-list.component';
import { SurveyApiService } from '../../shared/apis/survey.api.service';
import { CageApiService } from '../../shared/apis/cage.api.service';
import { CustomerApiService } from 'src/app/shared/apis/customer.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [FlockListComponent, FlockDetailsComponent, FlockSaleDetailsComponent, FlockSaleListComponent],
  imports: [
    CommonModule,
    FlockRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule
  ],
  providers: [FlockApiService, FlockSaleApiService, SurveyApiService, CageApiService, CustomerApiService]
})
export class FlockModule { }
