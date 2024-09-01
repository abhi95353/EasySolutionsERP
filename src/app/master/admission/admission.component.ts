import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../components-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.css'],
})
export class AdmissionComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private apis: MasterAPIsServicesService,
    private ms:ComponentsServicesService,
    private router:Router
  ) {}
  serviceBoxStatus:boolean = false;

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
  submitStatus: boolean = false;
  today: number = Date.now();
  stateList: any;
  cityList: any;
  classList: any;
  school_code: any = 'Select School';
  action: any;
  id: any = null;
  studentList: any;
  step: any = 'active-step1';
  birthCert: any = undefined;
  passportPhoto: any = undefined;
  addmission_id: any;
  faciltyStatus:boolean = false
  routeData:any = []

  applicationForm = this.fb.group({
    cred: [''],
    reg_no: [''],
    instruction_medium: [''],
    mother_tongue: [''],
    name: [''],
    dob: [''],
    gender: ['M'],
    mobile_no: [''],
    email_id: [''],
    location: [''],
    pincode: [''],
    city_id: [''],
    category: [''],
    aadhar_no: [''],
    birth_cert_no: [''],
    f_name: [''],
    f_mobile_no: [''],
    f_email: [''],
    f_dob: [''],
    f_occupation: [''],
    m_name: [''],
    m_mobile_no: [''],
    m_email: [''],
    m_dob: [''],
    m_occupation: [''],
    state_id: [''],
    country: ['India'],
    p_income: [''],
    disability: [''],
    is_ew: ['0'],
    is_3c: ['0'],
    app_standard_id:[''],
    is_transport:['0'],
    academic_session_id:[],
    transportRoute_id:[],
    transportRoute_uuid:[],
    pre_standard_id:[''],
    admission_no:[''],
    admission_date:[''],
  });
  transportServiceStatue: boolean = false;
  studentDataList: any = [];
  sessionList:any
  is_direct:any = 'DA'
  serviceForm = this.fb.group({
    is_transport: []
  });

  paymentRequest:any = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "VISA", "MASTERCARD"]
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId"
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant"
    }, 
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "100.00",
      currencyCode: "INR",
      countryCode: "IND"
    }
  };

  ngOnInit(): void {
    this.localStorageUpdate();
    this.updateOnBack()
    if (localStorage.getItem('app-step')) {
      this.step = localStorage.getItem('app-step');
      this.addmission_id = localStorage.getItem('account');
    }
  }

  onLoadPaymentData(event:any) {
    console.log("load payment data", event.detail);
  }
  onFileChange(event: any, value: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          if (value == 'birthCert') {
            this.birthCert = event.target.result;
          }
          if (value == 'passphoto') {
            this.passportPhoto = event.target.result;
          }
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
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

  submit() {
    console.log(this.applicationForm.value)
    // if(!this.faciltyStatus){
    //   alert('Warning! Please Make Sure Admission Fee Is Designed For Applied Standard')
    //   return
    // }
    var icon: any;
    var title: any;
    this.submitStatus = true;
    console.log(this.applicationForm.value);

    localStorage.setItem( 
      'student_admission_data',
      JSON.stringify(this.applicationForm.value)
    );

    this.Toast.fire({
      icon: 'success',
      title: 'Success',
    });
    this.step = 'active-step2';
    localStorage.setItem('app-step', this.step);
    this.submitStatus = false;
  }

  submitDoc() {
    var icon: any;
    var title: any;
    this.submitStatus = true
    // if (this.birthCert == undefined || this.passportPhoto == undefined) {
    //   icon = 'error';
    //   title = 'Please Select File';
    //   this.submitStatus = false;
    //   this.Toast.fire({
    //     icon: icon,
    //     title: title,
    //   });
    //   return;
    // }
    var data: any;
    data = [
      {
        account: this.addmission_id,
        birth_cert: this.birthCert,
        photo: this.passportPhoto
      },
    ];
    
    localStorage.setItem('student_admission_data_image', JSON.stringify(data));
    this.final_submit();
  }

  services() {
    this.submitStatus = true;
    this.step = 'active-step4';
    this.Toast.fire({
      icon: 'success',
      title: 'Success',
    });
    console.log(this.serviceForm.value);
    localStorage.setItem('app-step', this.step);
    this.submitStatus = false;
    // this.router.navigateByUrl('download-form-admission')

  }
  goToDocument() {
    this.step = 'active-step3';
    localStorage.setItem('transport_status', 'false');
    localStorage.setItem('app-step', this.step);
  }
  updateServices() {
    var studetn_data: any = localStorage.getItem('student_admission_data');
    this.studentList = JSON.parse(studetn_data);
  }

  final_submit() {
    var icon: any;
    var title: any;
    var student_data:any = localStorage.getItem(
      'student_admission_data'
    );
    var student_transport: any = localStorage.getItem(
      'student_transport_data'
    );
    var student_image: any = localStorage.getItem(
      'student_admission_data_image'
    );

    var student_admission_data: any = JSON.parse(student_data)
    var student_admission_data_image: any = JSON.parse(student_image)
    var transport_status: any = localStorage.getItem('transport_status');

    this.apis
      .addmissionStudent(student_admission_data)
      
      .subscribe((response: any) => {
        console.log(response);

        if (response.success) {
          console.log(response);
          this.addmission_id = response.response;
          localStorage.setItem('account', response.response);
          for (
            let i = 0;
            i < student_admission_data_image.length;
            i++
          ) {
            const element = student_admission_data_image[i];
            element.account = this.addmission_id;
          }
          console.log('image' ,student_admission_data_image )

          this.apis
            .addmissionStudentDocument(student_admission_data_image[0])
            .subscribe((response: any) => {
              console.log(response);

              if(response.success){
                this.step = 'active-step3';
                localStorage.setItem('app-step', this.step);
                icon = 'success';
                title = 'Success';
              }else{ 
                icon = 'error';
                title = 'Error';
              }
              this.Toast.fire({
                icon: icon,
                title: response.message,
              });
            });
        } else {
          icon = 'error';
          title = 'Error';     
          this.Toast.fire({
            icon: icon,
            title: response.response,
          }); 
        }
        this.submitStatus = false;
      
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
    });
  }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
    });
  }

  showSelectiveStudent(data:any) {
    var data:any = JSON.parse(data)
    this.apis
      .showSelectiveStudentRegistration(data.id , data.uuid) 
      .subscribe((response: any) => {
        if (response.success) {
          console.log(response)
          this.checkFacilty(response.response.app.id , response.response.app.uuid , response.response.academic_session_id)
          this.showCity(response.response.state_id);
          this.applicationForm.patchValue({
            name: response.response.name,
            reg_no: response.response.reg_no,
            dob: response.response.dob,
            gender: response.response.gender,
            mobile_no: response.response.mobile_no,
            email_id: response.response.email_id,
            location: response.response.location,
            pincode: response.response.pincode,
            city_id: response.response.city_id,
            category: response.response.category,
            aadhar_no: response.response.aadhar_no,
            f_name: response.response.f_name,
            f_occupation: response.response.f_occupation,
            f_mobile_no: response.response.f_mobile_no,
            f_email: response.response.f_email,
            m_name: response.response.m_name,
            m_occupation: response.response.m_occupation,
            m_mobile_no: response.response.m_mobile_no,
            m_email: response.response.m_email,
            state_id: response.response.state_id,
            app_standard_id: response.response.app_standard_id,
            academic_session_id: response.response.academic_session_id,
            pre_standard_id: response.response.pre_standard_id,
            is_transport: '0',
            country: 'India',
          });
        }
      });
  }

  showRegistration() {
    this.apis.showRegisteredStudent().subscribe((response: any) => {
      this.studentList = response.response;
    });
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showRegistration();
      this.showState();
      this.showClass();
      this.showRoute();
      this.showAcademic();    
      this.school_code = localStorage.getItem('school_code');
    }
  }

  goToHome() {
        localStorage.removeItem('account');
        localStorage.removeItem('student_admission_data');
        localStorage.removeItem('app-step');
        localStorage.removeItem('student_transport_data');
        localStorage.removeItem('student_admission_data_image');
        localStorage.removeItem('transport_status');
        localStorage.removeItem('account');

        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.Toast.fire({
          icon: 'success',
          title: 'Success',
        });
  }
  
  downloadPdf(){
    // this.ms.pdfAdmissionDownLoad(true)
  }

  checkFacilty(id:any , uuid:any , session:any){
    this.apis.checkFacilityByClass(id,uuid , session).subscribe((response:any)=>{
      console.log(response , 'fp')
      if(response.success){
        this.faciltyStatus = true
      }else{
        this.apis.showNotifications('warning' , response.message)
        alert(response.message) 
      }
    }) 
  }


  onClickBack(value: any) {
    this.step = value;
    localStorage.setItem('app-step', this.step);
    console.log(value);
    if (value == 'active-step1') {
      this.updateOnBack();
    }
    if (value == 'active-step2') {
      localStorage.removeItem('student_data_image');
    }
  }

  updateOnBack() {
    if (
      localStorage.getItem('student_admission_data') != null &&
      this.step == 'active-step1'
    ) {
      var response: any;
      response = localStorage.getItem('student_admission_data');
      response = JSON.parse(response);
      this.faciltyStatus = true
      this.showCity(response.state_id);
      console.log(response);
      this.applicationForm.setValue({
        cred: response.cred,
        reg_no: response.reg_no,
        instruction_medium: response.instruction_medium,
        mother_tongue: response.mother_tongue,
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
        birth_cert_no: response.birth_cert_no,
        f_name: response.f_name,
        f_mobile_no: response.f_mobile_no,
        f_email: response.f_email,
        f_dob: response.f_dob,
        f_occupation: response.f_occupation,
        m_name: response.m_name,
        m_mobile_no:response.m_mobile_no,
        m_email: response.m_email,
        m_dob: response.m_dob,
        m_occupation: response.m_occupation,
        state_id: response.state_id,
        country: response.country,
        p_income: response.p_income,
        disability: response.disability,
        is_ew: response.is_ew,
        is_3c: response.is_3c,
        app_standard_id:response.app_standard_id,
        pre_standard_id:response.pre_standard_id,
        admission_no:response.admission_no,
        admission_date:response.admission_date,
        is_transport:response.is_transport,
        academic_session_id:response.academic_session_id,
        transportRoute_id:response.transportRoute_id,
        transportRoute_uuid:response.transportRoute_uuid
      });
    }
  }

  onclickReset(value: any) {
    if (value == 'student_data') {
      this.applicationForm.reset();
      localStorage.removeItem('student_admission_data');
      return;
    }

    if (value == 'student_admission_data_image') {
      localStorage.removeItem('student_admission_data_image');
      this.passportPhoto = undefined
      this.birthCert = undefined
    }
  }

  routeBus(value:any){
    if(value == 1){
      this.serviceBoxStatus = true
    }else{
      this.serviceBoxStatus = false
      this.applicationForm.patchValue({transportRoute_id : null , transportRoute_uuid:null})
    }
    console.log(this.applicationForm.value)
  }
  onClickServiceBox(value:any ){ 
  this.serviceBoxStatus = value
  }
  showRoute(){
    this.apis.showTransportRoute().subscribe((response: any) => {
      console.log(response);
      this.routeData = response.response;
    });
  }
  onClickCheckBox(id:any , uuid:any){
    console.log(id, uuid)
    this.applicationForm.patchValue({transportRoute_id : id , transportRoute_uuid:uuid})
    console.log(this.applicationForm.value)
  }
  onClickClearBox(){
    this.applicationForm.patchValue({transportRoute_id : null , transportRoute_uuid:null})
  }
  showAcademic() {
    this.apis.showAcademicSession().subscribe((response: any) => {
      this.sessionList = response.response;
      console.log(response);
    });
  }

  showAdmType(value:any){
    this.is_direct = value
    console.log(this.is_direct)
    this.applicationForm.patchValue({reg_no : null})
  }
}
