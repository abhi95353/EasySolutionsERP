import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reciept-list',
  templateUrl: './reciept-list.component.html',
  styleUrls: ['./reciept-list.component.css']
})
export class RecieptListComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService , private fb:FormBuilder) { }
  studentPrintData:any
  printData:any
  admissionNo:any = ''
  autoPrint:boolean = false
  viewStatus:boolean = false
  loaderStatus:boolean = false
  receiptType:any= 'fee'
  printingType:any = localStorage.getItem('printingType')
  recieptBoxStatus:boolean = false;
  recieptBoxStatusEdit:boolean = false;
  submitStatus:boolean = false
  title:any
  schoolData:any
  id:any
  uuid:any
  payType:any
  classForm = this.fb.group({
    id : [''],
    uuid : [''],
    date : [''],
    slip_no : [''],
    pay_type_id : ['']
  })

  ngOnInit(): void {
    this.cs.feesCollection$.subscribe((response:any)=>{
      this.admissionNo = response.account_no
      this.autoPrint = response.auto_print
      if(response.type == 'MF'){
        this.receiptType = 'fee'
      }
      if(response.type == 'PB'){
        this.receiptType = 'previous_balance'
      }
      if(response.type == 'CF'){
        this.receiptType = 'custom_fee'
      }
      if(response.type == 'AF'){
        this.receiptType = 'student_admission_fee'
      }
      this.showReceipt()
      this.viewStatus = true
    })
  }


  changePrintingType(data:any){
    console.log(data)
    localStorage.removeItem('printingType')

    localStorage.setItem('printingType' , data)
  }

 
  showReceipt() {
    this.studentPrintData = []
    this.printData = []
    this.loaderStatus = true
    if(this.receiptType == 'previous_balance'){
        this.apis.searchByAccountNoPreDue(this.admissionNo).subscribe((response: any) => {
          if (response.success) {
            console.log(response , 'Predue Receipt')
            this.loaderStatus = false
            if (response.response != null) {
              this.studentPrintData = response.response;
              this.printData = response.response.receipt;
              if(this.autoPrint){
                for (let index = 0; index < this.printData.length; index++) {
                  const element = this.printData[index];
                  if(index == 0 ){
                    this.download_pdf(element)
                    this.autoPrint = false
                  }
                  
                }
              }
            }
          }
      });
    }
    if(this.receiptType == 'fee'){
    this.apis.showNewFeesDetails(this.admissionNo, this.receiptType).subscribe((response: any) => {
      // this.apis.getReceipt(this.admissionNo, this.receiptType).subscribe((response: any) => {
      if (response.success) {
        console.log(response , 'Receipt')
        this.loaderStatus = false
        if (response.response != null) {
          this.studentPrintData = response.response;
          this.printData = response.response.receipt;
          if(this.autoPrint){
            for (let index = 0; index < this.printData.length; index++) {
              const element = this.printData[index];
              if(index == 0 ){
                this.download_pdf(element)
                this.autoPrint = false
              }
              
            }
          }
        }
      }
    });
  }
  }

  download_pdf(data:any){
    var data:any = {'account_no' : this.admissionNo , 'auto_print' : false , 'studentPrintData' : this.studentPrintData  , 'printData' : data ,'type' : this.receiptType }
    this.cs.pdfShow(data)
  }

  openBox(response:any){
      console.log(response)
      this.classForm.reset()
      this.title = response.slip_no
      this.recieptBoxStatus = true
      this.id = response.id,
      this.showPayType()
      this.classForm.patchValue({
        id:response.id,
        uuid:response.uuid,
        date:response.date,
        slip_no:response.slip_no,
        pay_type_id:response.pay_type_id
      })
  }
  addSubmit(){
    this.apis.editReceipt(this.id , this.classForm.value).subscribe((response:any)=>{
     if(response.success){
        this.apis.showNotifications('success' , response.message)
        var data:any = {'account_no' : this.admissionNo , 'auto_print' : false , 'type' : 'MF'}
        this.cs.passAccountNo(data)
        this.classForm.reset()
        this.recieptBoxStatus = false

     }else{
      this.apis.showNotifications('error' , response.message)

     }
    })
  }
  closeBox(){
    this.recieptBoxStatus = false
  }
  showPayType() {
    this.apis.showPayType().subscribe((response: any) => {
      this.payType = response.response.data;
    });
  }
}
