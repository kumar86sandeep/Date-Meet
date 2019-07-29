import { Component, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { Subscription } from 'rxjs/Subscription';

//import services
import { AuthService } from '../../services'
import { environment } from '../../../../environments/environment'
import * as firebase from 'firebase';
@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html'
})
export class HeaderInnerComponent {
  

  profileSubscription: Subscription;
  profileData: any = {};
  constructor(private toastrManager:ToastrManager, private router: Router, private authService:AuthService, private ngZone: NgZone){
    
    this.ngZone.run( () => {
      if(JSON.parse(localStorage.getItem('loggedinUser'))){
        this.profileData = JSON.parse(localStorage.getItem('loggedinUser'))
        console.log('profile',this.profileData)
        const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
        this.profileData['profile_pic'] = (this.profileData.photoURL !=null && this.profileData.photoURL.length>0) ? this.profileData.photoURL : defaultPath;
        if(this.profileData.displayName !=null &&this.profileData.displayName.indexOf("#")){
          let nameArray  = this.profileData.displayName.split('####')
          this.profileData['displayName'] = nameArray[0].replace(/#/g, " ");
        }            
      }
    });
    
    this.profileSubscription = this.authService.getUpdatedProfileStatus().subscribe((profileStatus) => {      
      this.ngZone.run( () => {
        this.profileData = JSON.parse(localStorage.getItem('loggedinUser'))
        console.log('profile',this.profileData)
        const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
        this.profileData['profile_pic'] = (this.profileData.photoURL !=null && this.profileData.photoURL.length>0) ? this.profileData.photoURL : defaultPath;
        if(this.profileData.displayName !=null &&this.profileData.displayName.indexOf("#")){
          let nameArray  = this.profileData.displayName.split('####')
          this.profileData['displayName'] = nameArray[0].replace(/#/g, " ");
        }    
      });       
    });
  }
  

  redirectToProfile(){
    this.router.navigate(['/admin/user/profile']); 
  }
  logout(){
    this.authService.logout()
      .then(res => {
        this.toastrManager.successToastr(environment.MESSAGES.LOGOUT_SUCCESS, 'Success!');//showing success toaster
        localStorage.removeItem('loggedinUser');
        localStorage.clear();
        this.router.navigate(['/']); 
      }, err => {       
        this.toastrManager.errorToastr(err.message,'Oops!',{maxShown:1});//showing error toaster
      });
  }
}
