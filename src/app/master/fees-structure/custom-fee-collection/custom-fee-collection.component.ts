import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComponentsServicesService } from '../../components-services.service';
import { ScriptLoad } from '../../../../assets/js/payment'; 
@Component({
  selector: 'app-custom-fee-collection',
  templateUrl: './custom-fee-collection.component.html',
  styleUrls: ['./custom-fee-collection.component.css']
})
export class CustomFeeCollectionComponent implements OnInit {
  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService) { }
  @ViewChild('htmlData') htmlData!: ElementRef;

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
  submitStatus: boolean = false
  schoolData:any =[]
  studentData:any=[]
  school_code: any = 'Select School'
  school_id:any
  admissionNo:any=""
  lateMonthFine:any=0
  limitCrossFine:any = 0
  today:any = Date.now();
  feesBox:boolean= false
  monthId:any 
  is_waiver:boolean = false
  less:any=0
  monthList:any=[]
  feeData:any = []
  print_data:any = []
  printStatus:any = false  
  print_month:any;
  payableAmount:any = true
  paymentMode:any
  paybox:any
  uuid:any
  hintBox:boolean = false
  studentDataList:any = []
  searchBy:any = 'account'
  submitLoader:boolean = false
  studentPrintData:any = []
  printData:any = []
  receiptId:any = []
  totalAount:number
  studentProfiledata:any = []
  tagName:any = 'Account No'
  ngOnInit(): void {
    this.cs.feesCollection$.subscribe((response:any)=>{
      if(response.type == 'CF'){
        this.localStorageUpdate();
          this.admissionNo = response.account_no
          this.searchByAdmission(0)
          }else{
            this.feesBox = false
        }
    })
   
  }
  updateTagName(){
    if(this.searchBy == 'account'){
      this.tagName = "Account No"
      return
    }
    if(this.searchBy == 'f_name'){
      this.tagName = "Father Name"
      return
    }
    if(this.searchBy == 'name'){
      this.tagName = "Student Name"
      return
    }
  }
  clickCash(value:any){
    if(value =='cash'){
      this.payableAmount = true
  }else{
    this.payableAmount = false
    alert('Online Mode is not Available')
  }
  }
  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
      this.uuid = localStorage.getItem('uuid')
      this.school_id = localStorage.getItem('school_id');
      this.showSchool()
    }
  }

  showSchool() {
    this.apis
      .showSelectiveMigrationSchool(this.school_id  , this.uuid)
      .subscribe((response: any) => {
        this.schoolData = response.response;
      });
  }

  showAllStudent(){
    this.apis.allStudentList().subscribe((response:any)=>{
      this.studentDataList = response.response.data
    })
  } 

  searchByAdmission(is_paid:any){
    this.submitLoader = true
    this.apis.searchByAccountNoCustomFee(this.admissionNo).subscribe((response:any)=>{
      console.log(response)
      this.monthList = []
     if(response.response == null){
      this.apis.showNotifications('warning' , 'No Custom fees Available')
      this.submitLoader = false
      this.feesBox = false
       return
     } 
 
      this.studentData = response.response.data
      this.studentProfiledata = response.response.student
      console.log('name' , this.studentProfiledata)
      for (let i = 0; i < this.studentData.length; i++) {
        const element = this.studentData[i];
        if(i==0){
          this.monthId = element.id
        }
        var data:any={}
        data = {'id':element.id , 'month':element.custom_fee.name , 'is_paid':0 , 'payable':element.due}
        this.monthList.push(data)
        console.log(this.monthList)
      }
      this.feesBox = true
      this.submitLoader = false
    })
  }

  showPaidFee(is_paid:any){
    this.apis.showFeesDetails(this.admissionNo , is_paid).subscribe((response:any)=>{
      this.feeData = response.response.due
    })
  }
  onSelectMonth(id:any){
    this.monthId = id
  }
  download_pdf(data:any){
    this.printStatus = true
    this.print_data = []
    this.print_data.push(data)
    this.print_month = data.month
    this.receiptId = data.receipt_no
    for (let i = 0; i < data.details.length; i++) {
      const element = data.details[i];
      this.totalAount = parseInt(element.pre_due )+ parseInt(element.paid)
      
    }
  }
  openPDF(): void {
    var DATA: any
    DATA = document.getElementById('htmlData');
    html2canvas(DATA).then(canvas => {
      let fileWidth =6 ;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      const FILEURI = canvas.toDataURL('image/png') 
      let PDF = new jsPDF('p', 'cm', 'b8');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0,0 , fileWidth, fileHeight)
      PDF.save(this.receiptId+'-custom_fee.pdf');
    this.printStatus = false
    });
  
  }

  close(){
    this.printStatus = false
  }

  onclickPaybutton(id:any , month:any , payable:any){
    this.paybox = true
  }


  payFees(){
    ScriptLoad()
  }

  onClickPay(id:any , uuid:any){
    if(!this.payableAmount){
      alert('Please Change Payment Mode')
      return
    }
    var icon:any
    var title:any
    var data:any = {}
    data = {'id' : id  , 'uuid' : uuid}
    this.apis.customFeesPay(data).subscribe((response:any)=>{
      if(response.success){
        this.searchByAdmission(0)
        var data:any = {'account_no' : this.admissionNo , 'auto_print' : false}
        this.cs.passAccountNo(data)
        icon = 'success'
        title = 'Success'
    
      } else {
        icon = 'error'
        title = 'Error'
      }
      this.submitStatus = false

      this.Toast.fire({
        icon: icon,
        title: title
      })
    })
   
  }


  search(value: any) {
    var newDataList = []
    this.hintBox = true
    newDataList = this.studentDataList
    this.studentDataList = []
    
    if (value.inputType.match('deleteContentBackward')) {
      this.showAllStudent()
    }
    else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi')
        if(this.searchBy == 'account'){
          if (newDataList[i].account.match(str)) {
            this.studentDataList.push(newDataList[i])
          }
        }
        if(this.searchBy == 'f_name'){
          if (newDataList[i].parental.f_name.match(str)) {
            this.studentDataList.push(newDataList[i])
          }
        }
        if(this.searchBy == 'name'){
          if (newDataList[i].name.match(str)) {
            this.studentDataList.push(newDataList[i])
          }
        }
      }
    }
  }

  onChangeBox(account:any){
    this.admissionNo = account
    setTimeout(() => {
      this.hintBox = false
    }, 500);
  }
  onFocusOut(){
    setTimeout(() => {
      this.hintBox = false
    }, 500);
  }
}
