import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  constructor(private fb:FormBuilder , private apis:MasterAPIsServicesService) { }
  school_code: any = 'Select School';
  loadingStatus:boolean = false
  staffData:any
  resetForm = this.fb.group({
    'username' : [''],
    'oldPassword' : [''],
    'password' : [''],
  })

  resetpassword = this.fb.group({
    'id' : [''],
    'uuid' : [''],
    'password' : [''],
  })

  ngOnInit(): void {
    this.localStorageUpdate()
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code');
      this.showAllEmployee()
    }
  }

  reset(){
    this.loadingStatus = true
    console.log(this.resetForm.value)
    var id = localStorage.getItem('id')
    this.apis.passwordReset(this.resetForm.value).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , 'Success')
        this.resetForm.reset()
      }else{
        this.apis.showNotifications('error' , response.message)
      }
      this.loadingStatus = false
    })

  }

  showAllEmployee() {
    this.apis.getAllEmployee().subscribe((response: any) => {
      console.log(response)
      this.staffData = response.response.data;
    });
  }

  onChange(dt:any){
    dt = JSON.parse(dt)
    console.log(dt)
    this.resetpassword.patchValue({
      id:dt.id,
      uuid:dt.uuid
    })
  }

  resetpasswordFun(){
    this.loadingStatus = true
    console.log(this.resetpassword.value)
    this.apis.passwordResetFull(this.resetpassword.value).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , 'Success')
        this.resetForm.reset()
      }else{
        this.apis.showNotifications('error' , response.message)
      }
      this.loadingStatus = false
    })

  }


}
