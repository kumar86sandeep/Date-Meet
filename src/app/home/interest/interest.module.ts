import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';


import { InterestComponent } from './interest/interest.component';

import { InterestRoutingModule } from './interest-routing.module';
import { TrashedComponent } from './trashed/trashed.component';


@NgModule({
  declarations: [InterestComponent, TrashedComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    InterestRoutingModule,
    NgxDatatableModule,
    ImageCropperModule
  ]
})
export class InterestModule { }
