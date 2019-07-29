import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ListingComponent } from './listing/listing.component';
import { ProfieComponent } from './profie/profie.component';

const routes: Routes = [
{
  path: '',
  component: ListingComponent
},
{
  path: 'profile',
  component: ProfieComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
