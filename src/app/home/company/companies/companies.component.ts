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
import { TitleService, CompanyService,  CommonUtilsService } from '../../../core/services'

//import models
import { PagedData, Company, Page } from '../../../core/services/models'

import { environment } from '../../../../environments/environment'

import * as Prism from 'prismjs';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})

export class CompaniesComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader:ElementRef;
  companyForm: FormGroup;
  dataObject:any = {}
  isLoading:boolean = false
  isCollapsed:boolean = true
  page = new Page();
  showCropper = false;
  showCoverCropper = false
  totalTrashed:any = 0
  companies = new Array<Company>()
  submitted:boolean = false
  imageChangedEvent: any = '';
  coverImageChangedEvent: any = '';
  imageFileChanged:any = '';
  croppedImage: any = '';
  croppedCoverImage:any = '';
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


  
  constructor(private companyService:CompanyService, private commonUtilsService:CommonUtilsService, private titleService: TitleService, private formBuilder: FormBuilder, private angularFirestore: AngularFirestore, private storage: AngularFireStorage) {  }
 

  
  async onSubmit(){
    //console.log(this.interestForm.value)
    if (this.companyForm.invalid) {
      this.submitted = true
      return
    }
   // this.isCollapsed = false

   if(this.croppedImage && this.croppedCoverImage){
      await this.logoImage();
      await this.saveCoverImage()
      await this.saveUpdate()
   }else if(this.croppedImage){
      await this.logoImage();
      await this.saveUpdate()
   }else if(this.croppedCoverImage){
      await this.saveCoverImage()
      await this.saveUpdate()
   }
  }
  async logoImage(){
    let _this = this
    let path = `companies/logo/${new Date().getTime()}.jpg`;
        
        await this.storage.ref(path).putString(this.croppedImage, 'data_url').then(function(snapshot) {
          //console.log(snapshot);   
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("logo available at", downloadURL);
          // _this.companyForm.get('logo').setValue(downloadURL)
           _this.dataObject['logo']     = downloadURL
           // _this.saveUpdate(downloadURL)
          });     
        });
  }
  async saveCoverImage(){
    let _this = this
    let path = `companies/cover_image/${new Date().getTime()}.jpg`;
        
    await this.storage.ref(path).putString(this.croppedCoverImage, 'data_url').then(function(snapshot) {
      //console.log(snapshot);   
      snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("Cover image available at", downloadURL);
      // _this.companyForm.get('cover_image').setValue(downloadURL) 
       _this.dataObject['cover_image']     = downloadURL      
      });     
    }); 
  }
  saveUpdate(){
  
    this.dataObject['name'] = this.companyForm.get('name').value
    this.dataObject['headline'] = this.companyForm.get('headline').value
    this.dataObject['location'] = this.companyForm.get('location').value
    this.dataObject['working_hours_from'] = this.companyForm.get('working_hours_from').value
    this.dataObject['working_hours_to'] = this.companyForm.get('working_hours_to').value
    this.dataObject['cost_for_two'] = this.companyForm.get('cost_for_two').value
    this.dataObject['website'] = this.companyForm.get('website').value
    this.dataObject['connect_instagram'] = this.companyForm.get('connect_instagram').value
    this.dataObject['connect_facebook'] = this.companyForm.get('connect_facebook').value
    this.dataObject['connect_google'] = this.companyForm.get('connect_google').value
    this.dataObject['status'] = this.companyForm.get('status').value
    this.dataObject['created_by'] = this.companyForm.get('created_by').value
    
   
    console.log('save',this.dataObject);
      this.croppedImage = ''
      this.croppedCoverImage = ''
      this.showCropper = false
      this.fileUploader.nativeElement.value = null;
    
 
    if(this.interestIdToUpdate){      
      this.dataObject['updated_at']= new Date().getTime() 
      this.angularFirestore.collection('companies').doc(this.interestIdToUpdate).update(this.dataObject)
      this.interestIdToUpdate='';   
      this.commonUtilsService.onSuccess('Company updated'); 
    }else{ 
      this.dataObject['created_at']= new Date().getTime()  
      this.dataObject['updated_at']= new Date().getTime() 
       this.angularFirestore.collection('companies').add(this.dataObject)
     
      this.commonUtilsService.onSuccess('Company added successfully.');      
    }
    this.isCollapsed = true
    this.companyForm.reset();
    this.dataObject = {}
    this.companyForm.get('created_by').setValue('admin')
    this.companyForm.get('created_by').setValue(true)

  }
  ngOnInit() {
    this.companyForm = this.formBuilder.group({     
      name: [null, [Validators.required]],
      cover_image:[null],
      logo:[null],
      headline:[null,[Validators.required]],
      location:[null,[Validators.required]],
      working_hours_from:[null,[Validators.required]],
      working_hours_to:[null,[Validators.required]],
      cost_for_two:[null,[Validators.required]],
      website:[null,[Validators.required]],
      connect_instagram:[null],
      connect_facebook:[null],
      connect_google:[null],
      status:[true], 
      created_by:['admin'],          
    });

    this.titleService.setTitle();
    this.setPage(this._defaultPagination,'all');   
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
    this.companyService.companyListing(this.page).subscribe(

      //case success
      (pagedData) => {   
      console.log('pagedData',pagedData);   
      this.page = pagedData.page;
      this.companies =  [...pagedData.data];   
      //console.log('companies',this.companies)
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
    async delete(companyId){

      //confirm before deleting car
      if(! await this.commonUtilsService.isDeleteConfirmed()) {
        return;
      } 
      this.angularFirestore.doc('companies/' + companyId).delete(); 
      this.commonUtilsService.onSuccess('Company deleted'); 

    }

 populateEditForm(company){

  this.isCollapsed = false;
  window.scrollTo(0,document.body.scrollHeight);
    this.interestIdToUpdate = company.id
    //this.imageUrl = interest.image
    console.log('company',company);
    this.companyForm.patchValue( company )
  }

  //cpver image
  coverFileChangeEvent(event: any):void{
    this.coverImageChangedEvent = event
  }
  //logo image
  fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {

      this.croppedImage = event.base64;
      // this.imageUrl = event.base64

  }
  coverImageCropped(event: ImageCroppedEvent) {

    this.croppedCoverImage = event.base64;
    // this.imageUrl = event.base64

  }
  imageLoaded() {
      // show cropper
      this.showCropper = true;

  }
  coverImageLoaded() {
    // show cropper
    this.showCoverCropper = true;

}
    

}