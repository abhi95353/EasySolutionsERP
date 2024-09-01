import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
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
  classList:any=[]
  sectionList:any = []
  templateLoading:boolean = false
  isTemplateSelcted:boolean = false
  searchBy:any = "account"
  admissionNo: any = '';
  hintBox:boolean = false
  studentDataList: any = [];

  sms_details = this.fb.group({
    group_list : this.fb.array([
      ]),
      class_list:this.fb.array([
        
      ]),
      individual:[]
  })

  get individual() {
    return this.sms_details.get('individual') as FormArray;
  }

  get class_list() {
    return this.sms_details.get('class_list') as FormArray;
  }

  get group_list() {
    return this.sms_details.get('group_list') as FormArray;
  }
  addGroup(id:any , name:any , status:any) {
    this.group_list.push(this.fb.group({
      id:[id],
      name:[name],
      status:[status]
    }),);
  }
  addSection(pivot:any , class_name:any , section:any){
   this.class_list.push( this.fb.group({
    section_pivot_id:[pivot],
    class_name:[class_name],
    section:[section],
  }))
  }
  addIndividual(mobile_no:any){
   this.individual.patchValue(mobile_no)
  }

  onClickGroup(id:any , name:any , event:any){
    if (event.target.checked === true) {
      this.addGroup(id,name,1)
    } else {
      for (let i = 0; i < this.sms_details.value.group_list.length; i++) {
        const element = this.sms_details.controls.group_list.value[i];
        if(element.id == id){
          this.group_list.removeAt(i)
        }
      }
    console.log(this.group_list)
      
    }
  }

  onClickSection(pivot_id:any , class_name:any , section:any, event:any){
    console.log(pivot_id , class_name , section , event)
    if (event.target.checked === true) {
      this.findDuplicateSection(pivot_id,class_name,section)
    } else {
      for (let i = 0; i < this.sms_details.value.class_list.length; i++) {
        const element = this.sms_details.controls.class_list.value[i];
        console.log(element.section_pivot_id , pivot_id)
        if(element.section_pivot_id == pivot_id){
          this.class_list.removeAt(i)
        }
      }      
    }
  }

  findDuplicateSection(pivot_id:any , class_name:any , section:any){
    var flag:any
    if(this.class_list.length == 0){
      this.addSection(pivot_id,class_name,section)
      return
    }
   for (let i = 0; i < this.class_list.length; i++) {
     const element = this.class_list.value[i];
     console.log(element , pivot_id)
     if(element.section_pivot_id == pivot_id){
       alert('Section Already Selected')
       flag = 0
       return
     }else{
      flag = 1
     }
   }
   if(flag == 1){
    this.addSection(pivot_id,class_name,section)
   }
  }


  ngOnInit(): void {
    this.localStorageUpdate()
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showTemplate()
      this.showClass()
      console.log(this.sms_details)
      this.school_code = localStorage.getItem('school_code');
    }
  }

  updateTagName(value:any){
    this.searchBy = value
  }

  SendSMS(){
    this.loadingStatus = true
    var data = {}
    var mobileNumber:any = null
    console.log(data , this.mobileNoString , mobileNumber)

    if(this.mobileNoString != undefined){
    mobileNumber = this.mobileNoString.split(",")
    mobileNumber.pop()
    this.addIndividual(mobileNumber)
  }
    data = {'id' : this.id , 'uuid' : this.uuid , 'mob' : mobileNumber, 'var' : this.stringSms , 'receiver_details' : this.sms_details.value} 
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
    this.templateLoading = true
    this.apis.showTemplate().subscribe((response: any) => {
      this.templteList = response.response;
      this.templateLoading = false
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
    this.isTemplateSelcted = true
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

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
      console.log(this.classList)
    });
  }

  onSelectClass(event: any) {
    var value: any;
    value = JSON.parse(event.target.value);
    this.apis
      .showSelectiveClass(value.id, value.uuid)
      .subscribe((response: any) => {
        this.sectionList = [];
        this.sectionList = response.response;
        console.log(this.sectionList)
      });
  }

  onChangeBox(account: any) {
    this.admissionNo = account;
    setTimeout(() => {
      this.hintBox = false;
    }, 500);
  }
  onFocusOut() {
    setTimeout(() => {
      this.hintBox = false;
    }, 500);
  }

  showAllStudent() {
    this.apis.allStudentList().subscribe((response: any) => {
      this.studentDataList = response.response.data;
    });
  }


  search(value: any) {
    var newDataList = [];
    this.hintBox = true;
    newDataList = this.studentDataList;
    this.studentDataList = [];

    if (value.inputType.match('deleteContentBackward')) {
      this.showAllStudent();
    } else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi');
        if (this.searchBy == 'account') {
          if (newDataList[i].account.match(str)) {
            this.studentDataList.push(newDataList[i]);
          }
        }
        if (this.searchBy == 'f_name') {
          if (newDataList[i].parental.f_name.match(str)) {
            this.studentDataList.push(newDataList[i]);
          }
        }
        if (this.searchBy == 'name') {
          if (newDataList[i].name.match(str)) {
            this.studentDataList.push(newDataList[i]);
          }
        }
      }
    }
  }

  resetButton(){
    this.sms_details.value.group_list = []
    this.sms_details.value.class_list = []
    this.sms_details.value.individual = []
    this.fakeForVar = []
    console.log(this.sms_details)
  }

}
