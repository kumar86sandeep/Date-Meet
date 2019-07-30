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
import { PagedData, Company, Page } from "./models";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }
 


  companyListing(page:Page){
  

    return this.firestore.collection<PagedData<Company>>('companies', ref => {
      
      


      if(page.search.length>0 || page.filters){
        console.log('if');
        let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;     
      if (page.search.length) { query = query.where('name', '==', page.search) };
      if (page.filters.category) { query = query.where('category', '==', page.filters.category) };
      if (page.filters.status) { query = query.where('status', '==', page.filters.status) };
      if (page.filters.min_price) { query = query.where('price_for_two', '>=', page.filters.min_price) };
      if (page.filters.max_price) { query = query.where('price_for_two', '<=', page.filters.max_price) };
      console.log('query',query);
      return query;
      }else{
        console.log('else');
        return ref.orderBy(page.sortProperty, page.sortDirection)
      }
      
    }).snapshotChanges().map(data => {  
    let pagedData = new PagedData<Company>();
      page.totalElements = data.length;
       data.map(object => {                
       console.log('object',object.payload.doc.data())
         pagedData.data.push(new Company(object.payload.doc));        
      });
      
      pagedData.page = page;
      return pagedData;
    });
  }  
}

