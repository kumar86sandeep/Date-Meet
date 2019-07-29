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
import { PagedData, Interest,Trashed, Page } from "./models";

@Injectable({
  providedIn: 'root'
})
export class InterestService {

    constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }
 


  intesrestListing(page:Page){
  
    console.log('page',page)
    return this.firestore.collection<PagedData<Interest>>('interests', ref => {
      if(page.search.length>0){
        return ref
        .where("title",'==',page.search).where("is_trashed",'==','').orderBy(page.sortProperty, page.sortDirection)
      }else{
        return ref
        .where("is_trashed",'==','').orderBy(page.sortProperty, page.sortDirection)
      }
      
    }).snapshotChanges().map(data => {  
    let pagedData = new PagedData<Interest>();
      page.totalElements = data.length;
       data.map(object => {                
       console.log('object',object.payload.doc.data())
         pagedData.data.push(new Interest(object.payload.doc));        
      });
      
      pagedData.page = page;
      return pagedData;
    });
  }

  trashedListing(page:Page){
  
    console.log('page',page)
    return this.firestore.collection('interests', ref => {
      if(page.search.length>0){
        return ref
        .where("title",'==',page.search).where("is_trashed",'==','trashed').orderBy(page.sortProperty, page.sortDirection)
      }else{
        return ref
        .where("is_trashed",'==','trashed').orderBy(page.sortProperty, page.sortDirection)
      }
      
    }).snapshotChanges().map(newdata => {  
      console.log('newdata',newdata)
      let pagedData = new PagedData<Interest>();
        page.totalElements = newdata.length;
        newdata.map(object => {                
         console.log('object',object.payload.doc.data())
           pagedData.data.push(new Interest(object.payload.doc));        
        });
        
        pagedData.page = page;
        return pagedData;
      });

    
  }

  countTrashed(){
    return this.firestore.collection<any>('interests', ref => {
      return ref
      .where("is_trashed",'==','trashed')
      
    }).snapshotChanges().map(data => {        
      return data.length;
    });
  }

  countActive(){
    return this.firestore.collection<any>('interests', ref => {
      return ref
      .where("is_trashed",'==','')
      
    }).snapshotChanges().map(data => {        
      return data.length;
    });
  }

  



  addInterest(image){
  let path = `category/subcategory/${new Date().getTime()}.jpg`;
  this.storage.ref(path).putString(image, 'data_url').then(function(snapshot) {
      console.log(snapshot.downloadURL);
});
        
  }
}

