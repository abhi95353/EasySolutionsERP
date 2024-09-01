import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import { ClipboardService } from 'ngx-clipboard';
import jsPDF from 'jspdf';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-side-header',
  templateUrl: './side-header.component.html',
  styleUrls: ['./side-header.component.css'],
})
export class SideHeaderComponent implements OnInit {
  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService,
    private router: Router,
    private _clipboardService: ClipboardService,
    private fb:FormBuilder
  ) {
    this.getScreenSize();
  }
  menuBarsMaster: boolean = false;
  menuBarsNotification: boolean = false;
  menuBarsReport: boolean = false;
  menuBarsFees: boolean = false;
  menuBarsStudent: boolean = false;
  menuBarsSub: boolean = false;
  menuBarsStaff:boolean = false
  menuBarsTransport:boolean = false
  menuBarSetting:boolean = false
  slideMenuStatus: boolean = false;
  scrHeight: any;
  scrWidth: any;
  schoolData: any = []
  school_code: any = null;
  intervalId: any;
  today: number = 0;
  qrStatus:boolean = false
  sessionAddStatus:boolean = false
  sessionStatus:boolean = false
  sessionForm = this.fb.group({
    session:['xxx'],
    start_at:['2022'],
    end_at:['2023']
  })
  uuid:any = undefined
  schoolLoginStatus:boolean = false
  schollPassword:any
  schoolName:any
  qrInfo:any =''
  sessionList:any
  sessionId:any
  session_name:any
  deployOnAdmin:boolean = this.apis.deployOnAdmin
  panelName:any

  @ViewChild('htmlData') htmlData!: ElementRef;

  ngOnInit(): void {
    this.localStorageUpdate();
    if(!this.deployOnAdmin){
      this.showSchool();
    }
    this.intervalId = setInterval(() => {
      this.today = Date.now();
    }, 1000);
    this.cs.schoolCode$.subscribe((response: any) => {
      if (response.value) {
        // window.location.reload();
      }
    });
    this.panelName = localStorage.getItem('user_type')
  }

  menuBars(name: any, value: any) {
    //Menu Bars Opening and Closing
    if (name == 'Master' && this.menuBarsMaster == false) {
      this.menuBarsMaster = true;
      return;
    }
    if (name == 'Notification' && this.menuBarsNotification == false) {
      this.menuBarsNotification = true;
      return; 
    }
    if (name == 'Report' && this.menuBarsReport == false) {
      this.menuBarsReport = true;
      return;
    }
    if (name == 'Fees' && this.menuBarsFees == false) {
      this.menuBarsFees = true;
      return;
    }
    if(name == 'Subject' && this.menuBarsSub == false ){
      this.menuBarsSub = true
      return
    }
    if(name == 'Staff' && this.menuBarsStaff == false ){
      this.menuBarsStaff = true
      return
    }
    if (name == 'Student' && this.menuBarsStudent == false) {
      this.menuBarsStudent = true;
      return;
    }
    if (name == 'Transport' && this.menuBarsTransport == false) {
      this.menuBarsTransport = true;
      return;
    }
    if (name == 'Setting' && this.menuBarSetting == false) {
      this.menuBarSetting = true;
      return;
    }
     else {
      this.menuBarsMaster = false;
      this.menuBarsReport = false;
      this.menuBarsNotification = false;
      this.menuBarsFees = false;
      this.menuBarsStudent = false;
      this.menuBarsSub = false
      this.menuBarsStaff = false
      this.menuBarsTransport = false
      this.menuBarSetting = false
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  } 

  slideMenu(value: any) {
    this.slideMenuStatus = value;
  }

  showSchool() { 
    this.apis.showMigrationSchool().subscribe((res: any) => {
      this.schoolData = res;
    });
  }
  selectSchool(code: any, name: any, sub_host: any, id: any,uuid:any , base_url:any , all_data:any) {
    localStorage.setItem('session_id' , '24')
    if(sub_host == null){
      this.clearLocalStorage()
      return
    }
    var data = {
      school_code: code, 
      sub_host: sub_host,
      school_name: name,
      school_id: id,
      uuid: uuid,
      base_url: base_url,
      all_data:all_data
    };
    this.cs.setSchoolCode(data);
    this.localStorageUpdate();
    this.schoolLoginStatus = true
    this.schoolName = localStorage.getItem('school_name') 
  }
  onclickschoollogin(){
    var icon: any;
    var title: any;
    var loginData = {}
    loginData = {'username' : localStorage.getItem('username') , 'password' : this.schollPassword}
    this.apis
        .loginFunction(loginData, localStorage.getItem('sub_host'))
        .subscribe((response: any) => {
          if (response.success) {
            localStorage.setItem('token', response.response.data.token);
           
            icon = 'success';
            title = 'Success';
            this.router.navigateByUrl('dashboard');
            window.location.reload();
            this.apis.showNotifications('success' , response.message)

          } else {
            this.apis.showNotifications('error' , response.message)
          }
         
        });
   
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      if(this.deployOnAdmin){
        if(localStorage.getItem('session_id')==null){
        localStorage.setItem('session_id' , '24')
        }
      }
      this.school_code = localStorage.getItem('school_code');
      this.uuid = localStorage.getItem('uuid');
      this.showAllSession()
      // this.apis.openSchoolCheck(this.uuid).subscribe((response:any)=>{
      // })
      this.qrInfo = this.apis.qrInfo+this.uuid
    }
  }

  logout() {
    localStorage.clear()
    this.router.navigateByUrl('login');
    window.location.reload();
  }


  clearLocalStorage(){
    localStorage.clear()
    localStorage.setItem('token' , 'Admin')
    window.location.reload();

 
  }
  // onDestroy() {
  //   clearInterval(this.intervalId);
  // }

  copy(text: string) {
    this._clipboardService.copy(this.qrInfo);
    alert('copied');
  }

  openPDF(): void {
 
    var DATA: any;
    DATA = document.getElementById('htmlData');
    let doc = new jsPDF('p', 'px', [320,370]);

    doc.html(DATA, {
      callback: function (doc) {
        doc.save('Registration_QR.pdf'); 
      },
    });
  }
  qrBox(value:any){
    this.qrStatus = value
  }

  sessionBox(){
    if(this.sessionStatus == false){
      this.sessionStatus = true
    }else{
      this.sessionStatus = false
    }
  }

  sessionAddbox(value:any){
    this.sessionAddStatus = value
  }
  addSession(){
    if((this.sessionForm.value.start_at - this.sessionForm.value.end_at) != -1 ){
      this.apis.showNotifications('error' , 'Please! Check your session value')
      return
    }
  }

  cancel(){
    this.schoolLoginStatus = false
    this.localStorageClear()
  }


  localStorageClear(){
    localStorage.removeItem('school_code')
    localStorage.removeItem('sub_host')
    localStorage.removeItem('school_name')
    localStorage.removeItem('school_id')
    localStorage.removeItem('uuid')
    localStorage.removeItem('base_url')
    localStorage.removeItem('all_data')
    localStorage.removeItem('session_id')
  }

  showAllSession(){
    this.apis.showAllAcademicSession().subscribe((response:any)=>{
      if(response.response != null){
        this.sessionList = response.response
        for (let index = 0; index < this.sessionList.length; index++) {
          const element = this.sessionList[index];
          var session:any = localStorage.getItem('session_id')
          if(session == element.id)
          this.session_name = element.session
        }
        localStorage.setItem('session_name' , this.session_name)

        if(localStorage.getItem('session_id') == null || localStorage.getItem('session_id') == '0'){
          this.sessionId = this.sessionList.length
          
          localStorage.setItem('session_id' , this.sessionId)
        }          
      }
    })
  }

  selectSession(){
    console.log(this.sessionId)
    localStorage.setItem('session_id' , this.sessionId)
    this.showAllSession()
    window.location.reload()
  }
}
