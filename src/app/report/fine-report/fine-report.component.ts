import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-fine-report',
  templateUrl: './fine-report.component.html',
  styleUrls: ['./fine-report.component.css']
})
export class FineReportComponent implements OnInit {

  constructor(
    private _clipboardService: ClipboardService,
    private apis: MasterAPIsServicesService
  ) {}

@ViewChild('htmlData') htmlData!: ElementRef;
dtHolidays: any;
concessionList:any = []

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
    'Holiday ID',
    'Holiday Date',
    'Holiday Comment',
    'Holiday Status',
  ],
};

USERS: any = [];

ngOnInit(): void {
  this.showFineList()
  this.dtHolidays = [];
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
  new AngularCsv(this.dtHolidays, 'studentlist', this.csvOptions);
}



onClickConcession(value: any) {
  console.log(value)
  value = JSON.parse(value)
  this.apis.feeFineList(value.id , value.uuid).subscribe((response: any) => {
    this.USERS = response.response.data;
 console.log(response)
  });
}

showFineList(){
  this.apis.showFineValueList().subscribe((response:any)=>{
    console.log(response)
    this.concessionList = response.response.data
  })
}



}
