import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../components-services.service';
import Swal from 'sweetalert2'
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'

@Component({
  selector: 'app-academic-session',
  templateUrl: './academic-session.component.html',
  styleUrls: ['./academic-session.component.css']
})
export class AcademicSessionComponent implements OnInit {
  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService , private fb:FormBuilder) { }

  classesBoxStatus:boolean = false;
  classesBoxStatusEdit:boolean = false;
  submitStatus:boolean = false
  title:any
  schoolData:any
  id:any
  uuid:any
  school_code:any = 'Select School'
  sessionList:any
  searchText:any
  sessionForm = this.fb.group({
    session_start : [''],
    session_end : [localStorage.getItem('school_name')],
    session_start_from : ['']
  })
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'School List',
    useBom: true,
    noDownload: false,
    headers: ["S.No", "Session", "Start at", "End at"]
  };
 
  
  downloadCSV() {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    var data:any 
    data = this.sessionList
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      delete element.uuid
      delete element.deleted_at      
    }
    new AngularCsv(this.sessionList, "session_list", this.csvOptions);
  }

  ngOnInit(): void { 
    this.localStorageUpdate()
    
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') !== null){
      this.school_code = localStorage.getItem('school_code')
      this.showAllSession()

    }
  }


  addSubmit(){
    this.submitStatus = true
    var data:any = {session: '' , start_at:''}
    console.log(this.sessionForm.value.session_start)
    var session_start:any = this.sessionForm.value.session_start
    var session_end:any = this.sessionForm.value.session_end
    session_start = session_start.substring(0,4)
    session_end = session_end.substring(2,4)
    data.session = session_start+'-'+session_end
    data.start_at = this.sessionForm.value.session_start_from
    console.log(data)
    if(this.title == 'add'){
        this.apis.postSession(data).subscribe((response:any)=>{
          if(response.success){
            this.apis.showNotifications('success' , response.message)
            this.sessionForm.reset()
            this.classesBoxStatus = false

          }
        })

     
    }

    if(this.title == 'edit'){
      this.apis.updateClass(this.id , this.sessionForm.value).subscribe((response:any)=>{
      console.log(response)

      })
    }
    
  }

 
  onClickClassesBox(value:any , layout:any ,id:any , uuid?:any){
    var data:any
    data = {'value' : value , 'layout':layout , 'id':id}
    this.Session(data)
  }

  showSession(){
    this.apis.showAcademicSession().subscribe((response:any)=>{
      console.log(response);
      // this.sessionForm.setValue({
      //   class : response.response.class,
      //   school_code : localStorage.getItem('school_name'),
      //   div_count : response.response.div_count
      // })
    })
  }
  showAllSession(){
    this.apis.showAllAcademicSession().subscribe((response:any)=>{
      if(response.response != null){
        console.log(response)
        this.sessionList = response.response
      }
    })
  }
  
  


  Session(response:any){
      console.log(response)
      this.sessionForm.reset()
      this.title = response.layout
      this.classesBoxStatus = response.value
      this.id =response.id
      this.uuid =response.uuid
        if(response.layout == 'edit'){
        this.classesBoxStatusEdit = response.value
        if(response.id != null){
            // this.showSelectiveClass(response.id)
          }
        }
  }


  deleteSession(id:any , uuid:any){
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
        this.apis.deleteAcademicSession(id , uuid).subscribe((res: any) => {
        
          if (res.success) {
            icon = 'success'
            title = 'Success'
            this.showAllSession()
          } else {
            icon = 'error'
            title = 'Error'
          }
          this.apis.showNotifications(icon , res.message)
        })
      }
    })
  }

}
