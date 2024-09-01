import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';

@Component({
  selector: 'app-manage-notic',
  templateUrl: './manage-notic.component.html',
  styleUrls: ['./manage-notic.component.css']
})
export class ManageNoticComponent implements OnInit {

  
  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService , private fb:FormBuilder) { }
  school_code: any = 'Select School';
  noticeList:any = []
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
      this.showNotice()
    })
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showNotice()
      this.school_code = localStorage.getItem('school_code');
      this.imgUrl = localStorage.getItem('base_url')
    }
  }

  showNotice(){
    this.apis.shownoticeBoard().subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.noticeList = response.response.data
        console.log(this.noticeList)
      }
    })
  }

  openNoticeBox(data:any , action:any){
    if(action == 'update'){
      console.log(data)
      data.action = 'Update'
      this.cs.setNoticeBox(data)
    }
    if(action == 'add'){
      var data:any = {}
      data.action = 'Add'
      console.log(data)
      this.cs.setNoticeBox(data)
    }
    
  }



  updateNoticeApprove(id:any , uuid:any , value:any){
    var data:any
    data = {is_approved : value}
    this.apis.updateNoticeBoard(id ,uuid, data).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success'  , response.message)
        this.noticeForm.reset()
        this.cs.refreshNoticsBox(true)
        this.showNotice()
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }

}
 