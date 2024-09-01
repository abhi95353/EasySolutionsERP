import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
@Component({
  selector: 'app-certificate-component',
  templateUrl: './certificate-component.component.html',
  styleUrls: ['./certificate-component.component.css']
})
export class CertificateComponentComponent implements OnInit {
  submitStatus: boolean = false
  tagName: any = 'Account No';
  searchType:string = 'full'
  univeralStudentData:any  
  searchText:any

  school_code: any = 'Select School' 
  classList: any = []
  studentData:any=[]
  facilityList:any=[]
  accountNo:number
  studentDataList:any = []
  searchBy:any = 'account'
  hintBox:boolean = false
  admissionNo:any
  certificateType:any = "character"
  studentName:any
  fatherName:any
  studentClass:any
  studentDate:any
  studentMobileNo:any
  studentAddress:any
  studentDOB:any
  motherName:any
  student_accountNo:any
  DTY:any
  PMF:any
  AOP:any
  WA:any
  FD:any
  TD:any
  constructor(private apis: MasterAPIsServicesService , private cs:ComponentsServicesService) { }


  ngOnInit(): void {
    this.localStorageUpdate()
  }
  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
      this.showAllStudent()
    }
  }


 
  onClickPdf(formName:any , data_type:any , is_teacher:any){
    var data:any = {}
    var student_data:any = {}
    console.log(formName , 'FN')
    student_data = {
                    name : this.studentName , 
                    father_name : this.fatherName,
                    class : this.studentClass,
                    session: this.studentDate,
                    mobile_no : this.studentMobileNo,
                    location : this.studentAddress,
                    dob : this.studentDOB,
                    mother_name: this.motherName,
                    student_accountNo:this.student_accountNo,
                    DTY: this.DTY,
                    PMF:this.PMF,
                    AOP:this.AOP,
                    WA:this.WA,
                    TD:this.FD,
                    FD:this.TD

                  }
    data = {'account': this.admissionNo , 'form':formName , 'data_type' : data_type , student_data:student_data , is_teacher:is_teacher}
    console.log(data)
    this.cs.cetificateDownload(data)
  }


  showAllStudent(){
    this.apis.allStudentList().subscribe((response:any)=>{
      this.studentDataList = response.response.data
    })
  } 
  
    focusIn(){
    this.hintBox = true;
  }


  onChangeBox(account: any) {
    this.admissionNo = account;
    this.searchText = account
    console.log(this.admissionNo , 'click box')
    setTimeout(() => {
      this.hintBox = false;
    }, 500);
  }
  onFocusOut() {
    setTimeout(() => {
      this.hintBox = false;
    }, 300);
  }

  


}
 
