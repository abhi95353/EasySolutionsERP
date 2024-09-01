import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-assign-fee-to-student',
  templateUrl: './assign-fee-to-student.component.html',
  styleUrls: ['./assign-fee-to-student.component.css']
})
export class AssignFeeToStudentComponent implements OnInit {

  
  constructor(private apis:MasterAPIsServicesService) { }
  school_code:any
  exportData:any = undefined
  loaderSubmit:boolean = false
  ngOnInit(): void {
    this.localStorageUpdate()
    if (localStorage.getItem('sub_host') != 'null') {
    }
  } 

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
    }
  }

  




  submit(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderSubmit = true
        this.apis.postUpdateFee().subscribe((response:any)=>{
        this.loaderSubmit = false
    
          if(response.success){
            this.apis.showNotifications('success' , 'Success')
          }else{
            this.apis.showNotifications('error' , response.message)
          }
        })
      }
    })
 
  }


}
