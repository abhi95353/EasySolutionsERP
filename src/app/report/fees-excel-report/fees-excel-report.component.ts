import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-fees-excel-report',
  templateUrl: './fees-excel-report.component.html',
  styleUrls: ['./fees-excel-report.component.css']
})
export class FeesExcelReportComponent implements OnInit {

  constructor(
    private _clipboardService: ClipboardService,
    private apis: MasterAPIsServicesService
  ) {}


  @ViewChild('htmlData') htmlData!: ElementRef;
  dtHolidays: any;
  school_code :any = 'Select School'
  USERS: any = [];
  startAt:any

  ngOnInit(): void {
    this.localStorageUpdate()
    if(localStorage.getItem('sub_host') != 'null'){
     }
   
  }
  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
    }
  }

  feesReport(){
    this.apis.dailyExcelReportDPF(this.startAt , this.startAt).subscribe((response:any)=>{
      var blob = new Blob([response], {type: 'application/pdf'});
      var downloadURL = window.URL.createObjectURL(response);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = this.startAt+"_daily-report.xlsx";
      link.click();
      
    console.log(blob)
    
    })
  }

}
 