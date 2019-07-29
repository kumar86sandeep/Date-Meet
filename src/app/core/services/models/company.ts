export class Company {
    id: any;   
    name: string;
    cover_image:any;
    logo:any;
    headline:any;
    location:any;
    working_hours_from:any;
    working_hours_to:any;
    cost_for_two:any
    website:any
    connect_instagram:any
    connect_facebook:any
    connect_google:any
    status:any
    created_by:any
    created_at: Date;
    updated_at:Date;
    
    constructor(object) {
        this.id = object.id;   
        this.name = object.data().name
        this.cover_image = (object.data().cover_image!="null" && object.data().cover_image!=null && object.data().cover_image.length>0)?object.data().cover_image:'assets/img/defaults/default-50x50.gif'   
        this.logo = (object.data().logo!="null" && object.data().logo!=null && object.data().logo.length>0)?object.data().logo:'assets/img/defaults/default-50x50.gif'   
        this.headline =   object.data().headline
        this.location =   object.data().location
        this.working_hours_from =   object.data().working_hours_from
        this.working_hours_to =   object.data().working_hours_to
        this.cost_for_two =   object.data().cost_for_two
        this.website =   object.data().website
        this.connect_instagram =   object.data().connect_instagram
        this.connect_facebook =   object.data().connect_facebook
        this.connect_google =   object.data().connect_google
        this.status = (object.data().status)  
        this.created_by = object.data().created_by
        this.created_at = new Date(object.data().created_at) 
        this.updated_at  = new Date(object.data().updated_at)
      
    }
}