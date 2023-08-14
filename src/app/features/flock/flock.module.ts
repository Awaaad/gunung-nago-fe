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
import { FlockApiService } from './service/flock.api.service';


@NgModule({
  declarations: [FlockListComponent, FlockDetailsComponent],
  imports: [
    CommonModule,
    FlockRoutingModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [FlockApiService]
})
export class FlockModule { }
