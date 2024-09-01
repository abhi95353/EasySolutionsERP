import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-fees-type',
  templateUrl: './fees-type.component.html',
  styleUrls: ['./fees-type.component.css']
})
export class FeesTypeComponent implements OnInit {


  constructor(private _clipboardService: ClipboardService, private fb: FormBuilder, private apis: MasterAPIsServicesService) { }
  classesBoxStatus: boolean = false;
  submitStatus: boolean = false
  facilityList: any = []
  id: any
  layout: any
  uuid:any
  searchText:any
 

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
    headers: ["S.no", "Fees Type", "Payment/Due Date"]
  };

  feesTypeForm = this.fb.group({
    name: [''],
    due_date: ['25'],
    jan: [''],
    feb: [''],
    mar: [''],
    apr: [''],
    may: [''],
    jun: [''],
    jul: [''],
    aug: [''],
    sep: [''],
    oct: [''],
    nov: [''],
    dec: [''],
  })
  school_code:any
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

  ngOnInit(): void {
    this.localStorageUpdate()

    if(localStorage.getItem('sub_host') != 'null'){
      this.showFacility()
      console.log(this.feesTypeForm.value)
    }
   
  }

  copy(text: string) {
    // this._clipboardService.copy(JSON.stringify(this.USERS))
    alert('copied')
  }


  downloadCSV() {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    new AngularCsv(this.dtHolidays, "studentlist", this.csvOptions);
  }

  onClickFacilityBox(value: any, layout: any, id: any , uuid:any) {
    this.classesBoxStatus = value
    this.layout = layout
    this.id = id
    this.uuid = uuid
    if (this.layout === 'edit') {
      this.showSelectiveFacility(id , uuid)
    }
    if (this.layout === 'add') {
      this.feesTypeForm.reset()
      this.feesTypeForm.controls['due_date'].setValue(25)

    }
  }

  facilityBox(value: any) {

  }

  submit() {
    var icon: any
    var title: any
    this.submitStatus = true
    
    if (this.layout === 'add') {
      this.apis.storeFacility(this.feesTypeForm.value).subscribe((response: any) => {
        if (response.success) {
          icon = 'success'
          title = 'Success'
          this.classesBoxStatus = false

        } else {
          icon = 'error'
          title = 'Error'
        }
        this.submitStatus = false
        this.feesTypeForm.reset()
        this.showFacility()
        this.Toast.fire({
          icon: icon,
          title: title
        })
      })
    } else {
      this.apis.updateFacility(this.id, this.feesTypeForm.value , this.uuid).subscribe((response: any) => {
        console.log(response)
        if (response.success) {
          icon = 'success'
          title = 'Success'
          this.classesBoxStatus = false

        } else {
          icon = 'error'
          title = 'Error'
        }
        this.submitStatus = false
        this.feesTypeForm.reset()
        this.showFacility()

        this.Toast.fire({
          icon: icon,
          title: title
        })
      })
    }
  }


  showFacility() {
    this.apis.showFacility().subscribe((response: any) => {
      this.facilityList = []
      this.facilityList = response.response.data
      console.log(response)
    })
  }

  showSelectiveFacility(id: any , uuid:any) {
    this.feesTypeForm.reset()
    this.apis.showSelectiveFacility(id , uuid).subscribe((response: any) => {
      console.log(response)
      this.feesTypeForm.setValue({
        name: response.response.name,
        due_date: response.response.due_date,
        jan: response.response.jan,
        feb: response.response.feb,
        mar: response.response.mar,
        apr: response.response.apr,
        may: response.response.may,
        jun: response.response.jun,
        jul: response.response.jul,
        aug: response.response.aug,
        sep: response.response.sep,
        oct: response.response.oct,
        nov: response.response.nov,
        dec: response.response.dec,
      })
    })
  }

  deleteFacility(id: any , uuid:any) {
    var icon: any
    var title: any
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
        this.apis.deleteFacility(id , uuid).subscribe((res: any) => {
          console.log(id, res)
            console.log(res)
            if (res.success) {
              this.apis.showNotifications('success' , 'Success')
              this.showFacility()
            } else {
              this.apis.showNotifications('error' , res.message)
            }           
        })
      }
    })
  }

  search(value: any) {
    var newDataList = []
    newDataList = this.facilityList
    this.facilityList = []
    if (value.inputType.match('deleteContentBackward')) {
      this.showFacility()
    }
    else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi')
        if (newDataList[i].name.match(str)) {
          this.facilityList.push(newDataList[i])
        } 
      }
    }
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') !== null){
      this.school_code = localStorage.getItem('school_code')
    }
  }


}
