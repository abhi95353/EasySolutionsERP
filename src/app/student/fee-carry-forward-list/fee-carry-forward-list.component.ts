import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-fee-carry-forward-list',
  templateUrl: './fee-carry-forward-list.component.html',
  styleUrls: ['./fee-carry-forward-list.component.css']
})
export class FeeCarryForwardListComponent implements OnInit {

  
  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService) { }
  studentList:any
  searchText:any
  school_code:any = 'Select School' 
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
    if(localStorage.getItem('sub_host') != 'null'){
      this.showSectionList()
    }
  }



  showSectionList(){
    this.apis.showSectionList().subscribe((response:any)=>{
      this.studentList = response.response
      console.log(this.studentList , 'st')
    })
  }
  downloadCSV() {
    new AngularCsv( this.studentList , "classes_list", this.csvOptions);
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
    }
  }


  search(value: any) {
    var newDataList = []
    newDataList = this.studentList
    this.studentList = []
    
    if (value.inputType.match('deleteContentBackward')) {
      this.showSectionList()
    }
    else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi')
        if (newDataList[i].stud_name.match(str)) {
          this.studentList.push(newDataList[i])
        }
      }
    }
  }


  showDetails(data:any){
    this.cs.setSecBox(data)
  }
  assignRoll(data:any){
    this.cs.setRollBox(data)
  }


  deleteRegistration(id: any) {
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
