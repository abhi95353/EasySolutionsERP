import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import html2canvas from 'html2canvas';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-transfer-certificate',
  templateUrl: './transfer-certificate.component.html',
  styleUrls: ['./transfer-certificate.component.css']
})
export class TransferCertificateComponent implements OnInit {

  @ViewChild('htmlData') htmlData!: ElementRef;

  constructor(
    private apis: MasterAPIsServicesService,
    private fb:FormBuilder
  ) {}
  school_id: any;
  uuid: any;
  schoolData: any = [];
  printView: any = true;
  studentData: any = [];
  certificateType:any
  is_forTeacher:boolean
  entry_type:any
  school_code: any = 'Select School' 
  searchText:any
  hintBox: boolean = false;
  admissionNo: any = null;
  studentDataList: any = [];
  feesSearchStatus:boolean = false
  tcForm = this.fb.group({
    affiliation_no:[''],
    school_code:[''],
    book_no:[''],
    admission_no:[''],
    sl_no:[''],
    srn:[''],
    name:[''],
    m_name:[''],
    f_name:[''],
    dob:[''],
    dobInWord:[''],
    dobProof:[''],
    nationality:[''],
    admission_date:[''],
    admissionClass:[''],
    class:[''],
    board:[''],
    isFailed:[''],
    subject1:[''],
    subject2:[''],
    subject3:[''],
    subject4:[''],
    subject5:[''],
    subject6:[''],
    isPromoted:[''],
    acTotalWorkDay:[''],
    acTotalPresent:[''],
    duePaidMonth:[''],
    datedAt :[''],
    offDatedAt:[''],
    issuedAt:[''],
    remark:[''],
    receivedAt:[''],


  })
  ngOnInit(): void {
    this.localStorageUpdate()
  }
 
  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
      this.showAllStudent()
    }
  }

  
  showAllStudent() {
    this.apis.allStudentList().subscribe((response: any) => {
      this.studentDataList = response.response.data;
    });
  }



  searchByAdmission() {
    // call all the api
    this.feesSearchStatus = true
    if(this.admissionNo.length < 1 || this.admissionNo == null){
      return
    }
    this.apis.showStudntCertificateTC(this.admissionNo).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.updateData(response.response)
        this.apis.showNotifications('success' , response.message)
      }else{
        this.apis.showNotifications('error' , response.message)
      }
       this.feesSearchStatus = false
    })
   
    // var data:any = {'account_no' : this.admissionNo , 'auto_print' : false , 'type' : this.feeType}
    // this.cs.passAccountNo(data)
    console.log(this.admissionNo);
  }
 
  
  focusIn(){
    this.hintBox = true;
  }


  onChangeBox(account: any) {
    this.admissionNo = account;
    this.searchText = account
    setTimeout(() => {
      this.searchByAdmission()
    }, 500);
  }
  onFocusOut() {
    setTimeout(() => {
      this.hintBox = false;
    }, 300);
  }

submit(){
  var data:any = {}
  this.apis.tcCerttificatePdf(this.tcForm.value).subscribe((response:any)=>{
    var blob = new Blob([response], {type: 'application/pdf'});
    var downloadURL = window.URL.createObjectURL(response);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = "tc.pdf";
    link.click();
    
  console.log(blob)
    
  })
}


updateData(studentData:any){

  this.tcForm.patchValue({
    affiliation_no:'',
    school_code:'',
    book_no:'',
    admission_no:studentData.student_admission.admission_no,
    sl_no:'',
    srn:'',
    name:studentData.name,
    m_name:studentData.parental.m_name,
    f_name:studentData.parental.f_name,
    dob:studentData.dob,
    dobInWord:'',
    dobProof:'',
    nationality:'Indian',
    admission_date:studentData.student_admission.admission_date,
    admissionClass:studentData.student_admission.app_standard.notation,
    class:studentData.standard.notation,
    board:'',
    isFailed:'',
    subject1:'',
    subject2:'',
    subject3:'',
    subject4:'',
    subject5:'',
    subject6:'',
    isPromoted:'',
    acTotalWorkDay:'',
    acTotalPresent:'',
    duePaidMonth:'',
    datedAt :'',
    offDatedAt:'',
    issuedAt:'',
    receivedAt:'',
    remark:''
  })

}
 


 
} 