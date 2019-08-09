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

  @ViewChild('fileUploader') fileUploader:ElementRef;
  interestForm: FormGroup;
  isLoading:boolean = false
  isCollapsed:boolean = true
  page = new Page();
  showCropper = false;
  totalTrashed:any = 0
  categories = new Array<Category>()
  submitted:boolean = false
  imageChangedEvent: any = '';
  imageFileChanged:any = '';
    croppedImage: any = '';
    imageUrl:any = '';
    interestIdToUpdate:any = '';



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


    interests = new Array<Interest>()
    subcategories = new Array<Subcategory>()
  constructor(private authService:AuthService, private interestService:InterestService, private commonUtilsService:CommonUtilsService, private categoryService:CategoryService, private titleService: TitleService, private formBuilder: FormBuilder, private angularFirestore: AngularFirestore, private storage: AngularFireStorage) { 
 
    this.categoryService.listCategorySubcategory().subscribe(

      //case success
      (data) => {   
      console.log('listCategorySubcategory',data);   
      

    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });


    this.categoryService.allCategory().subscribe(

      //case success
      (data) => {   
      console.log('data',data);   
      
      this.categories =  [...data];   
      console.log('categories',this.categories)

    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });


    this.interestService.countTrashed().subscribe(

      //case success
      (size) => {   
        this.totalTrashed = size;
    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });
  }
 

  onSort(event) {
  
    const sort = event.sorts[0];
    this.page.sortProperty = sort.prop
    this.page.sortDirection = sort.dir   
    this.setPage(this._defaultPagination,this.page.type);    
  }
  
  onSubmit(){
    //console.log(this.interestForm.value)
    if (this.interestForm.invalid) {
      this.submitted = true
      return
    }
   // this.isCollapsed = false

    if(this.croppedImage){     
      let _this = this
      let path = `interest/${new Date().getTime()}.jpg`;
      this.interestForm.get('image').setValue(path)
      this.storage.ref(path).putString(this.croppedImage, 'data_url').then(function(snapshot) {
        //console.log(snapshot);   
        snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log("File available at", downloadURL);
          _this.saveUpdate(downloadURL)
        });     
      });
      this.croppedImage = ''
      this.showCropper = false
      this.fileUploader.nativeElement.value = null;
    }else{
      this.saveUpdate('')
    }

  }
  saveUpdate(uploadedImageUrl){
    let dataObject ={}
    if(uploadedImageUrl.length>0){
      this.interestForm.get('image').setValue(uploadedImageUrl)
      dataObject['image'] = uploadedImageUrl
    }

    dataObject['title'] = this.interestForm.get('title').value
    dataObject['category_id'] = this.interestForm.get('category_id').value
    dataObject['subcategory_id'] = this.interestForm.get('subcategory_id').value
    dataObject['is_trashed'] = this.interestForm.get('is_trashed').value
    dataObject['status'] = this.interestForm.get('status').value
    if(this.interestIdToUpdate){
      this.angularFirestore.collection('interests').doc(this.interestIdToUpdate).update(dataObject)
      this.interestIdToUpdate='';
      dataObject['updated_at'] =  new Date().getTime()  
      this.interestForm.reset();
      this.commonUtilsService.onSuccess('Interest updated'); 
    }else{ 
      dataObject['created_at'] = new Date().getTime()  
       this.angularFirestore.collection('interests').add(dataObject)
      this.interestForm.reset();
      this.commonUtilsService.onSuccess('Interest added successfully.');

      this.interestForm.reset();
      
    }
    this.isCollapsed = true
    this.interestForm.get('category_id').setValue('')
    this.subcategories=new Array<Subcategory>()
    this.interestForm.get('subcategory_id').setValue('')
    this.interestForm.get('is_trashed').setValue('')
    this.interestForm.get('status').setValue('Active')

  }
  ngOnInit() {
    this.authService.isProfileUpdated(true);//trigger loggedin observable 
    this.interestForm = this.formBuilder.group({
      category_id: ['', [Validators.required]],
      subcategory_id:['', [Validators.required]],
      title: [null, [Validators.required]],
      image:['null'],
      status:['Active'],
      is_trashed:[''],    
    });


    this.titleService.setTitle();
    this.setPage(this._defaultPagination,'all');   
  }

  listSubcategory(event){
console.log('event',event);
    this.categoryService.listSubcategory(event).subscribe(

      //case success
      (data) => {   
      console.log('data',data);   
      
      this.subcategories =  [...data];   
      console.log('subcategories',this.subcategories)

    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });
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
    
    this.isCollapsed = true
    
    //hit api to fetch data
    this.interestService.intesrestListing(this.page).subscribe(

      //case success
      (pagedData) => {   
      console.log('pagedData',pagedData);   
      this.page = pagedData.page;
      this.interests =  [...pagedData.data];   
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
    async delete(categoryId){

      //confirm before deleting car
      if(! await this.commonUtilsService.isDeleteConfirmed()) {
        return;
      } 
    
      this.angularFirestore.collection('interests').doc(categoryId).update({
        is_trashed:'trashed'
      })     

      this.commonUtilsService.onSuccess('Interest deleted'); 
    }

async populateEditForm(interest){
  await this.listSubcategory(interest.category)
  this.isCollapsed = false;
  window.scrollTo(0,document.body.scrollHeight);
    this.interestIdToUpdate = interest.id
    //this.imageUrl = interest.image
    this.interestForm.patchValue({
      title:interest.title,
      category_id:interest.category,
      subcategory_id:interest.subcategory,
      status:interest.status,
      created_at:interest.created_at,
      updated_at:new Date().getTime()
    })
  }


  fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
  
        this.croppedImage = event.base64;
       // this.imageUrl = event.base64

    }
    imageLoaded() {
        // show cropper
        this.showCropper = true;

    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

}
