import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { InterestComponent } from './interest/interest.component';
import { TrashedComponent } from './trashed/trashed.component';

const routes: Routes = [
{
  path: '',
  component: InterestComponent
},
{
  path: 'trashed',
  component: TrashedComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterestRoutingModule { }
