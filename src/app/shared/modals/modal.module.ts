import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SurveyProceedComponent } from './survey-proceed/survey-proceed.component';
import { WarmingComponent } from './warming/warming.component';

@NgModule({
  declarations: [SurveyProceedComponent, WarmingComponent],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ModalModule { }
