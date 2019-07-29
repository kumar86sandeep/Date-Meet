import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

import { CategoriesComponent } from './categories/categories.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';

import { CoreModule } from '../../core/core.module';
import { CategoryRoutingModule } from '../category/category-routing.module';

@NgModule({
  declarations: [CategoriesComponent, SubCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    CategoryRoutingModule,
    NgxDatatableModule,
    ImageCropperModule
  ]
})
export class CategoryModule { }
