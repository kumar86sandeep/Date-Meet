export class Subcategory {
    id: any;   
    title: string;
    status: any;
    category: string;
    created_at: Date;
    
    image:any;
    
    constructor(object) {
        this.id = object.id;   
        this.title = object.data().title  
        this.category = object.data().category_id  
        this.status = (object.data().status)?'Active':'Inactive'     
        this.created_at = new Date(object.data().created_at) 
    
        this.image  = (object.data().image && object.data().image.length>0)?object.data().image:'assets/img/default-50x50.gif'  
      
    }
}