import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router } from "@angular/router";
import 'rxjs/add/operator/catch';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed
import { AuthService, TitleService, CommonUtilsService } from '../../core/services'
import {CustomValidators} from '../../core/custom-validators';
import {environment} from '../../../environments/environment'

import * as firebase from 'firebase';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  submitted:boolean = false;
  constructor(private formBuilder:FormBuilder,private authService:AuthService,private commonUtilService:CommonUtilsService) { }

  ngOnInit() {
    this.initForgotPasswordForm();
  }

   //forgot password form
   private initForgotPasswordForm(){
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],   
    }
    );

}



onSubmit() {
   this.submitted  = true;


   console.log('we jabe ')
  // stop here if form is invalid
  if (this.forgotPasswordForm.invalid) {
    return;
  }
  
  let firebaseAuth = firebase.auth();
   
  firebaseAuth.sendPasswordResetEmail(this.forgotPasswordForm.get('email').value)
      .then(() => {
        this.forgotPasswordForm.reset();
        this.commonUtilService.onSuccess(environment.MESSAGES.FORGOT_PASSWORD_SUCCESS);//showing success toaster
        
      })
      .catch((error) => {
        this.forgotPasswordForm.reset();
        this.commonUtilService.onError(error);//showing error toaster message

      }) 
      
}

 // This method must be present, even if empty.
 ngOnDestroy() {
  // To protect you, we'll throw an error if it doesn't exist.
}
}