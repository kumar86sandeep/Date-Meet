import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, throwError } from 'rxjs';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/map";
import { AmazingTimePickerService } from 'amazing-time-picker'; // this line you need

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { Options, LabelType, ChangeContext } from 'ng5-slider';


import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireDatabase } from '@angular/fire/database';

//services
import { TitleService, CategoryService, CompanyService, CommonUtilsService } from '../../../core/services'

//import models
import { PagedData, Category, Subcategory, Company, Page } from '../../../core/services/models'

import { environment } from '../../../../environments/environment'

import * as Prism from 'prismjs';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})

export class CompaniesComponent implements OnInit {
  @ViewChild('myTable') table: any;
  @ViewChild('fileUploader') fileUploader: ElementRef;
  minValue: number = 10;
  maxValue: number = 19000;
  options: Options = {
    floor: 0,
    ceil: 20000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> $' + value;
        case LabelType.High:
          return '<b>Max price:</b> $' + value;
        default:
          return '$' + value;
      }
    }
  };

  companyForm: FormGroup;
  filterForm: FormGroup;
  searchForm: FormGroup;
  dataObject: any = {}
  isLoading: boolean = false
  isCollapsed: boolean = true
  page = new Page();
  showCropper = false;
  showCoverCropper = false
  totalTrashed: any = 0
  companies = new Array<Company>()
  categories = new Array<Category>()
  subcategories = new Array<Subcategory>()
  submitted: boolean = false
  imageChangedEvent: any = '';
  coverImageChangedEvent: any = '';
  imageFileChanged: any = '';
  croppedImage: any = '';
  croppedCoverImage: any = '';
  imageUrl: any = '';
  interestIdToUpdate: any = '';



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



  constructor(private atp: AmazingTimePickerService, private categoryService: CategoryService, private companyService: CompanyService, private commonUtilsService: CommonUtilsService, private titleService: TitleService, private formBuilder: FormBuilder, private angularFirestore: AngularFirestore, private storage: AngularFireStorage) {
    this.categoryService.allCategory().subscribe(

      //case success
      (data) => {
        console.log('data', data);

        this.categories = [...data];
        console.log('categories', this.categories)

        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
      });
  }

  

  listSubcategory(event) {

    this.categoryService.listSubcategory(event).subscribe(

      //case success
      (data) => {
        console.log('data', data);

        this.subcategories = [...data];
        console.log('subcategories', this.subcategories)

        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
      });
  }


  async onSubmit() {
    //console.log(this.interestForm.value)
    if (this.companyForm.invalid) {
      this.submitted = true
      return
    }
    

    let _this = this
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
    this.dataObject['category_id'] = this.companyForm.get('category_id').value
    this.dataObject['subcategory_id'] = this.companyForm.get('subcategory_id').value   

   
    if (this.interestIdToUpdate) {
       //update operation
      this.dataObject['updated_at'] = new Date().getTime()
      this.angularFirestore.collection('companies').doc(this.interestIdToUpdate).update(this.dataObject).then(async function (snapshot) {
        await _this.uploadImage(_this.interestIdToUpdate)   
        _this.commonUtilsService.onSuccess('Company updated');    
        _this.initResetForm();     
      })
      
      
    } else {
      //isert operation
      this.dataObject['created_at'] = new Date().getTime()
      this.dataObject['updated_at'] = new Date().getTime()
      this.angularFirestore.collection('companies').add(this.dataObject).then(async function (snapshot) {
        await _this.uploadImage(_this.interestIdToUpdate)            
        _this.commonUtilsService.onSuccess('Company added successfully.');
        _this.initResetForm();
      })      
    }
      

  }
  async uploadImage(id) {
    let _this = this
    if (_this.croppedImage) {
      let path = `companies/logo/${new Date().getTime()}.jpg`;
      await this.storage.ref(path).putString(this.croppedImage, 'data_url').then(function (snapshot) { 
        snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("logo available at", downloadURL);   
          console.log('doc id',id);      
          _this.angularFirestore.collection('companies').doc(id).update({
            logo: downloadURL
          })
        });
      });
      
    }
    if (_this.croppedCoverImage) {
      let path = `companies/cover_image/${new Date().getTime()}.jpg`;

      await this.storage.ref(path).putString(this.croppedCoverImage, 'data_url').then(function (snapshot) {
    
        snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("Cover image available at", downloadURL); 
          console.log('doc id',id);         
          _this.angularFirestore.collection('companies').doc(id).update({
            cover_image: downloadURL
          })
        });
      });
      
    }    
  }
 
  cancel(){    
    this.interestIdToUpdate = ''
    this.initResetForm()
  }
  private initFilterForm(){
    this.filterForm = this.formBuilder.group({
      category: [''],
      status: [''],
      min_price: [null],
      max_price: [null],
      date_from:[null],
      date_to: [null]
    })
  }

  private initResetForm(){
    this.croppedImage = ''
    this.croppedCoverImage = ''
    this.showCropper = false
    this.fileUploader.nativeElement.value = null;
    this.isCollapsed = true
    this.companyForm.reset();
    this.dataObject = {}
    this.companyForm.get('created_by').setValue('admin')
    this.companyForm.get('status').setValue(true)
    this.companyForm.get('category_id').setValue('')
    this.subcategories = new Array<Subcategory>()
    this.companyForm.get('subcategory_id').setValue('')
  }
  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: [null]
    });

    this.initSearchForm();
    this.initCompanyForm();
    this.initFilterForm();

    this.titleService.setTitle();

    this.setPage(this._defaultPagination, 'all');
  }

  private initCompanyForm() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.companyForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      cover_image: [null],
      logo: [null],
      headline: [null, [Validators.required]],
      about: [null, [Validators.required]],
      category_id: ['', [Validators.required]],
      subcategory_id: ['', [Validators.required]],
      working_days: [null, [Validators.required, Validators.max(7), Validators.min(1)]],
      working_hours_from: [null, [Validators.required]],
      working_hours_to: [null, [Validators.required]],
      address: [null, [Validators.required]],
      website: [null, [Validators.required, Validators.pattern(reg)]],
      connect_instagram: [null,[Validators.pattern(reg)]],
      connect_facebook: [null,[Validators.pattern(reg)]],
      connect_google: [null,[Validators.pattern(reg)]],
      status: [true],
      created_by: ['admin'],
    });
  }

  private initSearchForm() {
    let searchFormControl = this.searchForm.get('search')
    searchFormControl.valueChanges.debounceTime(1000).subscribe((search) => {
      this.page.search = search
      this.setPage(this._defaultPagination, 'all');
    })
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
    if (page.search && page.search.length <= 0) {
      this.isLoading = true
    }

    this.isCollapsed = true

    //hit api to fetch data
    this.companyService.companyListing(this.page).subscribe(

      //case success
      (pagedData) => {
        console.log('pagedData', pagedData);
        this.page = pagedData.page;
        this.companies = [...pagedData.data];
        //console.log('companies',this.companies)
        this.isLoading = false
        //case error 
      }, error => {
        console.log(error)
        this.commonUtilsService.onError(error);
      });
  }

  /**
    * Delete a car
    * @param $item    item is car object(selected) to delete
    * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
    */
  async delete(companyId) {

    //confirm before deleting car
    if (! await this.commonUtilsService.isDeleteConfirmed()) {
      return;
    }
    this.angularFirestore.doc('companies/' + companyId).delete();
    this.commonUtilsService.onSuccess('Company deleted');

  }

  async populateEditForm(company) {
    await this.listSubcategory(company.category_id)
    this.isCollapsed = false;
    window.scrollTo(0, document.body.scrollHeight);
    this.interestIdToUpdate = company.id
    //this.imageUrl = interest.image
    console.log('company', company);
    this.companyForm.patchValue(company)
  }

  //cpver image
  coverFileChangeEvent(event: any): void {
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
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  /**
     * download the list of all purchases in csv
     */
  downloadCsv() {

    if (this.companies.length == 0)
      return

    var options = {
      fieldSeparator: ',',
      showLabels: true,
      showTitle: false,
      title: 'Company List',
      useBom: true,
      headers: ["Name", "Category" ,"Sub-category","Location", "Cost for two", "Status", "created on"]
    };

    let data = [];
    //iterate purchase list and make custom data
    this.companies.forEach(company => {
      let purchaseObj = {
        name: company.name,
        category_id: company.category_id,
        subcategory_id: company.subcategory_id,
        location: company.location,
        cost_for_two: company.cost_for_two,
        status: (company.status)?'Active':'Inactive',
        created_at: company.created_at,
      };
      data.push(purchaseObj);
    });
    console.log(data);
    //pass data and options to download csv
    new Angular5Csv(data, 'Company List', options);
  }

  priceChange(changeContext: ChangeContext){
    this.filterForm.get('min_price').setValue(changeContext.value)
    this.filterForm.get('max_price').setValue(changeContext.highValue)
    //console.log(changeContext.value,changeContext.highValue);    
  }

  applyFilters(){
    
    this.page.filters = this.filterForm.value
    console.log('filters',this.page.filters )
    this.setPage(this._defaultPagination, 'all');
  }


}
