import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-notification-category',
  templateUrl: './notification-category.component.html',
  styleUrls: ['./notification-category.component.css']
})
export class NotificationCategoryComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private fb:FormBuilder) { }
  school_code:any
  exportData:any = undefined
  loaderSubmit:boolean = false
  categoryList:any = []
  categoryForm = this.fb.group({
    name:['']
  })
  ngOnInit(): void {
    this.localStorageUpdate()
    if (localStorage.getItem('sub_host') != 'null') {
      this.showCategory()
    }
  } 

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
    }
  }

  

  showCategory(){
    this.apis.shownoticeBoardCategory().subscribe((response:any)=>{
      this.categoryList = response.response.data
      console.log(this.categoryList)
    })
  }


  delete(id:any , uuid:any){
    this.apis.notificationDelete(id , uuid).subscribe((response:any)=>{
      if(response.success){
        this.showCategory()
      this.apis.showNotifications('success' , response.message)

      }else{
      this.apis.showNotifications('error' , response.message)

      }
    })
  }



  submit(){
   this.apis.createnoticeBoardCategory(this.categoryForm.value).subscribe((response:any)=>{
    if(response.success){
      this.apis.showNotifications('success' , response.message)
      this.showCategory()

    }else{
      this.apis.showNotifications('error' , response.message)
    }
   })
 
  }

  


}
