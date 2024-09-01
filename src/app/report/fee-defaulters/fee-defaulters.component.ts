import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-fee-defaulters',
  templateUrl: './fee-defaulters.component.html',
  styleUrls: ['./fee-defaulters.component.css'],
})
export class FeeDefaultersComponent implements OnInit {
  constructor(
    private _clipboardService: ClipboardService,
    private apis: MasterAPIsServicesService
  ) {}

  @ViewChild('htmlData') htmlData!: ElementRef;
  dtHolidays: any;

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
      'Account',
      'Name',
      'Class',
      'Amount',
      'Default Month',
      'Status'      
    ],
  };

  USERS: any = [];
  loadingData:boolean = false
  mnth:any = "apr"
  standard_id:any = 1
  classList:any = []
  status:any = null
  amount:any = null

  ngOnInit(): void {
    this.showClass()
    this.showDefaulter();
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
     dt = { 
        account : element.account,
        name : element.name,
        class: element.class,
        amount : element.default_amount,
        month : element.default_month,
        status : element.default_month  == 0 ? 'PAID' : 'UNPAID'
     }
     data.push(dt)
    }
    new AngularCsv(data, this.mnth+'_'+this.standard_id+'_'+'default-report', this.csvOptions);
  }

  showDefaulter() {
    this.amount = null
    this.status = null
    this.loadingData = true
    this.apis.feeDefaulterList(this.mnth , this.standard_id).subscribe((response: any) => {
    this.loadingData = false
      if (response.response != null) {
        this.USERS = response.response.data;
        
      }
    });
  }

  onClickMonth() {
    this.amount = null
    var value:any = this.status
    this.loadingData = true
    this.apis.feeDefaulterList(this.mnth , this.standard_id).subscribe((response: any) => {
    this.loadingData = false

      if (response.response != null) {
        this.USERS = response.response.data;
        var newDataList = [];
        newDataList = this.USERS;
        console.log(newDataList.length, value);

        if (value == null) {
          return;
        } else {
          this.USERS = [];
          for (let i = 0; i < newDataList.length; i++) {
            console.log(newDataList[i].default_month , value , newDataList[i].default_month )
            if (newDataList[i].default_month >= value) {
              this.USERS.push(newDataList[i]);
            }
          }
        }
      }
    });
  }

  onClickAmount() {
   var value:any = this.amount

    this.loadingData = true
    this.apis.feeDefaulterList(this.mnth , this.standard_id).subscribe((response: any) => {
    this.loadingData = false
      if (response.response != null) {
        this.USERS = response.response.data;
        var newDataList = [];
        newDataList = this.USERS;

        if (value == null) {
          return;
        } else {
          this.USERS = [];
          for (let i = 0; i < newDataList.length; i++) {
            var str = new RegExp(value.data, 'gi');
            if (parseInt(newDataList[i].default_amount) >= value) {
              console.log(newDataList[i].default_amount, value);

              this.USERS.push(newDataList[i]);
              console.log(this.USERS);
            }
          }
        }
      }
    });
  }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
    });
  }

}
