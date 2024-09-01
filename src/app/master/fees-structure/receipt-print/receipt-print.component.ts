import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComponentsServicesService } from '../../components-services.service';
import { WindowRefService } from 'src/app/window-ref.service';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-receipt-print',
  templateUrl: './receipt-print.component.html',
  styleUrls: ['./receipt-print.component.css'],
  providers: [WindowRefService]
})
export class ReceiptPrintComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService) { }
  schoolData: any = [];
  studentData: any = [];
  school_code: any = 'Select School';
  uuid:any 
  school_id: any;
  printValue:any = []
  printStatusOnly:boolean = false
  print_data: any = [];
  printStatus: any = false;
  print_month: any;
  receiptId: any = [];
  totalAount: number;
  studentPrintData: any = [];
  typeReceipt:any
  payableAmount:any = 0
  printingType:any 

  ngOnInit(): void {
    this.cs.pdfView$.subscribe((response:any)=>{
     this.localStorageUpdate()
     this.studentPrintData = response.studentPrintData
     this.typeReceipt = response.type
     if(localStorage.getItem('printingType') == 'Thermal'){
      this.printingType = true
     }else{
      this.printingType = false
     }
     if(this.typeReceipt == 'fee'){
      this.printStatus = true
     }else{
      this.printStatusOnly = true
     }
     this.download_pdf(response.printData)
      console.log(response)
      this.printPage(response , true)
    })
  }

  printPage(value:any , status:any) {
    // this.printStatusOnly = status
    console.log(value , status , 'cs')
    this.printValue = value
    this.printValue.school_name = localStorage.getItem('school_name')
  }

  
  download_pdf(data: any) {
    console.log(data)
    this.printStatus = true;
    this.print_data = [];
    this.print_data.push(data);
    this.print_month = data.month;
    this.receiptId = data.receipt_no;
    
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code');
      this.uuid = localStorage.getItem('uuid');
      this.school_id = localStorage.getItem('school_id')
      this.showSchool()
    }
  }

  showSchool() {
    this.apis
      .showSelectiveMigrationSchool(this.school_id, this.uuid)
      .subscribe((response: any) => {
        this.schoolData = response.response;
      });
  }

  openPDF(): void {
    var DATA: any;
    var DATA1: any;
    var DATA2: any;
    DATA = document.getElementById('htmlData');
    DATA1 = document.getElementById('htmlData1');
    DATA2 = document.getElementById('htmlData2');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      let FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 6, 6, fileWidth, fileHeight, '', 'FAST');
          PDF.save(this.receiptId + '-fee.pdf');
          this.printStatus = false;

    });
  }
  

  close() {
    this.printStatus = false;
  }

  addPayable(value1:any , value2:any){
    return Number(value1) + Number(value2)
  }
  

}
