import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed
import { AuthService, TitleService, CommonUtilsService } from '../../core/services'
import {CustomValidators} from '../../core/custom-validators';
import {environment} from '../../../environments/environment'

import * as firebase from 'firebase';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit {
  submitted: boolean = false;
  resetPasswordForm:FormGroup;
  resetFormsubmitted: boolean = false;
  authToken:any;
  mode:any
  email:any;
  constructor(private router:Router,private commonUtilService:CommonUtilsService, private authService:AuthService,private activatedRoute:ActivatedRoute,private formBuilder:FormBuilder) { }

  ngOnInit() {

  
      this.initResetForm();
     //if seller/dealer loggedin then redirect
     let self = this;
     //this.route.snapshot.queryParams; 
     this.activatedRoute.queryParams.subscribe((params) => {     
      this.authToken = params.oobCode;  
      this.mode = params.mode 
      if(params.oobCode && params.oobCode.length<=0){
        this.commonUtilService.onError(environment.MESSAGES.INVALID_TOKEN);//showing success toaster
       
         
        this.router.navigate(['/']); 
      }  
      
      //confirm email verification
      if(this.mode=='verifyEmail' || this.mode=='recoverEmail'){
        console.log('yes', this.authToken);
        firebase.auth().applyActionCode(
          this.authToken
        ).then(resp => { 
          console.log('resp',resp);
           // this.commonUtilService.onSuccess(environment.MESSAGES.PASSWORD_RESET_SUCCESS);//showing success toaster
            //this.router.navigate(['/seller/login']);
           // this.resetPasswordForm.reset();
            // this.otpVerificationForm.reset();   
            //this.router.navigate(['/']); 
          
         }).catch(e => { 
           console.log('error',e)
            // Error occurred during confirmation. The code might have
            this.commonUtilService.onError(e);//showing error toaster message
      });
      }
     })  
  }


    //otp verification form
    private initResetForm(){
      this.resetPasswordForm = this.formBuilder.group({
        email:[this.email],
        password: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(50),
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ),
            Validators.minLength(10)
          ])
        ], 
        repassword: [null, Validators.compose([Validators.minLength(10),Validators.maxLength(50),Validators.required])],
      },
      {
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
      })
    }
 
    



     
    //save seller infor into our local db
updatePassword(){
  
  if(this.resetPasswordForm.invalid)
      return

  // Save the new password.   
  this.authService.getAuth().confirmPasswordReset(
    this.authToken, 
    this.resetPasswordForm.get('password').value
  ).then(resp => { 
      this.commonUtilService.onSuccess(environment.MESSAGES.PASSWORD_RESET_SUCCESS);//showing success toaster
      //this.router.navigate(['/seller/login']);
      this.resetPasswordForm.reset();
      // this.otpVerificationForm.reset();   
      this.router.navigate(['/']); 
    
   }).catch(e => { 
      // Error occurred during confirmation. The code might have
      this.commonUtilService.onError(environment.MESSAGES.SYSTEM_ERROR);//showing error toaster message
}); 


 
}




  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
