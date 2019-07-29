import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';

const routes: Routes = [
  {
    path: 'recover',
    component: RecoverPasswordComponent,
    data: { title: "Forgot Password" },  
  },
  {
    path: 'verifyToken',
    component: VerifyCodeComponent,
    data: { title: "Verify Code" },  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
