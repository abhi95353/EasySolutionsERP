import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-update-attandance',
  templateUrl: './update-attandance.component.html',
  styleUrls: ['./update-attandance.component.css']
})
export class UpdateAttandanceComponent implements OnInit {

 
  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService , private fb:FormBuilder) { }
  studentList:any =null
  school_code:any = 'Select School' 
  search_by:any = 'account'
  classList:any = []
  classId:any = ''
  sectionId:any = ''
  session:any = ''
  sectionList:any = []
  todaydate:any
  url:any
  pageCount:any = 10
  blob:any
  searchText:any
  staffId:any = ''
  staffData:any = []
  is_sms_send:boolean = true
  csvOptions = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'Classes List',
    useBom: true,
    noDownload: false,
    headers: ["ID", "Account No", "Admission No" , "Student Name" , "Father Name" , "Mother Name" , "Gender" , 'DOB' , 'Class' , 'Section' , 'Login Mobile No']
  };
  searchType:string = 'full'

  attendanceForm = this.fb.group({
    id:[''],
    uuid:[''],
    student_attendances:this.fb.array([]),
    is_sms_send:['']
  })


get student_attendances(){
  return this.attendanceForm.get('student_attendances') as FormArray
}
// get layout() {
//   return this.createContent.get('layout') as FormArray;
// }

  ngOnInit(): void {
      this.localStorageUpdate()
  }

  showStudentAttandance(data:any){
      this.attendanceForm.reset()
    this.apis.getStudentAttendance(data).subscribe((response:any)=>{
      console.log(response)
        if(response.response != null){
          this.studentList = response.response.data
          // this.attendanceForm.patchValue({id:this.studentList.id , uuid:this.studentList.uuid})
          // for (let index = 0; index < response.response.data.student_attendances.length; index++) {
          //   const element = response.response.data.student_attendances[index];
          //   this.student_attendances.push(this.fb.group({
          //     date:element.date,
          //     id:element.id,
          //     uuid:element.uuid,
          //     name:element.student.name,
          //     f_name:element.student.f_name,
          //     roll_no:element.student.roll_no,
          //     account:element.student.account,
          //     remark:element.remark,
          //     is_absent:element.is_absent,
          //     is_halfday:element.is_halfday,
          //     is_late:element.is_late,
          //     is_leave:element.is_leave,
          //     is_present:element.is_present,
          //   }))
          // }
        }else{
          this.studentList = []
        }
        console.log(this.studentList)
    })

  }

  downloadCSV() {
    console.log(this.studentList , 'okay')
    var data = []
    for (let index = 0; index < this.studentList.length; index++) {
      const element = this.studentList[index];
      var dt:any
      dt = {
        id: element.id,
        account: element.account,
        admission_no: element.admission_no,
        student_name: element.name,
        father_name: element.f_name,
        mother_name: element.m_name,
        gender: element.gender,
        dob: element.dob,
        class: element.class,
        DIV: element.DIV,
        cred: element.cred,
      }
      data.push(dt)
      
    }
    new AngularCsv( data , "Student_list", this.csvOptions);
  }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response
    })
  }

  onSelectClass(id:any){
    if(id == 'all'){
      return
    }
    for (let index = 0; index < this.classList.length; index++) {
      const element = this.classList[index];
      if(id == element.id){
        this.apis.showSelectiveClass(element.id  , element.uuid ).subscribe((response:any)=>{
          this.sectionList = []
          this.sectionList.push(response.response)
          console.log(this.sectionList)
        })    
      }
      
    }
    
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
      this.showClass()
      this.showAllEmployee()
    }
  }


  onClickFileter(){
    var data:any = {}
    data = {
      date:this.todaydate,
      division_standard_id: this.sectionId,
      employee_id: this.staffId
    }
   console.log(data)
    this.showStudentAttandance(data)
  }


  showAllEmployee() {
    this.apis.getAllEmployee().subscribe((response: any) => {
      this.staffData = response.response;
    });
  }

  updateAttandence(id:any , value:any , type:any){
    console.log(value)
    for (let index = 0; index < this.studentList.student_attendances.length; index++) {
      const element = this.studentList.student_attendances[index]
      if(element.id == id){
        if(type == 'rmk'){
          element.remark = value
        }
        if(type == 'abs'){
          element.is_absent = value.target.checked? 1:0
          element.is_present = 0
          element.is_halfday = 0
          element.is_late = 0
          element.is_leave = 0
          element.is_holiday = 0
        }
        if(type == 'prnt'){
          element.is_present = value.target.checked? 1:0
          element.is_halfday = 0
          element.is_late = 0
          element.is_leave = 0
          element.is_absent = 0
          element.is_holiday = 0
        }
        if(type == 'hlfdy'){
          element.is_halfday = value.target.checked? 1:0
          element.is_present = 0
          element.is_late = 0
          element.is_leave = 0
          element.is_absent = 0
          element.is_holiday = 0

        }
        if(type == 'lt'){
          element.is_late = value.target.checked? 1:0
          element.is_present = 0
          element.is_halfday = 0
          element.is_leave = 0
          element.is_absent = 0
          element.is_holiday = 0
          
        }
        if(type == 'lv'){
          element.is_leave = value.target.checked? 1:0
          element.is_present = 0
          element.is_halfday = 0
          element.is_late = 0
          element.is_absent = 0
          element.is_holiday = 0

        }
        if(type == 'hd'){
          element.is_holiday = value.target.checked? 1:0
          element.is_leave = 0
          element.is_present = 0
          element.is_halfday = 0
          element.is_late = 0
          element.is_absent = 0
        }
      }
    }
    console.log(this.studentList)
  }

  markAllLeave(){
    for (let index = 0; index < this.studentList.student_attendances.length; index++) {
      const element = this.studentList.student_attendances[index]
          element.is_leave = 0
          element.is_present = 0
          element.is_halfday = 0
          element.is_late = 0
          element.is_absent = 0
          element.is_holiday = 1

    }
  }
  markAllPresent(){
    for (let index = 0; index < this.studentList.student_attendances.length; index++) {
      const element = this.studentList.student_attendances[index]
          element.is_leave = 0
          element.is_present = 1
          element.is_halfday = 0
          element.is_late = 0
          element.is_absent = 0
          element.is_holiday = 0

    }
  }


  updateAttendance(){
    this.studentList.is_sms_send = this.is_sms_send
    console.log(this.studentList.id ,  this.studentList)

    this.apis.setStudentAttendance(this.studentList.id ,  this.studentList ).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
      }
      else{
        this.apis.showNotifications('error' , response.message)

      }
    })
  }

  
}
