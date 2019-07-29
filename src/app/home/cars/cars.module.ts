import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ListingComponent } from './listing/listing.component';
import { CarRoutingModule } from '../cars/car-routing.module';

import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [ListingComponent],
  imports: [
    CommonModule,
    CoreModule,
    CarRoutingModule,
    NgxDatatableModule
  ]
})
export class CarsModule { }
