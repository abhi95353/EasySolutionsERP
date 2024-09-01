import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-fees-report',
  templateUrl: './fees-report.component.html',
  styleUrls: ['./fees-report.component.css']
})
export class FeesReportComponent implements OnInit {

  constructor(
    private _clipboardService: ClipboardService,
    private apis: MasterAPIsServicesService
  ) {}


  @ViewChild('htmlData') htmlData!: ElementRef;
  dtHolidays: any;
  school_code :any = 'Select School'
  session:any = undefined 
  sessionId:any
  monthId:any = null
  monthList:any = []
  dateId:any = null
  sessionList:any=[]
  reportList:any = []
  searchText:any
  loadingStatus:boolean = false
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Student List',
    useBom: true,
    noDownload: false,
    headers: [
      'S.No' ,     
      'Recipet',
      'Account',
      'Name',
      'Class/section',
      'Monthly Fee',
      'Transport',
      'Admission',      
      'Registration',      
      'Fine',      
      'Pay Type'  ,    
      'Amounnt'      
    ],
  };

  USERS: any = [];

  ngOnInit(): void {
    this.dtHolidays = [];
    this.localStorageUpdate()
    if(localStorage.getItem('sub_host') != 'null'){
      this.showSesstion()    }
   
  }
  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
    }
  }

  copy(text: string) {
    this._clipboardService.copy(JSON.stringify(this.USERS));
    alert('copied');
  }

  openPDF(): void {
    var DATA: any;
    DATA = document.getElementById('htmlData');

    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

      PDF.save('erp_pdf.pdf');
    });
  }

  downloadCSV() {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    var data:any=[];
    for (let i = 0; i < this.USERS.length; i++) {
    for (let index = 0; index < this.USERS[i].data.detail ; index++) {

      let dt:any = []
      const element = this.USERS[i].data.detai[i];
      console.log(element)
     dt = {
      '1' : index,
      '2' : element.receipt_no,
      '3' : element.student.account,
      '4' : element.student.name,
      '5' : element.student.standard.notation+'/'+element.student.division.notation ,
      '6' :  element.tut_paid,
      '7' :  element.conv_paid,
      '8' :  element.adm_paid,
      '9' :  element.reg_paid,
      '10' :  element.lmf_paid,
      '11' : element.pay_type.pay,
      '12': element.tot_paid,
     }
     data.push(dt)
    }
    }
    // new AngularCsv(data,'fee-excel-report', this.csvOptions);
  }


  feesReport(){
    this.loadingStatus = true
    this.apis.getFeeReport(this.sessionId,this.monthId,this.dateId).subscribe((response:any)=>{
      if(response.success){
       if(response.response != null){
        this.loadingStatus = false
        this.reportList = response.response.data
        this.USERS = response.response.data
        console.log(this.reportList , 'report')
       }
       else{
        this.reportList = response.response
       }

      }
    })
  }
  showSesstion(){
    this.apis.showAllAcademicSession().subscribe((response:any)=>{
      console.log(response)
      if(!response.success){
        return
      }
      this.sessionList = response.response
     
    })
  }

  showDate(){
    this.monthId = null
  }
  changeMonth(){
    this.dateId = null
  }

  showMonth(){
    this.monthList = []
      const element = JSON.parse(this.session);
      this.sessionId = element.id
      var month:any = element.session
      var month2Digit:any = month.slice(0,2)
      var month_22:any = month.slice(2,4)
      var month_23:any = month.slice(5,)
      this.monthList.push('apr-'+month2Digit+month_22)
      this.monthList.push('may-'+month2Digit+month_22)
      this.monthList.push('jun-'+month2Digit+month_22)
      this.monthList.push('jul-'+month2Digit+month_22)
      this.monthList.push('aug-'+month2Digit+month_22)
      this.monthList.push('sep-'+month2Digit+month_22)
      this.monthList.push('oct-'+month2Digit+month_22) 
      this.monthList.push('nov-'+month2Digit+month_22)
      this.monthList.push('dec-'+month2Digit+month_22)
      this.monthList.push('jan-'+month2Digit+month_23)
      this.monthList.push('feb-'+month2Digit+month_23)
      this.monthList.push('mar-'+month2Digit+month_23)
  }

}
 