import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'
import { Ng5SliderModule } from 'ng5-slider';
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need

import { CompaniesComponent } from './companies/companies.component';
import { EventsComponent } from './events/events.component';
import { FavouritesComponent } from './favourites/favourites.component';


import { CoreModule } from '../../core/core.module';

import { CompanyRoutingModule } from '../company/company-routing.module';


@NgModule({
  declarations: [CompaniesComponent, EventsComponent, FavouritesComponent],
  imports: [
    CommonModule,
    CoreModule,
    NgxDatatableModule,
    ImageCropperModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    CompanyRoutingModule,
    NgxDatatableModule,
    Ng5SliderModule,
    AmazingTimePickerModule
  ]
})
export class CompanyModule { }
