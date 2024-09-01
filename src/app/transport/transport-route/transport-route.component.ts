import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transport-route',
  templateUrl: './transport-route.component.html',
  styleUrls: ['./transport-route.component.css']
})
export class TransportRouteComponent implements OnInit {

  
  constructor(private fb:FormBuilder , private apis:MasterAPIsServicesService , private route:ActivatedRoute) { }

  school_code: any = 'Select School';
  stateList:any = []
  cityList:any = []
  loadingStatus:boolean = false
  sessionList:any = []
  action:any = 'add'
  id:any
  uuid:any
  staffForm = this.fb.group({
    'tr_no' : [''],
    'tr_name' : [''],
    'tr_desc' : [''],
    'fee' : [''],
    'note' : [''],
  })
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

  ngOnInit(): void {
   
    this.route.paramMap.subscribe((response:any)=>{
      this.localStorageUpdate()
      console.log(response)
      this.action = response.params.action
      if(response.params.action == 'update'){
        var data:any
        data = JSON.parse(response.params.data)
        this.id = data.id
        this.uuid = data.uuid
        this.staffForm.patchValue({
          'tr_no' : data.tr_no,
          'tr_name' : data.tr_name,
          'tr_desc' : data.tr_desc,
          'fee' : data.fee,
          'note' : data.note,
        })
      }

      else{
        this.staffForm.reset()
        this.action = 'add'
      }
    })
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showState()
      this.showAcademic()
      this.school_code = localStorage.getItem('school_code');
    }
  }

  createSubject(){
    this.loadingStatus = true
      if(this.action == 'add'){
      this.apis.createTransportRoute(this.staffForm.value).subscribe((response:any)=>{
        console.log(response)
        if(response.success){
          this.apis.showNotifications('success' , 'Success')
          this.staffForm.reset()
        }else{
          this.apis.showNotifications('error' , response.message)
        }
        this.loadingStatus = false
      })
    }

    if(this.action == 'update'){
      this.apis.updateTransportRoute(this.id , this.uuid , this.staffForm.value).subscribe((response:any)=>{
        if(response.success){
          this.apis.showNotifications('success' , 'Success')
        }else{
          this.apis.showNotifications('error' , response.message)
        }
        this.loadingStatus = false
      })
    }

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

  showAcademic() {
    this.apis.showAcademicSession().subscribe((response: any) => {
      this.sessionList = response.response;
      console.log(response);
    });
  }




}
