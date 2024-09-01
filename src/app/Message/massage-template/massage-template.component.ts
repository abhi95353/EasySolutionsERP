import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
@Component({
  selector: 'app-massage-template',
  templateUrl: './massage-template.component.html',
  styleUrls: ['./massage-template.component.css']
})
export class MassageTemplateComponent implements OnInit {
  constructor(private apis:MasterAPIsServicesService , private fb:FormBuilder , private route:ActivatedRoute , private router:Router) { }
  school_code:any
  exportData:any = undefined
  loaderSubmit:boolean = false
  templteList:any = []
  templateLoading:boolean = false
  id:any
  uuid:any
  msgTempForm = this.fb.group({
    name: [''],
    design: [''],
    dlt_header: [''],
    header_id: [''],
    entity_id: [''],
    template_id: [''],
    dlt_message: [''],
    sms_type: ['TXT'],
    flow_id:['null']
  })
  action:any
  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any)=>{
      var data:any = {}
      this.action = params.params.action;
      if(this.action == 'update'){
        data = JSON.parse(params.params.data)
        this.id = data.id
        this.uuid = data.uuid
        this.msgTempForm.patchValue(data)
        console.log(this.msgTempForm.value);

      }
    })
    this.localStorageUpdate()
    if (localStorage.getItem('sub_host') != 'null') {
      this.showTemplate()
      this.msgTempForm.reset()
      this.router.navigate(['/msg-template', {add : 'Add'}]);
    }
  } 

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
    }
  }

  

  showTemplate() {
    this.templateLoading = true
    this.apis.showTemplate().subscribe((response: any) => {
      this.templteList = response.response;
      this.templateLoading = false
      console.log(response);
    });
  }

  submit(){
   if(this.action == 'update'){
    this.apis.updateTemplate(this.id , this.uuid , this.msgTempForm.value).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.showTemplate()
  
      }else{
        this.apis.showNotifications('error' , response.message)
      }
     })
   }else{
    this.apis.postTemplate(this.msgTempForm.value).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.showTemplate()
  
      }else{
        this.apis.showNotifications('error' , response.message)
      }
     })
   }
  }


 scroll(){
  this.apis.moveToTop()
 }

 reset(){
  this.msgTempForm.reset()
      this.router.navigate(['/msg-template', {add : 'Add'}]);
 }



}
