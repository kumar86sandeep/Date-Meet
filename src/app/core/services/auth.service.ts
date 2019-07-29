import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from "@angular/router";
import 'rxjs/add/operator/map'
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public profileUpdatedStatus: Subject<any> = new Subject<any>();

  constructor(private firestore: AngularFirestore, public angularFireAuth: AngularFireAuth) { }

  isProfileUpdated(value: boolean) {
    this.profileUpdatedStatus.next(value);
  }
  getUpdatedProfileStatus(): Observable<any> {
    return this.profileUpdatedStatus.asObservable();
  }

  /***************************************************************************
   * Admin Auth Funtions
   *******************************************************************/ 
  async login(data) {
  
    return await this.angularFireAuth.auth.signInWithEmailAndPassword(data.email, data.password);
  }
  getAuth() { 
    return this.angularFireAuth.auth; 
  }

  getProfile(){
    let uid = firebase.auth().currentUser.uid
    return this.firestore.collection<any>('profiles/'+uid,).snapshotChanges().map(data => {
     
         return data;
      });
  }


  async logout() {
    return await this.angularFireAuth.auth.signOut();
  } 
   
}