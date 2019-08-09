import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from "@angular/router";
import 'rxjs/add/operator/map'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

//import models
import { PagedData, Subcategory,  Category, Page } from "./models";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

    constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }
 
 
 
 public listing(page: Page): Observable<any> {
    
    
    return this.firestore.collection<PagedData<Category>>('categories', x => x.orderBy('created_at', 'desc')).snapshotChanges().map(data => {
    console.log('size',data.length);
      let pagedData = new PagedData<Category>();
      page.totalElements = data.length;
       data.map(object => {                
       console.log('object',object.payload.doc.data())
         pagedData.data.push(new Category(object.payload.doc));        
      });
      pagedData.page = page;
      console.log('pagedData service',pagedData)
      return pagedData;
    });
  } 

  intesrestListing(page:Page){
    
    
    return this.firestore.collection<PagedData<Subcategory>>('subcategories', x => x.orderBy('created_at', 'desc')).snapshotChanges().map(data => {
    console.log('size',data.length);
    let pagedData = new PagedData<Subcategory>();
      page.totalElements = data.length;
       data.map(object => {                
       console.log('object',object.payload.doc.data())
         pagedData.data.push(new Subcategory(object.payload.doc));        
      });
      pagedData.page = page;
      return pagedData;
    });
  }

  public allCategory(): Observable<any> {
    
    
    return this.firestore.collection<any>('categories', x => x.orderBy('created_at', 'desc')).snapshotChanges().map(data => {
    console.log('size',data.length);
    let cdata = new Array<Category>()
       data.map(object => {                
       console.log('object',object.payload.doc.data())
         cdata.push(new Category(object.payload.doc));        
      });
      
      return cdata;
    });
  }




  listSubcategory(value):Observable<any>{
    // console.log('name',value)
     return this.firestore.collection<any>('subcategories',ref => {
       return ref
         .where('category_id', '==',value)
     }).snapshotChanges().map(data => {
      // console.log('data',data)
       let cdata = new Array<Subcategory>()
          data.map(object => {                
        //  console.log('object',object.payload.doc.data())
            cdata.push(new Subcategory(object.payload.doc));        
         });
         return cdata;
   });
   }

   





  addInterest(image){
    let path = `category/subcategory/${new Date().getTime()}.jpg`;
    this.storage.ref(path).putString(image, 'data_url').then(function(snapshot) {
        console.log(snapshot.downloadURL);
    });
        
  }
  
}

