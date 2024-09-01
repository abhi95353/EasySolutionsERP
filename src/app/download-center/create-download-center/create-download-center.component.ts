import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-create-download-center',
  templateUrl: './create-download-center.component.html',
  styleUrls: ['./create-download-center.component.css']
})
export class CreateDownloadCenterComponent implements OnInit {
  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService  , private fb:FormBuilder) { }
  regBoxStatus:boolean = false;
  action:any
  id:any
  uuid:any
  searchText:any
  hintBox: boolean = false;
  studentDataList:any
  htmlContent = '';
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
  noticeForm:FormGroup = this.fb.group({
  title:[''],
  description:[''],
  audio:[''],
  document:[''],
  image:[''],
  video:[''],
  })
  
  ngOnInit(): void {
    this.cs.downloadCenterBox$.subscribe((response:any)=>{
      console.log(response)
        this.regBoxStatus = true
    })
  }

  onClickRegBox(value:any){
    this.regBoxStatus = value
  }

  submit(){ 
  this.apis.postDownloadCenter(this.noticeForm.value).subscribe((response:any)=>{
    console.log(response)
    if(response.success){
      this.apis.showNotifications('success' , response.message)
      this.cs.refreshNoticsBox(true)
      this.noticeForm.reset()
      this.regBoxStatus = false
      return
    }
    this.apis.showNotifications('error' , response.message)
  })
  }
  
}
 
