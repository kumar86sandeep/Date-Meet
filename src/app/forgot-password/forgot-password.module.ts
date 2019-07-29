import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import {ForgotPasswordRoutingModule} from './forgot-password-routing.module';
@NgModule({
  declarations: [RecoverPasswordComponent, VerifyCodeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    ForgotPasswordRoutingModule
  ]
})
export class ForgotPasswordModule { }
