import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.css']
})
export class RegistrationListComponent implements OnInit {
  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService) { }
  studentList:any = []
  school_code:any = 'Select School' 
  search_by:any = 'reg_no'
  searchText:any
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Classes List',
    useBom: true,
    noDownload: false,
    headers: ["ID", "Classes", "Number Of Section"]
  }; 
  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  })
  ngOnInit(): void {
    this.localStorageUpdate()
  }

  showRegistration(){
    this.apis.showStudentRegistration().subscribe((response:any)=>{
      console.log(response)
      this.studentList = response.response
    })
  }
  downloadCSV() {
    new AngularCsv( this.studentList , "classes_list", this.csvOptions);
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') !== null){
      this.school_code = localStorage.getItem('school_code')
      this.showRegistration()
    }
  }


  search(value: any) {
    var newDataList = []
    newDataList = this.studentList
    this.studentList = []
    console.log(this.search_by)
    if (value.inputType.match('deleteContentBackward')) {
      this.showRegistration()
    }
    else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi')
        if(this.search_by == 'reg_no'){
          if (newDataList[i].reg_no.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        if(this.search_by == 'name'){
          if (newDataList[i].name.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        if(this.search_by == 'f_name'){
          if (newDataList[i].f_name.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        if(this.search_by == 'mobile_no'){
          if (newDataList[i].mobile_no.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        
      }
    }
  }


  showDetails(data:any){
    this.cs.setRegBox(data)
  }



  deleteRegistration(id: any , uuid:any) {
    var icon: any
    var title: any
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apis.deleteStudentRegistration(id).subscribe((res: any) => {
          console.log(id,res)
          if (res) {
            console.log(res)
            if (res) {
              icon = 'success'
              title = 'Success'
              this.showRegistration()
            } else {
              icon = 'error'
              title = 'Error'
            }
            this.Toast.fire({
              icon: icon,
              title: title
            })
          }
        })
      }
    })

  }

 
}
