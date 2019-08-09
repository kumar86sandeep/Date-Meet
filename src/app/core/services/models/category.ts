export class Category {
    id: any;   
    title: string;
    status:any;
    subcategory:any;
    created_at: Date;
  
    
    constructor(object, subcategory=[]) {
        this.id = object.id;   
        this.title = object.data().title   
        this.status = (object.data().status)?'Active':'Inactive'  
        this.created_at = new Date(object.data().created_at) 
        this.subcategory = subcategory
      
    }
}