import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import Swal from 'sweetalert2'


@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css']
})
export class SchoolListComponent implements OnInit {

  constructor(private ms: MasterAPIsServicesService, private apis: MasterAPIsServicesService) { }

  ngOnInit(): void {
    this.showSchool()
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
    headers: ["S.No", "School Name", "School Code", "Affiliation", "Affiliation No", "Address","state_id", "City Id", "Zip Code","website", "Helpline No", "Contact Person Mail", "Contact Person", "Designation" , "Session", "Website" ]
  };

  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  })
  submitStatus: Boolean = false
  dataList: any = []
  loaderStatus:boolean = true
  dataNotFound:boolean = false
  searchText:any = ''


  showSchool() {
    this.ms.showMigrationSchool().subscribe((response: any) => {
      this.dataList = []
      console.log(response.response)
      if(response.response.length < 1){
        this.dataNotFound = true
      }else{
        this.dataList = response.response
      }
      this.loaderStatus = false
    })
  }

  openWebsite(data:any){
    window.location.href = 'https://'+data
  }

  deleteSchool(id: any , uuid:any) {
    var icon: any
    var title: any
    this.submitStatus = false
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ms.deleteMigration(id , uuid).subscribe((res: any) => {
          if (res) {
            if (res) {
              icon = 'success'
              title = 'Success'
              this.showSchool()
            } else {
              icon = 'error'
              title = 'Error'
            }
            this.submitStatus = false
            this.Toast.fire({
              icon: icon,
              title: title
            })
          }
        })
      }
    })

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
 