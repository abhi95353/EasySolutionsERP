import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-bus-meter-reading',
  templateUrl: './bus-meter-reading.component.html',
  styleUrls: ['./bus-meter-reading.component.css']
})
export class BusMeterReadingComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService) { }
  school_code:any = 'Select School';
  meterReading:any = null
  searchText:any
  ngOnInit(): void {
    this.localStorageUpdate();

  }


  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code');
      this.busReportData()

    }
  }

  busReportData(){
    this.apis.getBusDriverReport().subscribe((response:any)=>{
      for (let index = 0; index < response.response.data.data.length; index++) {
        const element = response.response.data.data[index];
        response.response.data.data[index].dmr1_shot = element.dmr1_shot.substring(15,)
        response.response.data.data[index].dmr2_shot = element.dmr2_shot.substring(15,)
        try{
         response.response.data.data[index].dmr1_details = JSON.parse(element.dmr1_details)
         console.log('try');
        }
        catch{
          response.response.data.data[index].dmr1_details = element.dmr1_details
        }

        try{
          response.response.data.data[index].dmr2_details = JSON.parse(element.dmr2_details)
         }
         catch{
         response.response.data.data[index].dmr2_details = element.dmr2_details
         }
      }

      this.meterReading  = response.response.data
      console.log(this.meterReading)
    })
  }


  pagination(data:any){
    this.apis.pagination(data).subscribe((response:any)=>{
      for (let index = 0; index < response.response.data.data.length; index++) {
        const element = response.response.data.data[index];
        response.response.data.data[index].dmr1_shot = element.dmr1_shot.substring(15,)
        response.response.data.data[index].dmr2_shot = element.dmr2_shot.substring(15,)
        try{
         response.response.data.data[index].dmr1_details = JSON.parse(element.dmr1_details)
         console.log('try');
        }
        catch{
          response.response.data.data[index].dmr1_details = element.dmr1_details
        }

        try{
          response.response.data.data[index].dmr2_details = JSON.parse(element.dmr2_details)
         }
         catch{
         response.response.data.data[index].dmr2_details = element.dmr2_details
         }
      }

      this.meterReading  = response.response.data
      console.log(this.meterReading)
    })
  }

}
 