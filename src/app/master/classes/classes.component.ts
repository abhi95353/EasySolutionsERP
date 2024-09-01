import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { ComponentsServicesService } from '../components-services.service';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  constructor( private cs:ComponentsServicesService , private apis:MasterAPIsServicesService) { }


  classes: any; 
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
      this.showClasses()
    }
    this.cs.classRefesh$.subscribe((response:any)=>{
      this.ngOnInit()
    })
  }
 
  showClasses(){
    this.apis.showAllClassAndSection().subscribe((response:any)=>{
      console.log(response)
      this.classes = response.response
    })
  }


  onClickClassesBox(value:any , layout:any ,id:any ,uuid:any){
    var data:any
    data = {'value' : value , 'layout':layout , 'id':id , 'uuid':uuid}
    this.cs.setClassesBox(data)
  }

  onClickAssignCo(id:any , uuid:any){
    var data:any
    data = {'id':id , 'uuid':uuid}
    this.cs.setCordinatorBox(data)
  }
  downloadCSV() {
    new AngularCsv(this.classes, "classes_list", this.csvOptions);
  }
  localStorageUpdate(){
    if(localStorage.getItem('sub_host') !== null){
      this.school_code = localStorage.getItem('school_code')
    }
  }
  deleteSection(id:any , uuid:any){
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
        this.apis.deleteSection(id , uuid).subscribe((res: any) => {
          console.log(id,res)
          if (res) {
            console.log(res)
            if (res) {
              icon = 'success'
              title = 'Success'
              this.showClasses()
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

  deleteClass(id:any , uuid:any){
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
        this.apis.deleteClass(id,uuid).subscribe((res: any) => {
          console.log(id,res)
          if (res) {
            console.log(res)
            if (res) {
              icon = 'success'
              title = 'Success'
              this.showClasses()
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
