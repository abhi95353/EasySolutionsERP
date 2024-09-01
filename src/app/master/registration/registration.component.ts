import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ComponentsServicesService } from '../components-services.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private apis: MasterAPIsServicesService,
    private route: ActivatedRoute,
    private cs: ComponentsServicesService
  ) {}
  today: number = Date.now();

  registrationForm = this.fb.group({
    name: [''],
    dob: ['', [Validators.max(this.today)]],
    gender: ['M'],
    mobile_no: [''],
    email_id: [''],
    location: [''],
    pincode: [0],
    city_id: [''], 
    category: [''],
    aadhar_no: [],
    app_standard_id: [''],
    pre_standard_id: [''],
    academic_session_id: [''],
    f_name: [''],
    f_occupation: [''],
    f_mobile_no: [''],
    f_email: [''],
    m_name: [''],
    m_occupation: [''],
    m_mobile_no: [''],
    m_email: [''],
    state_id: [''],
    is_paid: [0],
    by: ['SA'],
  });
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
  stateList: any;
  cityList: any;
  classList: any;
  submitStatus: boolean = false;
  school_code: any = 'Select School';
  action: any;
  id: any = null;
  step: any = 'active-step1';
  registration_id: any;
  birthCert: any = undefined;
  AddCert: any = undefined;
  transferCert: any = undefined;
  lastClassMarksheet: any = undefined;
  sessionList: any = [];
  regAmount: any = [];
  uuid: any = null;
  paymentStatus: number = 0;
  fileSkip:boolean = false

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.action = params.params['action'];
      this.id = params.params['id'];
      this.uuid = params.params['uuid'];

      this.localStorageUpdate();
      this.updateOnBack();
      if (this.action == 'update') {
        this.showSelectiveStudent();
      } else {
        if (localStorage.getItem('step')) {
          this.step = localStorage.getItem('step');
          this.registration_id = localStorage.getItem('registration_number');
        }
      }
    });
  }

  pressSkipDoc(){
    this.fileSkip = true
    this.step = 'active-step3';
    localStorage.setItem('step', this.step);
    this.apis.showNotifications('success' , 'Skipped')
  }

  submit() {
    if (this.regAmount < 1) {
      alert('please! Update Registration Fee');
      return;
    }
    var icon: any;
    var title: any;
    this.submitStatus = true;
    this.registrationForm.controls['m_email'].setValue(
      this.registrationForm.value['f_email']
    );
    this.step = 'active-step2';
    localStorage.setItem(
      'student_data',
      JSON.stringify(this.registrationForm.value)
    );
    localStorage.setItem('step', this.step);
    this.submitStatus = false;
    icon = 'success';
    title = 'Success';
    this.Toast.fire({
      icon: icon,
      title: title,
    });
  }

  payNow() {
    if (this.regAmount < 1) {
      alert('please! Update Registration Fee');
      return;
    }
    var icon: any;
    var title: any;
    this.submitStatus = true;
    var student_data: any;
    student_data = localStorage.getItem('student_data');
    student_data = JSON.parse(student_data);
    student_data.is_paid = 1;
    console.log(student_data);
    this.apis.registrationStudent(student_data).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        this.registration_id = response.response;
        localStorage.setItem('registration_number', response.response);
        if(!this.fileSkip){
          this.submitStep2(this.registration_id)
          }else{
            this.step = 'active-step4';
            localStorage.setItem('step', this.step);
            this.downLoadPdf()
            this.apis.showNotifications('success' , 'Success')
          }
      } else {
        icon = 'error';
        title = 'Error';
        this.Toast.fire({
          icon: icon,
          title: title,
        });
        this.submitStatus = false;
      }
    });
  }

  // if ('OTPCredential' in window) {
  //   window.addEventListener('DOMContentLoaded', e => {
  //     const ac = new AbortController();
  //     navigator.credentials.get({
  //       otp: { transport:['sms'] },
  //       signal: ac.signal
  //     }).then(otp => {
  //       alert(otp.code)
  //     }).catch(err => {
  //       console.log(err)
  //     });
  //   })
  // } else {
  //   alert('WebOTP not supported!.')
  // }
  submitDoc() {
    var icon: any;
    var title: any;
    this.submitStatus = true;
    if (this.AddCert == undefined && this.lastClassMarksheet == undefined && this.transferCert == undefined) {
      icon = 'error';
      title = 'Please Select File';
      this.submitStatus = false;
      this.Toast.fire({
        icon: icon,
        title: title,
      });
      return;
    }
    this.registration_id = localStorage.getItem('registration_number');
    var data: any = [];
    data = [
      {
        reg_no: this.registration_id,
        imageName: 'BirthCert',
        image: this.birthCert,
      },
      {
        reg_no: this.registration_id,
        imageName: 'AddCert',
        image: this.AddCert,
      },
      {
        reg_no: this.registration_id,
        imageName: 'TransferCertificate',
        image: this.transferCert,
      },
      {
        reg_no: this.registration_id,
        imageName: 'LastClassMarksheet',
        image: this.lastClassMarksheet,
      },
    ];

    try {
    localStorage.setItem('student_data_image', JSON.stringify(data));
    } catch (e) {
        alert('Your All files size must be less than 4MB'); //data wasn't successfully saved due to quota exceed so throw an error
      return
    } 
    this.step = 'active-step3';
    localStorage.setItem('step', this.step);
    icon = 'success';
    title = 'Success';
    this.submitStatus = false;
    this.Toast.fire({
      icon: icon,
      title: title,
    });
  }

  submitStep2(id: any) {
    var icon: any;
    var title: any;
    var image: any;
    var data: any = [];
    image = localStorage.getItem('student_data_image');
    image = JSON.parse(image);
    for (let i = 0; i < image.length; i++) {
      if (image[i].image != undefined) {
        data.push(image[i]);
      }
      image[i].reg_no = id;
    }
    console.log(image, data);
    this.apis.registrationStudentDocument(data).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        icon = 'success';
        title = 'Success';
        this.step = 'active-step4';
        localStorage.setItem('step', this.step);
        this.downLoadPdf()
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
    this.apis.showState().subscribe((response: any) => {
      this.stateList = response.response;
    });
  }

  showCity(id: any) {
    this.apis.showCity(id).subscribe((response: any) => {
      this.cityList = response.response;
      console.log(response);
    });
  }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
    });
  }

  showSelectiveStudent() {
    this.apis
      .showSelectiveStudentRegistration(this.id, this.uuid)
      .subscribe((response: any) => {
        console.log(response, 'ok');

        if (response.success) {
          this.paymentStatus = response.response.is_paid;
          console.log(response.response.city_id, 'ps');
          this.showCity(response.response.state_id)
          this.registrationForm.setValue({
            name: response.response.name,
            dob: response.response.dob,
            gender: response.response.gender,
            mobile_no: response.response.mobile_no,
            email_id: response.response.email_id,
            location: response.response.location,
            pincode: response.response.pincode,
            city_id: response.response.city.id,
            category: response.response.category,
            aadhar_no: response.response.aadhar_no,
            app_standard_id: response.response.app_standard_id,
            pre_standard_id: response.response.pre_standard_id,
            academic_session_id: response.response.academic_session_id,
            f_name: response.response.f_name,
            f_occupation: response.response.f_occupation,
            f_mobile_no: response.response.f_mobile_no,
            f_email: response.response.f_email,
            m_name: response.response.m_name,
            m_occupation: response.response.m_occupation,
            m_mobile_no: response.response.m_mobile_no,
            m_email: response.response.m_email,
            state_id: response.response.state_id,
            is_paid: '1',
            by: 'SA',
          });
        }
      });
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') != null) {
      this.school_code = localStorage.getItem('school_code');
      this.showState();
      this.showClass();
      this.showAcademic();
      this.showRegFee();
    }
  }

  onFileChange(event: any, value: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          console.log(event);
          // this.image = event.target.result
          if (value == 'birthCert') {
            this.birthCert = event.target.result;
          }
          if (value == 'addCert') {
            this.AddCert = event.target.result;
          }
          if (value == 'TransferCert') {
            this.transferCert = event.target.result;
          }
          if (value == 'lastClassMarsheet') {
            this.lastClassMarksheet = event.target.result;
          }
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  goToHome() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('registration_number');
        localStorage.removeItem('student_data');
        localStorage.removeItem('step');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.Toast.fire({
          icon: 'success',
          title: 'Success',
        });
      }
    });
  }

  downLoadPdf() {
    console.log('ok1');
    this.cs.pdfDownLoad(true);
  }

  showAcademic() {
    this.apis.showAcademicSession().subscribe((response: any) => {
      this.sessionList = response.response;
      console.log(response);
    });
  }
  showRegFee() {
    this.apis.showRegFee().subscribe((response: any) => {
      this.regAmount = response.response.registration_fee;
      if (this.regAmount < 1) {
        alert('please! Update Registration Fee');
      }
      console.log(this.regAmount);
    });
  }

  dobValidity(name: any, value: any) {
    var d1: any = new Date();
    var d2: any = new Date(value);
    // if(name == 'dob'){
    //   if (d1.getYear() > d2.getYear()) {
    //     this.apis.showNotifications(
    //       'error',
    //       'Please Select Valid Date'
    //     );
    //     return;
    //   }
    //   if (d1.getMonth() < d2.getMonth()) {
    //     this.apis.showNotifications(
    //       'error',
    //       'Please Select Valid DateM'
    //     );
    //     return;
    //   }
    // }
  }

  goback(value: any) {
    this.step = value;
    localStorage.setItem('step', this.step);
    console.log(value);
    if (value == 'active-step1') {
      this.updateOnBack();
    }
    if (value == 'active-step2') {
      this.onclickReset('student_data_image')

    }
  }

  updateOnBack() {
    if (
      localStorage.getItem('student_data') != null &&
      this.step == 'active-step1'
    ) {
      var response: any;
      response = localStorage.getItem('student_data');
      response = JSON.parse(response);
      this.showCity(response.state_id);
      console.log(response);
      this.registrationForm.setValue({
        name: response.name,
        dob: response.dob,
        gender: response.gender,
        mobile_no: response.mobile_no,
        email_id: response.email_id,
        location: response.location,
        pincode: response.pincode,
        city_id: response.city_id,
        category: response.category,
        aadhar_no: response.aadhar_no,
        app_standard_id: response.app_standard_id,
        pre_standard_id: response.pre_standard_id,
        academic_session_id: response.academic_session_id,
        f_name: response.f_name,
        f_occupation: response.f_occupation,
        f_mobile_no: response.f_mobile_no,
        f_email: response.f_email,
        m_name: response.m_name,
        m_occupation: response.m_occupation,
        m_mobile_no: response.m_mobile_no,
        m_email: response.m_email,
        state_id: response.state_id,
        is_paid: '1',
        by: 'SA',
      });
    }
  }

  onclickReset(value: any) {
    if (value == 'student_data') {
      this.registrationForm.reset();
      localStorage.removeItem('student_data');
      return;
    }

    if (value == 'student_data_image') {
      localStorage.removeItem('student_data_image');
      this.AddCert = undefined
      this.transferCert = undefined
      this.lastClassMarksheet = undefined
      this.fileSkip = false
    }
  }
}
