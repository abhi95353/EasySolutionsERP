import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
import { ComponentsServicesService } from '../components-services.service';
 
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService) { }
  studentList:any
  school_code:any = 'Select School' 
  showChequeList:any=[]
  regBoxStatus:boolean = false;
  printStatus:boolean = false
  printValue:any
  openNotification:boolean = false
  paymentList:any = []
  loadingBox:boolean = false
  ngOnInit(): void {
    this.cs.paymentLinkBox$.subscribe((response:any)=>{
    this.openNotification = response
    this.showPayment()
    })
    this.localStorageUpdate()
    if(localStorage.getItem('sub_host') != 'null'){
    this.showPayment()
    }
  }


  onCLickIcon(value:any){
    this.openNotification = false 
   }

   showPayment(){
    this.loadingBox = true
     this.apis.showOnlinePayment().subscribe((response:any)=>{
      this.loadingBox = false
       this.paymentList = response.response.data 
       console.log(this.paymentList)
     })
   }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
      this.showCheque()
    }
  }

  showCheque(){
    
    // this.apis.TemporaryPaymentLink().subscribe((response:any)=>{
    //   this.showChequeList = response.response.data
    //   console.log(response)
    // })

    
  }
  search(value: any) {
    var newDataList = []
    newDataList = this.studentList
    this.studentList = []
    
    if (value.inputType.match('deleteContentBackward')) {
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



  printPage(value:any , status:any) {
    this.printStatus = status
    console.log(value)
    this.printValue = value
    this.printValue.school_name = localStorage.getItem('school_name')
    this.printStatus = status
  }

  cancelPayment(id:any){
    var data = {}
    data = { 'plink_id' : id}
    console.log(data)
    this.apis.cancelOnlienPayment(data).subscribe((response:any)=>{
      if(response.success){
        this.showPayment()
        this.apis.showNotifications('success' , response.message)
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }

  resendPayment(id:any){
    var data = {}
    data = { 'plink_id' : id}
    console.log(data)
    this.apis.resendOnlienPayment(data).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.showPayment()
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }


  verifyPayment(ref_id:any , plink_id:any){
    var data = {}
    data = {   
    "ref_id": ref_id,
    "razorpay_plink_id" : plink_id}
    console.log(data)
    this.apis.verifyOnlienPayment(data).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.showPayment()
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }
}
