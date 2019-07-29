import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';


import { ListingComponent } from './listing/listing.component';
import { ProfieComponent } from './profie/profie.component';

import { UserRoutingModule } from '../user/user-routing.module';


@NgModule({
  declarations: [ListingComponent,ProfieComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    NgxDatatableModule,
    ImageCropperModule
  ]
})
export class UserModule { }
