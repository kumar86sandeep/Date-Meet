import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { adminLteConf } from './admin-lte.conf';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from 'angular-admin-lte';

//imports components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';

//import { enviornment } from '../../enviornments/enviornment'
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

//importing intercepters
import { ApiIntercepter } from './core/intercepters/api.intercepter';
import { TokenInterceptor } from './core/intercepters/token.interceptor';
import { HttpErrorInterceptor } from './core/intercepters/http-error.interceptor';


//importing services
import { CommonUtilsService } from './core/services'

//imports npms
import { ToastrModule } from 'ng6-toastr-notifications';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';


export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDcln-AfQuI0C1TzXAU37yM4wXaJUkfe20",
    authDomain: "dating-app-def07.firebaseapp.com",
    databaseURL: "https://dating-app-def07.firebaseio.com",
    projectId: "dating-app-def07",
    storageBucket: "gs://dating-app-def07.appspot.com",
    messagingSenderId: "347068593258",
    appId: "1:347068593258:web:bb3223d730b5bd55"
 }

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, 
    MaterialBarModule,
    NgxDatatableModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireDatabaseModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [ 
    CommonUtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntercepter, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
