export const adminLteConf = {
  skin: 'blue',
  // isSidebarLeftCollapsed: false,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  // isSidebarLeftMini: true,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  // layout: 'normal',
  sidebarLeftMenu: [
   // { label: 'Dashboard', iconClasses: 'fa fa-th-list', route: 'admin/interest' },
    { label: 'MAIN NAVIGATION', separator: true },
    {label: 'Dashboard', route: 'admin/interest', iconClasses: 'fa fa-th-list'},
    
    {
      label: 'Interests', iconClasses: 'fa fa-th-list', children: [   
        { label: 'Interests Listing', route: 'admin/interest' },    
        { label: 'Categories', route: 'admin/category' },
        { label: 'Subcategories', route: 'admin/category/subcategory-listing' }     
      ],
    },
    {
      label: 'Company', iconClasses: 'fa fa-th-list', children: [   
        { label: 'Company Listing', route: 'admin/company' },    
             
      ],
    },

    /*{
      label: 'Category Listing', iconClasses: 'fa fa-th-list', children: [       
        { label: 'Categories', route: 'admin/category' },
        { label: 'Subcategories', route: 'admin/category/subcategory-listing' },     
      ]
    },
    {
      label: 'Company Listing', iconClasses: 'fa fa-th-list', children: [       
        { label: 'Companies', route: 'admin/company' },
        { label: 'Favourites', route: 'admin/company/favourite-listing' },     
        { label: 'Events', route: 'admin/company/event-listing' },     
      ]
    },
    {
      label: 'User Listing', iconClasses: 'fa fa-th-list', children: [
        { label: 'Listing', route: 'admin/user' },              
      ]
    },
    { label: 'COMPONENTS', separator: true },
    { label: 'Accordion', route: 'accordion', iconClasses: 'fa fa-tasks' },
    { label: 'Alert', route: 'alert', iconClasses: 'fa fa-exclamation-triangle' },
    {
      label: 'Boxs', iconClasses: 'fa fa-files-o', children: [
        { label: 'Default Box', route: 'boxs/box' },
        { label: 'Info Box', route: 'boxs/info-box' },
        { label: 'Small Box', route: 'boxs/small-box' }
      ]
    },
    { label: 'Dropdown', route: 'dropdown', iconClasses: 'fa fa-arrows-v' },
    {
      label: 'Form', iconClasses: 'fa fa-files-o', children: [
        { label: 'Input Text', route: 'form/input-text' }
      ]
    },
    { label: 'Tabs', route: 'tabs', iconClasses: 'fa fa-th' }*/
  ]
};
