import { Component, OnInit , ElementRef,
  Input,
  AfterViewInit,
  ViewChild,
  } from '@angular/core';
import { MasterAPIsServicesService } from '../apis/master-apis-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , AfterViewInit  {
  studentCount:number = 0
  registrationCount:number = 0
  admissionCount:number = 0
  teacherCount:number = 0
  studentBirthday:any = []
  studentDue:any = []
  viewDashBoard:boolean = false
  dailyFeesCount:number = 0
  dailyFeeList:any = []
  dailyFeeListBox:boolean = false
  portalData:any = []
  dueData:any = [] 
  timelineData:any = []
  baseUrl:any = []
  readMore = false;
  viewId: any = null;
  constructor(private apis:MasterAPIsServicesService) { }
  duration: number = 1000;
  reportList:any = []
  steps:any; 
  searchText:any
  @ViewChild("animatedDigit1") animatedDigit1: any;
  @ViewChild("animatedDigit2") animatedDigit2: any;
  @ViewChild("animatedDigit3") animatedDigit3: any;
  @ViewChild("animatedDigit4") animatedDigit4: any;
  isAdmin:boolean = false
  isStaff:boolean = false
  loadingStatus:boolean = false
  onlineData:any
  cashData:any
  chequeData:any
  upiData:any
  report_type:any = 'cash'
  totalAmount:any

  ngOnInit(): void {
    if(localStorage.getItem('sub_host') != null){
      this.showDashboard()
      this.viewDashBoard = true
      this.showAttendaceStatus()
      this.updatePreviousDue()
      this.showTimeline()
      this.feesReport()
      this.baseUrl = this.apis.baseUrl
      this.isAdmin = this.apis.deployOnAdmin
      this.isStaff = this.apis.isStaff
    }
  }

 

  showDashboard(){
    this.apis.showStudentCnt().subscribe((response:any)=>{
      this.counterFunc(response.response.student.Total, 1000, this.animatedDigit4);
    })


    this.apis.showStudntReg().subscribe((response:any)=>{
      this.counterFunc(response.response.registration.Total, 1000, this.animatedDigit1);
    })


    this.apis.showStudntAdmsn().subscribe((response:any)=>{
      this.counterFunc(response.response.admission.Total, 1000, this.animatedDigit2);

    })


    // this.apis.showStudntTchr().subscribe((response:any)=>{
    //   this.counterFunc(response.response.teacher.Total, 1000, this.animatedDigit3);
    // })


    this.apis.showStudntbrth().subscribe((response:any)=>{
      this.studentBirthday = response.response.student_birthday.data
    })


    this.apis.showStudntD().subscribe((response:any)=>{
      this.studentDue = response.response.data
    })

    this.apis.showDashboardDailyFeeCollection().subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.dailyFeesCount = response.response.data.count
      this.counterFunc(this.dailyFeesCount, 1000, this.animatedDigit3);

        this.dailyFeeList = response.response.data.detail
      }
    })
  }
  



  counterFunc(endValue:any, durationMs:any, element:any) {
    if (!this.steps) {
      this.steps = 12;
    }

    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (endValue - 0) / stepCount;
    const sinValueIncrement = Math.PI / stepCount;

    let currentValue = 0;
    let currentSinValue = 0;

    function step() {
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

      element.nativeElement.textContent = Math.abs(Math.floor(currentValue));

      if (currentSinValue < Math.PI) {
        window.requestAnimationFrame(step);
      }
    }

    step();
  } 

  ngAfterViewInit() {
    
  }


  onClickFeesCollectionBox(value:any){
    this.dailyFeeListBox = value
  }

  showAttendaceStatus(){
    this.apis.showAttendance().subscribe((response:any)=>{
      if(response.success){
        this.portalData = response.response.data
        console.log(this.portalData)
      }
    })
  }
  updatePortal(id:any , uuid:any , value:any , name:any){
    if(value == 0){
      value = 1
    }else{
      value = 0
    }
    this.portalData.name = value
    this.apis.updatePortal(id,uuid,value , name).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , response.message)
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
    this.showAttendaceStatus()
  }

  updatePreviousDue(){
    this.apis.showPreviousBalance().subscribe((response:any)=>{
      this.dueData = response.response.data
    })
  }

  showTimeline(){
    // this.apis.showTimeline().subscribe((response:any)=>{
    //   this.timelineData = response.response.data
    // })
  }


  readMoreFun(value: any, id: any) {
    this.readMore = value;
    this.viewId = id;
    if (value == false) {
      this.viewId = null;
    }
  }

  // feesReport(){
  // this.loadingStatus = true
  //   let session:any
  //   session = localStorage.getItem('session_id')
  //   this.apis.getFeeReport(session,null,null).subscribe((response:any)=>{
  //     if(response.success){
  //       if(response.response != null){
  //        this.loadingStatus = false
  //        this.reportList = response.response.data
  //        console.log(this.reportList , 'report')
  //       }
  //       else{
  //        this.reportList = response.response
  //       }
 
  //      }
  //   })
  // }
  feesReport() {
    this.loadingStatus = true
      let session:any
      session = localStorage.getItem('session_id')
    this.apis.getFeeReport(session , null , null).subscribe((response: any) => {
      for (let index = 0; index < response.response.data.length; index++) {
        const element = response.response.data[index];
        console.log(element)
        if(element.pay_type == 'Online'){
          this.onlineData = element.data.detail
        }
        if(element.pay_type == 'Cash'){
          this.cashData = element.data.detail
        }
        if(element.pay_type == 'Cheque'){
          this.chequeData = element.data.detail
        }
        if(element.pay_type == 'UPI'){
          this.upiData = element.data.detail
        }
        this.loadingStatus = false
      }
      this.reportType('online')
    })
  }

  reportType(value:any){
    this.report_type = value
    this.loadingStatus = true
    this.totalAmount = 0;
    if(value=='cash'){
      this.reportList = this.cashData 
    }
    if(value=='online'){
      this.reportList = this.onlineData
    }
    if(value=='upi'){
      this.reportList = this.upiData
    }
    if(value=='cheque'){
      this.reportList = this.chequeData
    }
    this.reportList.forEach((element:any) => {
      this.totalAmount = element.tot_paid + this.totalAmount
    });
    setTimeout(() => {
      this.loadingStatus = false;
    }, 1000);

    (document.getElementById('cash') as HTMLElement).classList.remove('active');
    (document.getElementById('online') as HTMLElement).classList.remove('active');
    (document.getElementById('upi') as HTMLElement).classList.remove('active');
    (document.getElementById('cheque') as HTMLElement).classList.remove('active');

    (document.getElementById(value) as HTMLElement).classList.add('active');
    
  }

  applyFine(month:any){
    var data:any = {
      month:month
    }
    console.log(month)
    if(confirm("Are you sure to apply fine ")) {
      this.apis.appply_fine(data).subscribe((response:any)=>{
        if(response.success){
          this.apis.showNotifications('success' , response.message)
          return
        }
        this.apis.showNotifications('error' , response.message)
  
      })
    }
   
  }

}
