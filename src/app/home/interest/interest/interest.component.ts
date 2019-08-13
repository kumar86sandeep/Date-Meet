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
import { TitleService, AuthService, CategoryService, InterestService, CommonUtilsService } from '../../../core/services'

//import models
import { PagedData, Category, Subcategory, Interest, Page } from '../../../core/services/models'

import { environment } from '../../../../environments/environment'

import * as Prism from 'prismjs';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {
  @ViewChild('myTable') table: any;
  @ViewChild('fileUploader') fileUploader: ElementRef;
  interestForm: FormGroup;
  isLoading: boolean = false
  isCollapsed: boolean = true
  page = new Page();
  showCropper = false;
  totalTrashed: any = 0
  categories = new Array<Category>()
  submitted: boolean = false
  imageChangedEvent: any = '';
  imageFileChanged: any = '';
  croppedImage: any = '';
  imageUrl: any = '';
  interestIdToUpdate: any = '';



  //Defined records limit and records limit options
  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
  

  

  interests = new Array<any>() 
  subcat:any = [];
  constructor(private categoryService:CategoryService, private angularFirestore: AngularFirestore, private commonUtilsService: CommonUtilsService) {
  }

  ngOnInit(){
    this.isLoading = true
    //hit api to fetch data
    this.categoryService.interestListing().subscribe(

      //case success
      (pagedData) => {
        
        this.interests = [...pagedData];
        console.log('interests',this.interests)
        this.interests.forEach(cat => {                         
          this.listSubcategory(cat.title)
        })
        this.isLoading = false
    
        //case error 
      }, error => {
        console.log(error)
        this.isLoading = false
        this.commonUtilsService.onError(error);
      });
  }

  listSubcategory(category){
      //hit api to fetch data
    this.categoryService.subcategory(category).subscribe(

      //case success
      (str) => {
        
        this.subcat[category] = str;
        //console.log('companies',this.companies)
        
        //case error 
      }, error => {
        console.log(error)
        this.commonUtilsService.onError(error);
      });
  }
  /*listCategorySubcategory() {


    this.angularFirestore.collection<any>('categories').ref
      .get()
      .then(res => {
        if (res.docs.length > 0) {
          //you got some documents
          let catSucatArr = []
          res.forEach(category => {
           
            this.angularFirestore.collection<any>('subcategories').ref.where('category_id', '==', category.data().title)
              .get()
              .then(subcatres => {

                let subcatArr:any = []
                subcatres.forEach(subcat => {             
                  subcatArr.push(subcat.data().title)
                })
                catSucatArr.push(new Category(category, subcatArr.join(',') ))
              })

          })
          this.interests = catSucatArr;
        } else {          
          //no documents found

        }
      }).catch(err => {
        console.log('something went wrong ' + err)
      });
  }*/


  /**
    * Delete a car
    * @param $item    item is car object(selected) to delete
    * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
    */
  async delete(categoryId) {

    //confirm before deleting car
  if(! await this.commonUtilsService.isDeleteConfirmed()) {
    return;
  } 

  this.angularFirestore.doc('categories/' + categoryId).delete();  

  this.commonUtilsService.onSuccess('Interest deleted'); 
  }

  /**
    * search
    * @param event    search item event    
  */

  onSearch(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.interests.filter(function(d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.interests = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
