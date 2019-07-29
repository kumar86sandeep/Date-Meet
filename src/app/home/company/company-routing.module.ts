import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompaniesComponent } from './companies/companies.component';
import { EventsComponent } from './events/events.component';
import { FavouritesComponent } from './favourites/favourites.component';

const routes: Routes = [
{
  path: '',
  component: CompaniesComponent
},
{
  path: 'favourite-listing',
  component: FavouritesComponent
},
{
  path: 'event-listing',
  component: EventsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
