import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-manual-sms',
  templateUrl: './manual-sms.component.html',
  styleUrls: ['./manual-sms.component.css']
})
export class ManualSmsComponent implements OnInit {

  constructor(private fb:FormBuilder , private apis:MasterAPIsServicesService) { }
  school_code: any = 'Select School';
  stateList:any = []
  cityList:any = []
  loadingStatus:boolean = false
  templteList:any = []
  flagSMS:number = 0
  mobileNoString:string
  mobileNumberArray:any = []
  fakeForVar:any
  stringSms:any = []
  smsDesign:any
  id:any
  uuid:any
  ngOnInit(): void {
    this.localStorageUpdate()
    this.showTemplate()
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showTemplate()
      this.school_code = localStorage.getItem('school_code');
    }
  }


  SendSMS(){
    this.loadingStatus = true
    var data = {}
    var mobileNumber = this.mobileNoString.split(",")
    mobileNumber.pop()
    data = {'id' : this.id , 'uuid' : this.uuid , 'mob' : mobileNumber, 'var' : this.stringSms} 
    console.log(data , this.mobileNoString , mobileNumber)

    this.apis.SMSsend(data).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , 'Success')
      }else{
        this.apis.showNotifications('error' , response.message)
      }
      this.loadingStatus = false
    })
  }


  showTemplate() {
    this.apis.showTemplate().subscribe((response: any) => {
      this.templteList = response.response;
      console.log(response);
    });
  }

  onclickSelectSMS(id:any , uuid:any , sms:any){
    this.id = id
    this.uuid = uuid
    this.flagSMS = 0
    var replaced = sms.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
    var smsArray = replaced.split(" ")
    this.smsDesign = smsArray
    for (let index = 0; index < smsArray.length; index++) {
      const element = smsArray[index];
      if(element == 'var'){
        this.flagSMS = this.flagSMS + 1
      } 
    }
    this.fakeForVar = new Array(this.flagSMS);
  }

  mobileNoUpdate(value:any){
    var newValue = value.replace(/[,]/g,'');
    if(newValue.length % 10 == 0  && newValue.length != 0){
      this.mobileNoString = this.mobileNoString + ','
    }
  }

  createString(value:any , i:any){
    for (let index = 0; index < this.flagSMS; index++) {
      if(index == i){
        this.stringSms[i] = value 
      }      
    }
    console.log(this.stringSms)
  }

}
