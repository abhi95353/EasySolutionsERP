import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-student-leave',
  templateUrl: './student-leave.component.html',
  styleUrls: ['./student-leave.component.css']
})
export class StudentLeaveComponent implements OnInit {

  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService
  ) {}
  school_code: any = 'Select School';
  studentData: any = [];
  roleData: any = [];
  readMore = false;
  viewId: any = null;
  searchText:any
  ngOnInit(): void {
    this.localStorageUpdate();
    this.cs.roleAssignBoxUpdate$.subscribe((response:any)=>{
      if(response){
        this.showStudentLeave()
      }
    }) 
  } 

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showStudentLeave()
      this.school_code = localStorage.getItem('school_code');
    }
  }

  showStudentLeave() {
    this.apis.getStudentLeave().subscribe((response: any) => {
      console.log(response)
      this.studentData = response.response;
    });
  }


  readMoreFun(value: any, id: any) {
    this.readMore = value;
    this.viewId = id;
    if (value == false) {
      this.viewId = null;
    }
  }

  
updateSTudentLeave(id:any , uuid:any , value:any){
  let data:any = {
    uuid:uuid,
    is_approved:value
  } 
  this.apis.updateStudentLeave(id , data).subscribe((response:any)=>{
    if(response.success){
      this.apis.showNotifications('success' , response.message)
      this.showStudentLeave()
    }else{
      this.apis.showNotifications('error' , response.message)

    }
  })
}
 

 

 


  
  search(value: any) {
    var arrylist:any = []
    var newDataList = {'count' : '' , 'data' : arrylist}
    newDataList.data = this.studentData.data
    this.studentData.data = []
    
    if (value.inputType.match('deleteContentBackward')) {
      this.showStudentLeave()
    }
    else {
      for (let i = 0; i < newDataList.data.length; i++) {
        var str = new RegExp(value.data, 'gi')
          if (newDataList.data[i].name.match(str)) {
            this.studentData.data.push(newDataList.data[i])
          }
      
      }
    }
  }

}
