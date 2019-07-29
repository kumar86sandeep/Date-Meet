import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from "@angular/router";
import 'rxjs/add/operator/map'

//import models
import { PagedData, Car, Page } from "./models";

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private httpClient:HttpClient){}

  public listing(page: Page): Observable<PagedData<Car>> {

    return this.httpClient
      .post('cars/listing', page)
      .map((response: any) => {
    
        let pagedData = new PagedData<Car>();
      
       
        for (let i in response.records) {
            let jsonObj = response.records[i];
          
            let car = new Car(jsonObj);

            pagedData.data.push(car);
        }
        pagedData.page = page;
        return pagedData;
      })

  }
}