import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from '../apis/master-apis-services.service';
import { ComponentsServicesService } from '../master/components-services.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.css']
})
export class DownloadCenterComponent implements OnInit {

  
  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService , private fb:FormBuilder) { }
  school_code: any = 'Select School';
  downloadCenterList:any = []
  imgUrl:any
  searchText:any =''
  noticeForm = this.fb.group({
    searchText2:[''],
    head:[''],
    body:[''],
    image:[''],
    noticable_type:['Admin'],
    to_admin: [''],
    to_student: [''],
    to_parent: this.fb.array([]),
    to_employee: [''],
    to_standard: this.fb.array([]),
    to_division_standard:[''],
    to_admin_data: this.fb.array([]),
    to_student_data: this.fb.array([]),
    to_parent_data: this.fb.array([]),
    to_employee_data: this.fb.array([]),
    to_standard_data: this.fb.array([]),
    to_division_standard_data: this.fb.array([]),
    notice_category_id: [''],
    student:[false],
    parent:[false],
    staff:[false],
    admin:[false]
  })
  ngOnInit(): void {
    this.localStorageUpdate()
    this.cs.refreshNoticeBox$.subscribe((res:any)=>{
      this.showDownloadCenter()
    })
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showDownloadCenter()
      this.school_code = localStorage.getItem('school_code');
      this.imgUrl = localStorage.getItem('base_url')
    }
  }

  showDownloadCenter(){
    this.apis.getDownloadCenterList().subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.downloadCenterList = response.response.data
        console.log(this.downloadCenterList)
      }
    })
  }

  openDownloadCenterBox(data:any , action:any){
      var data:any = {}
      data.action = 'Add'
      this.cs.setDownloadCenterBox(data)
  }



  delete(id:any , uuid:any){
    this.apis.deleteDownloadCenter(id , uuid).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.showDownloadCenter()
        return
      }
      this.apis.showNotifications('error' , response.message)

    })
  }

}
 