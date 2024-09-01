import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComponentsServicesService } from '../../components-services.service';
import { ScriptLoad } from '../../../../assets/js/payment'; 
@Component({
  selector: 'app-previous-due-collect',
  templateUrl: './previous-due-collect.component.html',
  styleUrls: ['./previous-due-collect.component.css']
})
export class PreviousDueCollectComponent implements OnInit {
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
  payAmount:number = 0
  tagName:any = 'Account No'
  cheque_date:any = undefined
  cheque_bank:any = undefined
  cheque_ifs_code:any = undefined
  cheque_no:any = undefined
  cheque_account_no:any = undefined
  cheque_payer:any = undefined
  printValue:any
  printStatusOnly:boolean = false
  autoPrint:boolean = false  
  paymentType: any = 'cash';
  ngOnInit(): void {
    this.localStorageUpdate()
    this.cs.feesCollection$.subscribe((response:any)=>{
      if(response.type == 'PB'){
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
  clickCash(value: any) {
    console.log(value)
    this.paymentType = value;
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code');
      this.uuid = localStorage.getItem('uuid');
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
    this.apis.searchByAccountNoPreDue(this.admissionNo).subscribe((response:any)=>{
      console.log(response)
      this.monthList = []
    this.showReceipt()

     if(response.response == null){
      this.apis.showNotifications('warning' , 'No Custom fees Available')
      this.submitLoader = false
      this.feesBox = false
       return
     } 
  
      this.studentData = response.response.due
      this.studentProfiledata = response.response.student
      console.log('name' , this.studentProfiledata)
      for (let i = 0; i < this.studentData.length; i++) {
        const element = this.studentData[i];
        if(i==0){
          this.monthId = element.id
          this.payAmount = element.due

        }
        var data:any={}
        data = {'id':element.id , 'month':element.pre_bal , 'is_paid':0 , 'payable':element.outstanding}
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
    setTimeout(() => {
      this.payAmount = (((document.getElementById('payableAmount') as HTMLElement).innerHTML as unknown) as number)
    }, 200);
  }

  download_pdf(data:any){
    this.printStatus = true
    this.print_data = []
    this.print_data.push(data)
    this.print_month = data.month
    this.receiptId = data.receipt_no
    console.log(data)
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
      PDF.save(this.receiptId+'-previous_due.pdf');
    this.printStatus = false

    });

  }

  close(){
    this.printStatus = false
  }


  payButtonClick(id: any, uuid: any , due:any) {
    if(!this.payableAmount){
      alert('Please Change Payment Mode')
      return
    }
    if(this.payAmount == 0 ){
      alert('Please! Fill pay amount')
      return
    }
    if(this.payAmount < 0){
      alert('Amount must be positive.')
      return
    }
    if(this.payAmount > due){
      alert('Amount must be less than outstanding amount')
      return
    }
    

    if (this.paymentType == 'online') {
      // this.payWithRazor(this.payableFee, id, month , uuid);
      return;
    }
    if (this.paymentType == 'cash') {
      this.submitStatus = true
      this.onClickPay(id , uuid);
      return;
    }

    if (this.paymentType == 'cheque') {
      this.payChequePayment(id , uuid);
      return;
    }
  }

  onClickPay(id:any , uuid:any){
   
    var icon:any
    var title:any
    var data:any = {}
    data = {'id' : id  , 'uuid' : uuid , 'paid' : this.payAmount}
    this.apis.storePreDueFees(data).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.searchByAdmission(0)
        icon = 'success'
        title = 'Success'
        this.payAmount = 0
        var data:any = {'account_no' : this.admissionNo , 'auto_print' : this.autoPrint}
        this.cs.passAccountNo(data)
    
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



  
  payChequePayment(id: any , uuid:any) {
    var data: any = {};
    var collect_details = {}
    var cheque_details = {}
    var payer = " "
    if(this.cheque_date == undefined || this.cheque_account_no == undefined || this.cheque_bank == undefined || this.cheque_ifs_code == undefined || this.cheque_no == undefined)
    {
      alert('Please! Fill all the details related to the cheque')
      return
    }
    this.submitStatus = true
       collect_details = {
          "collect_type": 'PreviousBalance',  //"FeeCollect / CustomFeeCollect / PreviousBalance",
          "id": id,
          "uuid": uuid,
          "paid": this.payAmount,
          "less" : 0,
          "is_waived": 0,
          "comment": ''
        
      }
       cheque_details =  {
          "date": this.cheque_date,
          "bank": this.cheque_bank,
          "ifsc_code": this.cheque_ifs_code,
          "account_no": this.cheque_account_no,
          "cheque_no": this.cheque_no,
          "amount": this.payAmount
      }

      payer = this.cheque_payer

      data = {
       collect_details : collect_details,
       cheque_details : cheque_details,
       payer : payer
      };
    this.apis.createChequePayment(data).subscribe((response: any) => {
      if (response.success) {
        console.log(response, 'cheque')
        // this.showPaidFee(1);
        this.searchByAdmission(0);
        this.apis.showNotifications('success', response.message);
        this.less = 0;
        this.payAmount = 0;
        this.printPage(response.response.data , true)
        this.cheque_account_no = undefined
        this.cheque_bank = undefined
        this.cheque_date = undefined
        this.cheque_ifs_code = undefined
        this.cheque_no = undefined
        this.cheque_payer = undefined
        this.paymentType = 'cash'
      } else {
        this.apis.showNotifications('error', response.message);
      }
      this.submitStatus = false;
    });
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

  showReceipt(){
    this.studentData = []
    this.studentPrintData = []
    this.apis.getReceipt(this.admissionNo ,  'previous_balance').subscribe((response:any)=>{
      if(response.success){
      if(response.response != null){
        this.studentPrintData = response.response.data.student
        this.printData = response.response.data.collect
      }
      }
      console.log(response)
    })
  }

  printPage(value:any , status:any) {
    this.printStatusOnly = status
    console.log(value , status)
    this.printValue = value
    this.printValue.school_name = localStorage.getItem('school_name')
  }

}
