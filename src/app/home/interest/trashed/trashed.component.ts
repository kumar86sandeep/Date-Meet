import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map'

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireDatabase } from '@angular/fire/database';

//services
import { TitleService, CategoryService, InterestService, CommonUtilsService } from '../../../core/services'

//import models
import { PagedData, Category, Subcategory,Trashed, Interest, Page } from '../../../core/services/models'

import { environment } from '../../../../environments/environment'

import * as Prism from 'prismjs';

@Component({
  selector: 'app-trashed',
  templateUrl: './trashed.component.html',
  styleUrls: ['./trashed.component.css']
})
export class TrashedComponent implements OnInit {
 
  isLoading:boolean = false
  page = new Page();
 
  totalActive:any = 0
  



   //Defined records limit and records limit options
   currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
   readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
   

  //default pagination settings
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 0,
    pageSize: this.currentPageLimit
  }


  trashed = new Array<Trashed>()
   
  constructor(private interestService:InterestService, private commonUtilsService:CommonUtilsService, private categoryService:CategoryService, private titleService: TitleService, private formBuilder: FormBuilder, private angularFirestore: AngularFirestore, private storage: AngularFireStorage) { 
 
    


    this.interestService.countActive().subscribe(

      //case success
      (size) => {   
        this.totalActive = size;
    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });
  }
 

  ngOnInit() {
    

    this.titleService.setTitle();
    this.setPage(this._defaultPagination,'all');   
  }

  onSort(event) {
  
    const sort = event.sorts[0];
    this.page.sortProperty = sort.prop
    this.page.sortDirection = sort.dir   
    this.setPage(this._defaultPagination,this.page.type);    
  }
 
  onSearch(searchValue : string):void {   
    this.page.search = searchValue
    this.setPage(this._defaultPagination,this.page.type);    
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   * @param type Result type (All, Active, Archived)
  */
  setPage(page, type) {   

    this.page.type = type;
    this.page.pageNumber = page.offset;
    this.page.size = page.pageSize;
    if(page.search && page.search.length<=0){
      this.isLoading = true
    }
    
  
    
    //hit api to fetch data
    this.interestService.trashedListing(this.page).subscribe(

      //case success
      (pagedData) => {   
      console.log('pagedData',pagedData);   
      this.page = pagedData.page;
      this.trashed =  [...pagedData.data];   
      //console.log('categories',this.interests)
      this.isLoading = false
    //case error 
    },error => {
      console.log(error)
      this.commonUtilsService.onError(error);
    });
  }

/**
  * Delete a car
  * @param $item    item is car object(selected) to delete
  * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
  */
    async restore(categoryId){

      //confirm before deleting car
      if(! await this.commonUtilsService.isrestoreConfirmed()) {
        return;
      } 
     
      this.angularFirestore.collection('interests').doc(categoryId).update({
        is_trashed:''
      })     

      this.commonUtilsService.onSuccess('Interest restored.'); 
    }

    /**
  * Delete a car
  * @param $item    item is car object(selected) to delete
  * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
  */
 async delete(categoryId){

  //confirm before deleting car
  if(! await this.commonUtilsService.isDeleteConfirmed()) {
    return;
  } 

  this.angularFirestore.collection('interests').doc(categoryId).update({
    is_trashed:true
  })     

  this.commonUtilsService.onSuccess('Interest deleted'); 
}

}
