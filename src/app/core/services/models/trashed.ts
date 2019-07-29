export class Trashed {
    id: any;   
    title: string;
    image:any;
    category:any;
    subcategory:any;
    status:any;
    is_trashed:any;
    created_at: Date;
    updated_at:Date;
    
    constructor(object) {
        this.id = object.id;   
        this.title = object.data().title
        this.image = (object.data().image!="null" && object.data().image!=null && object.data().image.length>0)?object.data().image:'assets/img/defaults/default-50x50.gif'   
        this.category =   object.data().category_id
        this.subcategory =   object.data().subcategory_id
        this.status = (object.data().status)  
        this.is_trashed = object.data().is_trashed
        this.created_at = new Date(object.data().created_at) 
        this.updated_at  = new Date(object.data().updated_at)
      
    }
}