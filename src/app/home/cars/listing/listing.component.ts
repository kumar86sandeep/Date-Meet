import { Component, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';

//import services
import { CarService, CommonUtilsService} from "../../../core/services";
//import models
import { PagedData, Car, Page } from "../../../core/services/models";

import { environment } from '../../../../environments/environment'

import * as Prism from 'prismjs';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements AfterViewInit {
  @ViewChild('myTable') table: any;
  expanded: any = {};
  page = new Page();
  cars = new Array<Car>()

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

  constructor(private carService:CarService, private commonUtilsService:CommonUtilsService) { 
    //fetching the data with default settings
    this.setPage(this._defaultPagination,'all');
  }
  ngAfterViewInit() {
    Prism.highlightAll();
  }

  ngOnInit() {
  }

  onPage(event){

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

    
    //hit api to fetch data
    this.carService.listing(this.page).subscribe(

      //case success
      (pagedData) => {      
      
      this.page = pagedData.page;
     
      //this.cars =  pagedData.data; 
      this.cars =  [...pagedData.data];   
      console.log('Rows',this.cars);  
     // this.commonUtilsService.hidePageLoader();
    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

}
