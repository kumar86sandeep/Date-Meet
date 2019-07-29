export class Category {
    id: any;   
    title: string;
    status:any;
    created_at: Date;
  
    
    constructor(object) {
        this.id = object.id;   
        this.title = object.data().title   
        this.status = (object.data().status)?'Active':'Inactive'  
        this.created_at = new Date(object.data().created_at) 
      
      
    }
}