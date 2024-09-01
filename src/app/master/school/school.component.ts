import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css'],
})
export class SchoolComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private apis: MasterAPIsServicesService,
    private route: ActivatedRoute
  ) {}
  backgroundColor: any = 'green';
  submitStatus: boolean = false;
  basic: any;
  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Student List',
    useBom: true,
    noDownload: false,
    headers: ['School Code', 'School Name', 'Username', 'Password'],
  };
  action: any;
  id: any;
  uuid: any;
  image: any;
  school_code: any = '';
  schoolData: any = [];
  stateList: any = [];
  cityList: any = [];
  sessionList: any = [];
  settingForm = this.fb.group({
    registration_fee:[],
    receipt_count:[],
    admission_count:[]
  })
  ngOnInit(): void {
    this.showSchool();
    this.showState();
    this.route.paramMap.subscribe((response: any) => {
      this.action = response.params.action;
      this.id = response.params.id;
      this.uuid = response.params.uuid;
      if (response.params.action == 'update') {
        this.addfield();
        this.showSelectiveSchool(response.params.id, this.uuid);
        this.school_code = response.params.school_code;
      } else {
        this.addfield();
      }
    });
  }

  submit() {
    this.submitStatus = true;
    var icon: any;
    var title: any;
    if (this.action == 'add') {
      this.apis.migrationSchool(this.basic.value).subscribe((response: any) => {
        console.log(response)
        if (response.success) {
          icon = 'success';
          title = 'Success';
          this.submitStatus = false;
          this.basic.reset();
          this.Toast.fire({
            icon: icon,
            title: title, 
          });

          this.activateSchoo(response.response.sub_host);
        } else {
          icon = 'error';
          title = 'Error';
          this.submitStatus = false;
          this.Toast.fire({
            icon: icon,
            title: title,
          });
        }
      });
    } else {
      this.apis
        .updateMigrationSchool(this.id, this.basic.value)
        .subscribe((response: any) => {
          console.log(response)
          if (response.success) {
            // this.apis.updateSchool(this.id,this.basic.value, response.response.name).subscribe((res: any) => {
              icon = 'success';
              title = 'Success';
          }
            else {
              icon = 'error';
              title = 'Error';
            }
            this.submitStatus = false;
            // this.basic.reset();

            this.Toast.fire({
              icon: icon,
              title: title,
            });
            // })
        });
    }
  }

  logo_submit() {
    this.submitStatus = true;
    var icon: any;
    var title: any;
    var data: any;
    data = { logo: this.image };
    this.apis.updateLogo(this.school_code, data).subscribe((res: any) => {
      if (res.success) {
        icon = 'success';
        title = 'Success';
      } else {
        icon = 'error';
        title = 'Error';
      }
      this.submitStatus = false;
      this.Toast.fire({
        icon: icon,
        title: title,
      });
    });
  }

  showSelectiveSchool(id: any, uuid: any) {
    this.apis
      .showSelectiveMigrationSchool(id, uuid)
      .subscribe((response: any) => {
        if (response.success) {
          this.showCity(response.response.state_id)
          this.basic.setValue({
            code: response.response.code,
            name: response.response.name,
            affiliation: response.response.affiliation,
            affiliation_no: response.response.affiliation_no,
            contact_mail: response.response.contact_mail,
            location: response.response.location,
            city_id: response.response.city_id,
            state_id: response.response.state_id,
            pincode: response.response.pincode,
            contact_no: response.response.contact_no,
            contact_person: response.response.contact_person,
            designation: response.response.designation,
            website: response.response.website,
          });
        }
      });
  }

  addfield() {
    var item: any;
    item = this.fb.group({
      code: [''],
      name: [''],
      affiliation: [''],
      affiliation_no: [''],
      location: [''],
      contact_mail: [''],
      city_id: [''],
      state_id: [''],
      pincode: [''],
      contact_no: [''],
      contact_person: [''],
      designation: [''],
      website: [''],
    });
    this.basic = item;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.image = event.target.result;
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  showSchool() {
    this.apis.showMigrationSchool().subscribe((response: any) => {
      this.schoolData = response.response;
    });
  }

  setCustomValidity(value: any) {}

  resetPassword() {
    this.submitStatus = true;
    this.apis.changePassword(this.school_code).subscribe((response: any) => {
      var icon: any;
      var title: any;
      if (response.success) {
        icon = 'success';
        title = 'Success';
        this.submitStatus = false;
      } else {
        icon = 'error';
        title = 'Error';
      }
      this.submitStatus = false;
      this.Toast.fire({
        icon: icon,
        title: title,
      });
    });
  }

  showState() {
    this.apis.showStateWithoutSubHost().subscribe((response: any) => {
      this.stateList = response.response;
    });
  }
 
  showCity(id: any) {
    this.apis.showCityWithoutSubHost(id).subscribe((response: any) => {
      this.cityList = response.response;
    });
  }
  activateSchoo(sub_host: any) {
    this.apis.createSchool(sub_host).subscribe((response: any) => {
      console.log(response, 'school Active');
      if (response.success) {
        var data: any = [];
        data = [
          {
            school_code: response.response.code,
            school_name: response.response.name,
            username: response.response.code,
            password: response.response.password,
          },
        ];
        this.downloadCSV(data, response.response.code);
        setTimeout(() => {
            window.location.reload()
        }, 1000, );
      } 
    });
  }
  showSession() {
    this.apis.showSession().subscribe((response: any) => {
      this.sessionList = response.response;
    });
  }
  downloadCSV(data: any, school_code: any) {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    new AngularCsv(data, school_code, this.csvOptions);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  submitSchoolSetting(settingForm: any) {
    this.submitStatus = true
    this.apis.updateRegFee(this.school_code , settingForm).subscribe((response:any)=>{
      if(response.success){
        this.submitStatus = false
        this.apis.showNotifications('success' , 'Updated')
      }
  
    })
  }

  getExternal(){
    this.apis.getExternal(this.school_code).subscribe((response:any)=>{
      console.log(response.response) 
      console.log(this.school_code)
      this.settingForm.setValue({
        registration_fee:response.response[0].registration_fee,
        admission_count:response.response[0].admission_count,
        receipt_count:response.response[0].receipt_count,
      })
    })
  }
} 
