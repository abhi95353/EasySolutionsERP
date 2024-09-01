import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-fee-transport-report',
  templateUrl: './fee-transport-report.component.html',
  styleUrls: ['./fee-transport-report.component.css']
})
export class FeeTransportReportComponent implements OnInit {

  constructor(
    private _clipboardService: ClipboardService,
    private apis: MasterAPIsServicesService
  ) {}


  @ViewChild('htmlData') htmlData!: ElementRef;
  school_code :any = 'Select School'
  reportList:any = []
  searchText:any
  loadingStatus:boolean = false
  studentDetails:any = null
  studentList:any = null
  boxView:boolean = false
  month:any = null
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
    this.localStorageUpdate()   
  }
  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
      this.feesReport()
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
    for (let index = 0; index < this.USERS.length; index++) {
      let dt:any = []
      const element = this.USERS[index];
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
    new AngularCsv(data,'fee-excel-report', this.csvOptions);
  }


  feesReport(){
    this.loadingStatus = true
    this.apis.getTransportReport().subscribe((response:any)=>{
      console.log(response , 'rs')
      if(response.success){
       if(response.response != null){
        this.loadingStatus = false
        this.reportList = response.response.data
        this.USERS = this.reportList.detail
        console.log(this.reportList , 'report')
       }
       else{
        this.reportList = response.response
       }

      }
    })
  }

  gotoMonth(data:any , month:any){
      this.studentDetails = data
      this.month = month.month
      this.studentList = month.students
      this.boxView = true
      
    console.log(this.studentDetails , month , this.studentList)
  }

  closeBox(){
    this.boxView = false
  }


}
 