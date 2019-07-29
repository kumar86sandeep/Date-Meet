import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class

//import shared services
import { environment } from '../../../environments/environment'

import Swal from 'sweetalert2'

@Injectable()
export class CommonUtilsService { 

  constructor(private toastrManager:ToastrManager ) { }


  
  /**
  * Show alert on success response & hide page loader
  * @return void
  */
  public onSuccess(message): void {
   // this.pageLoaderService.pageLoader(false);//hide page loader
    //this.pageLoaderService.setLoaderText('');//setting loader text empty
    this.toastrManager.successToastr(message, 'Success!'); //showing success toaster 
  }

  /**
  * Show alert on error response & hide page loader
  * @return void
  */
  public onError(message): void {
   // this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
    //this.pageLoaderService.pageLoader(false);//hide page loader
    this.toastrManager.errorToastr(message, 'Oops!',{maxShown:1});//showing error toaster message  
  }
  restore
  /**
  * Show confirmation popup before restore the record.
  * @return any
  */
 public isrestoreConfirmed(): any {

  let isConfirmed = Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, restore it!'
  }).then((result) => {
    return (result.value) ? true : false
  })

  return isConfirmed;
}

  /**
  * Show confirmation popup before delete the record.
  * @return any
  */
 public isDeleteConfirmed(): any {

  let isConfirmed = Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    return (result.value) ? true : false
  })

  return isConfirmed;
}

}