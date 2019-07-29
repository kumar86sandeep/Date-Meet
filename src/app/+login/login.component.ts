import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the component destroyed

//services
import { AuthService, TitleService, CommonUtilsService } from '../core/services'
import * as firebase from 'firebase';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted:boolean = false
  constructor(private commonUtilsService:CommonUtilsService, private authService:AuthService, private formBuilder: FormBuilder, private router: Router, private titleService: TitleService) {

  if (JSON.parse(localStorage.getItem("loggedinUser"))) {
      // logged in so return true
      //return true;
      this.authService.isProfileUpdated(true);//trigger loggedin observable 
      this.router.navigate(['/admin/interest'])
  }


    this._initalizeLoginForm()
   }

  ngOnInit() {
    //setting the page title
    this.titleService.setTitle();


    
  }


  private _initalizeLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: [null, [Validators.required]]     
    });
  }

  //check login at our local system
  onSubmit() {
    if (this.loginForm.invalid) {
      this.submitted = true
      return
    }

    this.authService.login(this.loginForm.value)
      .then(res => {
        console.log(res);
        localStorage.setItem('loggedinUser', JSON.stringify(firebase.auth().currentUser))
       
        this.authService.isProfileUpdated(true);//trigger loggedin observable 
       // this.authService.isLoggedIn(true, 'admin');//trigger loggedin observable 
        this.commonUtilsService.onSuccess('Successfully Loggedin');
        this.authService.isProfileUpdated(true);//trigger loggedin observable 
        this.router.navigate(['/admin/interest'])
        
      }, err => {
        this.commonUtilsService.onError(err);
      });    
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

}
