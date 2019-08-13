import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the component destroyed

import { AngularFirestore } from '@angular/fire/firestore';

//services
import { TitleService, CategoryService, CommonUtilsService } from '../../../core/services'

//import models
import { PagedData, Category, Page } from '../../../core/services/models'

import { environment } from '../../../../environments/environment'

import * as Prism from 'prismjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @ViewChild('myTable') table: any;
  page = new Page();
  isLoading:boolean = false
  isCollapsed:boolean = true
  	categories = new Array<Category>()

  	addCategoryForm: FormGroup;
  	submitted:boolean = false

  	categoryIdToUpdate = '';

   //Defined records limit and records limit options
   currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
   readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  

  
  constructor(private commonUtilsService:CommonUtilsService, private categoryService:CategoryService, private titleService: TitleService, private formBuilder: FormBuilder, private angularFirestore: AngularFirestore) { }

  ngOnInit() {
  	this._initalizeAddCategoryForm()
  	//setting the page title
    this.titleService.setTitle();


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
    
  	
  }
  private _initalizeAddCategoryForm(){
  	this.addCategoryForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      status:[true],
      /*created_at: [new Date().getTime()],
      updated_at: [new Date().getTime()]  */     
    });
  }
  

  /**
    * search
    * @param event    search item event    
  */

 onSearch(event) {
  const val = event.target.value.toLowerCase();

  // filter our data
  const temp = this.categories.filter(function(d) {
    return d.title.toLowerCase().indexOf(val) !== -1 || !val;
  });

  // update the rows
  this.categories = temp;
  // Whenever the filter changes, always go back to the first page
  this.table.offset = 0;
}

  onAddCategory(){
  	if (this.addCategoryForm.invalid) {
      this.submitted = true
      return
    }
    if(this.categoryIdToUpdate){
    	this.angularFirestore.collection('categories').doc(this.categoryIdToUpdate).update({
        title:this.addCategoryForm.get('title').value,
        status:this.addCategoryForm.get('status').value,
        
      })
    	this.categoryIdToUpdate='';
    	//this.addCategoryForm.reset();
    	this.commonUtilsService.onSuccess('Category updated'); 
    }else{
    	this.angularFirestore.collection('categories').add({
        title:this.addCategoryForm.get('title').value,
        status:this.addCategoryForm.get('status').value  ,
        created_at:new Date().getTime()    
      })
    //	this.addCategoryForm.reset();
    	this.commonUtilsService.onSuccess('Category added'); 
    }
    this.isCollapsed = true
    this._initalizeAddCategoryForm()

    this.addCategoryForm.get('title').setValue('')
    this.addCategoryForm.get('status').setValue(true)  
    
  }

  cancel(){
    
    
    this._initalizeAddCategoryForm()
    this.isCollapsed = true
    this.addCategoryForm.get('title').setValue('')
    this.addCategoryForm.get('status').setValue(true) 
    this.categoryIdToUpdate='';
  }

  populateEditForm(category){
    this.isCollapsed = false
  	this.categoryIdToUpdate = category.id
  	this.addCategoryForm.patchValue({
      title:category.title,
      status:(category.status=='Active')?true:false  	
  	})
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
      this.angularFirestore.doc('categories/' + categoryId).delete(); 
      this.commonUtilsService.onSuccess('Category deleted'); 
    }  
}
