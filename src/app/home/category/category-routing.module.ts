import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesComponent } from './categories/categories.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';


const routes: Routes = [
{
  path: '',
  component: CategoriesComponent
},
{
  path: 'subcategory-listing',
  component: SubCategoryComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
