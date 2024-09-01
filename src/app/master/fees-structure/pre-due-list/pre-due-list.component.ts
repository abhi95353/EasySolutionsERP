import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'

@Component({
  selector: 'app-pre-due-list',
  templateUrl: './pre-due-list.component.html',
  styleUrls: ['./pre-due-list.component.css']
})
export class PreDueListComponent implements OnInit {
  constructor(private ms: MasterAPIsServicesService, private apis: MasterAPIsServicesService) { }

  ngOnInit(): void {
    this.showPreDue()
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'School List',
    useBom: true,
    noDownload: false,
    headers: ["S.No", "School Name", "School Code", "Affiliation", "Affiliation No", "Address","state_id", "City Id", "Zip Code","website", "Helpline No", "Contact Person Mail", "Contact Person", "Designation"]
  };


  submitStatus: Boolean = false
  dataList: any = []
  loaderStatus:boolean = true
  dataNotFound:boolean = false
  searchText:any


  showPreDue() {
    this.ms.getPreFeeList().subscribe((response: any) => {
      this.dataList = []
      console.log(response)
      if(response.length < 1){
        this.dataNotFound = true
      }else{
        this.dataList = response
      }
      this.loaderStatus = false
    })
  }

  openWebsite(data:any){
    window.location.href = 'https://'+data
  }



  search(value: any) {
    var newDataList = []
    newDataList = this.dataList
    this.dataList = []
    if (value.inputType.match('deleteContentBackward')) {
      this.showPreDue()
    }
    else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi')
        if (newDataList[i].code.match(str) || newDataList[i].name.match(str)) {
          this.dataList.push(newDataList[i])
        }
      }
    }
  }

  downloadCSV() {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    var data:any 
    data = this.dataList
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      delete element.uuid
      delete element.sub_host
      delete element.logo
      delete element.academic_session_id
      
    }
    new AngularCsv(this.dataList, "school_list", this.csvOptions);
  }

}
