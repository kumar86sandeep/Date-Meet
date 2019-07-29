import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home/home.component';

import { AdminAuthGuardService } from './core/guards/admin-auth-guard.service'

const routes: Routes = [
  {
  path: 'admin',
  data: {
      title: 'Get Started',
  },
  canActivate: [AdminAuthGuardService],
  children: [
 
    {
      path: 'category',      
      loadChildren: './home/category/category.module#CategoryModule',
      data: {
        customLayout: false
      }
    },
    {
      path: 'user',      
      loadChildren: './home/user/user.module#UserModule',
      data: {
        customLayout: false
      }
    },
    {
        path: 'company',      
        loadChildren: './home/company/company.module#CompanyModule',
        data: {
          customLayout: false
        }
    },
    {
      path:'interest',
      loadChildren: './home/interest/interest.module#InterestModule',
      data: {
        customLayout: false
      }
    }
   
    ]
  },  
  {
    path: '',
    loadChildren: './+login/login.module#LoginModule',
    data: {
      customLayout: true
    }
  },  
  {
    path: 'verification',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule',
    data: {
      customLayout: true,
      title: 'Forgot Password',
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
