import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.css']
})
export class TransportListComponent implements OnInit {

 
  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService
  ) {}
  school_code: any = 'Select School';
  studentData: any = [];
  roleData: any = [];
  readMore = false;
  viewId: any = null;
  searchText:any
  standard_id:any = 1
  classList:any = []
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
  ngOnInit(): void {
    this.localStorageUpdate();
    this.cs.roleAssignBoxUpdate$.subscribe((response:any)=>{
      if(response){
        this.showStudentTransportList()
        this.showClass()
      }
    })
  } 

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showStudentTransportList()
      this.showClass()
      this.school_code = localStorage.getItem('school_code');
    }
  }

  showStudentTransportList() {
    this.apis.showStudentTransport(this.standard_id).subscribe((response: any) => {
      console.log(response)
      this.studentData = response.response;
    });
  }


  readMoreFun(value: any, id: any) {
    this.readMore = value;
    this.viewId = id;
    if (value == false) {
      this.viewId = null;
    }
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
    new AngularCsv(data ,'transport_report', this.csvOptions);
  }

 
  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
    });
  }
 
  
  search(value: any) {
    var arrylist:any = []
    var newDataList = {'count' : '' , 'data' : arrylist}
    newDataList.data = this.studentData.data
    this.studentData.data = []
    
    if (value.inputType.match('deleteContentBackward')) {
      this.showStudentTransportList()
    }
    else {
      for (let i = 0; i < newDataList.data.length; i++) {
        var str = new RegExp(value.data, 'gi')
          if (newDataList.data[i].name.match(str)) {
            this.studentData.data.push(newDataList.data[i])
          }
      
      }
    }
  }

}
