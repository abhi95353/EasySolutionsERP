import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-create-staff',
  templateUrl: './create-staff.component.html',
  styleUrls: ['./create-staff.component.css']
})
export class CreateStaffComponent implements OnInit {

  constructor(private fb:FormBuilder , private apis:MasterAPIsServicesService) { }
  school_code: any = 'Select School';
  stateList:any = []
  cityList:any = []
  loadingStatus:boolean = false
  sessionList:any = []
  staffForm = this.fb.group({
    'adhaar_no' : [''],
    'account' : [''],
    'name' : [''],
    'password' : [''],
    'dob' : [''],
    'blood_group' : [''],
    'mobile_no' : [''],
    'location' : [''],
    'pincode' : [''],
    'city_id' : [''],
    'state_id' : [''],
    'salary' : [''],
    'academic_session_id' : ['']
  })
  ngOnInit(): void {
    this.localStorageUpdate()
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showState()
      this.showAcademic()
      this.school_code = localStorage.getItem('school_code');
    }
  }

  createSubject(){
    this.loadingStatus = true
    console.log(this.staffForm.value)
    this.apis.storestaff(this.staffForm.value).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , 'Success')
        this.staffForm.reset()
      }else{
        this.apis.showNotifications('error' , response.message)
      }
      this.loadingStatus = false
    })

  }

  showState() {
    this.apis.showState().subscribe((response: any) => {
      this.stateList = response.response;
    });
  }

  showCity(id: any) {
    this.apis.showCity(id).subscribe((response: any) => {
      this.cityList = response.response;
      console.log(response);
    });
  }

  showAcademic() {
    this.apis.showAcademicSession().subscribe((response: any) => {
      this.sessionList = response.response;
      console.log(response);
    });
  }




}
