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

//services
import { TitleService, CategoryService, CommonUtilsService } from '../../../core/services'

//import models
import { PagedData, Category, Subcategory, Page } from '../../../core/services/models'

import { environment } from '../../../../environments/environment'

import * as Prism from 'prismjs';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {
  @ViewChild('myTable') table: any;
  @ViewChild('fileUploader') fileUploader:ElementRef;
  interestForm: FormGroup;
  isLoading:boolean = false
  isCollapsed:boolean = true
  page = new Page();
  showCropper = false;
  categories = new Array<Category>()
  submitted:boolean = false
  imageChangedEvent: any = '';
  imageFileChanged:any = '';
  croppedImage: any = '';
  imageUrl:any = '';
  interestIdToUpdate:any = '';



   //Defined records limit and records limit options
   currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT  

  interests = new Array<Subcategory>()
  constructor(private commonUtilsService:CommonUtilsService, private categoryService:CategoryService, private titleService: TitleService, private formBuilder: FormBuilder, private angularFirestore: AngularFirestore, private storage: AngularFireStorage) { 
 
    //listing all categories
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

    //listing all subcategories
    this.categoryService.subcategoryListing().subscribe(

      //case success
      (data) => {
        
        this.interests =  [...data];   
        //console.log('companies',this.companies)
        
        //case error 
      }, error => {
      console.log(error)
      this.commonUtilsService.onError(error);
    });


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


  onSubmit(){
    if (this.interestForm.invalid) {
      this.submitted = true
      return
    }

    this.isLoading = true
    if(this.croppedImage){
      
      let _this = this
      let path = `category/subcategory/${new Date().getTime()}.jpg`;
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
    let dataObject = {};
    if(uploadedImageUrl.length>0){
      this.interestForm.get('image').setValue(uploadedImageUrl)
      dataObject['image'] = uploadedImageUrl
    }
    dataObject['title'] = this.interestForm.get('title').value
    dataObject['category_id'] =this.interestForm.get('category_id').value
    dataObject['status'] = this.interestForm.get('category_id').value
    if(this.interestIdToUpdate){
      this.angularFirestore.collection('subcategories').doc(this.interestIdToUpdate).update(dataObject)
      this.interestIdToUpdate='';
      //this.interestForm.reset();
      this.commonUtilsService.onSuccess('Subcategory updated'); 
    }else{ 
      dataObject['created_at'] = new Date().getTime()  
       this.angularFirestore.collection('subcategories').add(dataObject)
      //this.interestForm.reset();
      this.commonUtilsService.onSuccess('Subcategory added successfully.');

     // this.interestForm.reset();
      
    }
    this.isLoading = false
    this.isCollapsed = true
    this.imageUrl='';
    this.interestForm.get('category_id').setValue('')
    this.interestForm.get('title').setValue('')
    this.interestForm.get('status').setValue(true)
  }

  cancel(){   
    this.interestIdToUpdate='';
    this._initalizeAddSubcategoryForm();
    this.isLoading = false
    this.isCollapsed = true
    this.imageUrl='';
    this.interestForm.get('category_id').setValue('')
    this.interestForm.get('title').setValue('')
    this.interestForm.get('status').setValue(true)
  }

  ngOnInit() {    
    this._initalizeAddSubcategoryForm();
    this.titleService.setTitle();

  }

  private _initalizeAddSubcategoryForm(){
    this.interestForm = this.formBuilder.group({
      category_id: ['', [Validators.required]],
      title: [null, [Validators.required]],
      status:[true],
      image:['null'],
      created_at: [new Date().getTime()],
      updated_at: [new Date().getTime()]   
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
    this.angularFirestore.doc('subcategories/' + categoryId).delete(); 
    this.commonUtilsService.onSuccess('Subcategory deleted'); 
  }

populateEditForm(interest){
  this.isCollapsed = false;
    window.scroll(0,0);
    this.interestIdToUpdate = interest.id
    this.imageUrl = interest.image,
    this.interestForm.patchValue({
      title:interest.title,
      status:(interest.status=='Active')?true:false,
      category_id:interest.category,
      created_at:interest.created_at,
      updated_at:new Date().getTime()
    })
  }


  fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
   
        this.croppedImage = event.base64;
        this.imageUrl = event.base64;

    }
    imageLoaded() {
        // show cropper
        this.showCropper = true;

    }   

}
