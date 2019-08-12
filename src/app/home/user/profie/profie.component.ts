import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map'

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from "@angular/fire/auth";
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { AuthService, TitleService, CommonUtilsService } from '../../../core/services'
//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

import * as Prism from 'prismjs';
import * as firebase from 'firebase';


@Component({
  selector: 'app-profie',
  templateUrl: './profie.component.html',
  styleUrls: ['./profie.component.css']
})

export class ProfieComponent implements OnInit {
  croppedImage: any = '';
  imageChangedEvent: any = '';
  uid:any='';
  profileForm:FormGroup
  changePasswordForm:FormGroup
  submitted:boolean=false
  isProfileFormSubmitted:boolean = false
  isPasswordChangeFormSubmitted:boolean = false
  imageUrl:any='';
  userData:any = {};
  constructor(private commonUtilsService:CommonUtilsService, private authService:AuthService, private formBuilder: FormBuilder, private router: Router, private titleService: TitleService, private angularFirestore:AngularFirestore, private angularFireAuth:AngularFireAuth, private storage: AngularFireStorage) { 
    

    this.userData = JSON.parse(localStorage.getItem('loggedinUser'));//parsing the local store data
    //this.uid  = userData.user.uid;   
    console.log('userData',this.userData);

  }

  ngOnInit() {
    this._initProfileForm();
    this._initChangePasswordForm()
    
  }

  private _initChangePasswordForm(){
    this.changePasswordForm = this.formBuilder.group({
      old_password: [null, [Validators.required]],
      password: [null, [Validators.required]],
      repassword:[null, [Validators.required]],      
    },{
      // check whether our password and confirm password match
      validators: CustomValidators.passwordMatchValidator
    });
  }
  private _initProfileForm(){
    
    
    this.profileForm = this.formBuilder.group({
      first_name:[null, [Validators.required]],
      last_name: [null, [Validators.required]],
      recovery_email:[null, [Validators.email]],
      email:[this.userData.email, [Validators.email, Validators.required]],
      profile_pic:[],
      is_admin:[true]
    });

    
    
    if(this.userData.displayName!=null  && this.userData.displayName.length>0){
      let displayNameObject =  (this.userData.displayName).split('#')
      this.profileForm.get('first_name').setValue(displayNameObject[0])
      this.profileForm.get('last_name').setValue(displayNameObject[1])
      let recoverEmailObject =  (this.userData.displayName).split('####')
      console.log('recoverEmailObject',recoverEmailObject[1]);
      this.profileForm.get('recovery_email').setValue((recoverEmailObject[1]!="null")?recoverEmailObject[1]:'')
    }
    //this.imageUrl= this.userData.photoURL

  }



  changePassword(){
    if(this.changePasswordForm.invalid){
      console.log('form error');
      this.isPasswordChangeFormSubmitted = true
      return false;
    }




    const user = firebase.auth().currentUser;
    const _this = this

    let credential = firebase.auth.EmailAuthProvider.credential(
      user.email, 
      this.changePasswordForm.get('old_password').value
  );
    
    
    user.reauthenticateWithCredential(credential).then(function() {
    
      user.updatePassword(_this.changePasswordForm.get('password').value).then(function() {
        // Update successful.
        
        _this.changePasswordForm.reset();
        _this.authService.logout()
        .then(res => {
          _this.commonUtilsService.onSuccess('Successfully updated password. Please login.');
          localStorage.removeItem('loggedinUser');
          localStorage.clear();
          _this.router.navigate(['/']); 
        }, err => {       
          _this.commonUtilsService.onError(err);
        });
  
      }).catch(function(error) {
        // An error happened.
        _this.commonUtilsService.onError(error);
      }); 
    }).catch(function(error) {
      // An error happened.
      _this.commonUtilsService.onError(error);
    })
  }

 
  updateProfile(){
    if(this.profileForm.invalid){
      this.isProfileFormSubmitted = true
      return false;
    }


     
    const user = firebase.auth().currentUser;
    const _this = this    

    //this.isLoading = true
    if(this.croppedImage){
      
      let _this = this
      let path = `user/profile/${new Date().getTime()}.jpg`;
      //this.profileForm.get('profile_pic').setValue(path)
      this.storage.ref(path).putString(this.croppedImage, 'data_url').then(function(snapshot) {
        //console.log(snapshot);   
        snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log("File available at", downloadURL);
          _this.saveUpdate(downloadURL)
        });     
      });
      this.croppedImage = ''
     // this.showCropper = false
      //this.fileUploader.nativeElement.value = null;
    }else{
      this.saveUpdate('')
    }    
  }

  private _sendVerificationMail(){
    const user = firebase.auth().currentUser;
    const _this = this
     
      //update and verify email
      user.updateEmail(this.profileForm.get('email').value).then(function() {
        // Update successful.
        const user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
          // Email sent.
          _this.commonUtilsService.onSuccess('Profile has been updated and verification link has been sent successfully. Please Check your inbox and verify email.')
          _this.authService.logout()
          localStorage.removeItem('loggedinUser');
          localStorage.clear();
          _this.router.navigate(['/']);

        }).catch(function(error) {
          // An error happened.
          console.log('inner error',error)
          _this.commonUtilsService.onError(error);
        });
      }).catch(function(error) {
        // An error happened.
        console.log('outer error',error)
        _this.commonUtilsService.onError(error);
      });
    
  }
  saveUpdate(uploadedImageUrl){
    let profileObject = {
      displayName:`${this.profileForm.get('first_name').value}#${this.profileForm.get('last_name').value}####${this.profileForm.get('recovery_email').value}`,  
    }
    if(uploadedImageUrl.length>0){
      profileObject['photoURL'] =uploadedImageUrl
    }
    var user = firebase.auth().currentUser;
    let _this = this
    console.log('profileObject',profileObject)
    user.updateProfile(profileObject).then(function() {
     
     //check email change
     if(firebase.auth().currentUser.email != _this.profileForm.get('email').value){
      _this._sendVerificationMail()
    }else{
      localStorage.setItem('loggedinUser', JSON.stringify(firebase.auth().currentUser))
     
     _this.imageUrl = '';
     _this.croppedImage= '';
     _this.commonUtilsService.onSuccess('Profile updated');

      _this.authService.isProfileUpdated(true);//trigger loggedin observable 

    } 

     
      console.log('event fired')
    }).catch(function(error) {
      // An error happened.
      console.log(error)
      _this.commonUtilsService.onError(error);
    });

    
    
    //this.isLoading = false
    //this.isCollapsed = true
    this.imageUrl='';    
  }
fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
   // this.imageUrl = event.base64
}

}
