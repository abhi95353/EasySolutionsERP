import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admission-details-list',
  templateUrl: './admission-details-list.component.html',
  styleUrls: ['./admission-details-list.component.css']
})
export class AdmissionDetailsListComponent implements OnInit {

  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService , private fb:FormBuilder) { }
  regBoxStatus:boolean = false;
  studentData:any = []
  studentListLayout:boolean = false
  layout:any
  birthCert: any = undefined; 
  passportPhoto: any = undefined;
  id:any
  uuid:any
  cityList:any = []
  stateList:any = []
  classList:any = [] 
  applicationForm = this.fb.group({
    cred: [''],
    reg_no: [''],
    account:[''],
    admission_no:[''],
    academic_session:[''],
    roll_no:[],
    notation:[],
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
    standard:[]
  });
  ngOnInit(): void {
    this.cs.admissionBox$.subscribe((response:any)=>{
      this.layout = response.layout
      this.id = response.id
      this.uuid = response.uuid
      if(response.layout == 'student-list'){
        this.studentListLayout = true
      }else{
        this.studentListLayout = false
      } 
      this.showStudentList(response.id , response.uuid)
    })
  }

  onClickRegBox(value:any){
    this.regBoxStatus = value
  }
  showStudentList(id:any , uuid:any){
    this.apis.showAllStudent(id,uuid).subscribe((response:any)=>{
      console.log(response)
      this.studentData = response.response
      this.regBoxStatus = true
      this.applicationForm.patchValue({
        cred:  this.studentData.parental.cred,
        reg_no: '',
        account:this.studentData.account,
        admission_no:this.studentData.student_admission.admission_no,
        academic_session:this.studentData.academic_session.session,
        roll_no:this.studentData.roll_no,
        notation:this.studentData.division.id,
        instruction_medium: this.studentData.instruction_medium,
        mother_tongue: this.studentData.mother_tongue,
        name: this.studentData.name,
        dob: this.studentData.dob,
        gender: this.studentData.gender,
        mobile_no: this.studentData.mobile_no,
        email_id: this.studentData.email_id,
        location: this.studentData.location,
        pincode: this.studentData.pincode,
        city_id: this.studentData.city_id,
        category: this.studentData.category,
        aadhar_no: this.studentData.aadhar_no,
        birth_cert_no: this.studentData.birth_cert_no,
        f_name: this.studentData.parental.f_name,
        f_mobile_no: this.studentData.parental.f_mobile_no,
        f_email: this.studentData.parental.f_email,
        f_dob: this.studentData.parental.f_dob,
        f_occupation: this.studentData.parental.f_occupation,
        m_name: this.studentData.parental.m_name, 
        m_mobile_no: this.studentData.parental.m_mobile_no,
        m_email: this.studentData.parental.m_email,
        m_dob: this.studentData.parental.m_dob,
        m_occupation: this.studentData.parental.m_occupation,
        state_id: this.studentData.state_id,
        country: ['India'],
        p_income:this.studentData.parental.p_income,
        disability: this.studentData.disability,
        is_ew: ['0'],
        is_3c: ['0'],
        app_standard_id:this.studentData.standard.id,
        standard:this.studentData.standard.class,
        is_transport:['0'],
        academic_session_id:this.studentData.academic_session.id,
        transportRoute_id:[],
        transportRoute_uuid:[]
      })
    })
  }

  onFileChange(event: any, value: any) {
    var data:any = []
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          if (value == 'birthCert') {
            this.birthCert = event.target.result;
            data = {'birthCert' :event.target.result}
          }
          if (value == 'passphoto') {
            this.passportPhoto = event.target.result;
            data = {'passphoto' :event.target.result}

          }
        };
        reader.readAsDataURL(event.target.files[i]);
      }

    }
  }

  onSubmit(data:any){
    console.log(this.id , this.uuid , this.applicationForm.value)
    this.apis.updateStudentList(this.id , this.uuid , this.applicationForm.value).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.cs.studentListRefresh(true);
        this.regBoxStatus = false
        // (document.getElementById('htmlData') as HTMLHtmlElement).style.display = 'none' 
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
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


}
 