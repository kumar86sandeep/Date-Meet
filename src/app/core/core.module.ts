import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoxModule, TabsModule, DropdownModule } from 'angular-admin-lte';

import { HeaderInnerComponent } from './components/header-inner/header-inner.component';
import { SidebarLeftInnerComponent } from './components/sidebar-left-inner/sidebar-left-inner.component';
import { SidebarRightInnerComponent } from './components/sidebar-right-inner/sidebar-right-inner.component';
import { FormValidationErrorsComponent } from './components/form-validation-errors/form-validation-errors.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DropdownModule,
    TabsModule,
    BoxModule
  ],
  declarations: [HeaderInnerComponent, SidebarLeftInnerComponent, SidebarRightInnerComponent,FormValidationErrorsComponent],
  exports: [BoxModule, TabsModule, HeaderInnerComponent, SidebarLeftInnerComponent, SidebarRightInnerComponent,FormValidationErrorsComponent]
})
export class CoreModule { }
