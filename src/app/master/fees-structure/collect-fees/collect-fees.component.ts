import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

import { ComponentsServicesService } from '../../components-services.service';
import { ScriptLoad } from '../../../../assets/js/payment';
import { WindowRefService } from 'src/app/window-ref.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-collect-fees',
  templateUrl: './collect-fees.component.html',
  styleUrls: ['./collect-fees.component.css'],
  providers: [WindowRefService],
  
})
export class CollectFeesComponent implements OnInit {
  constructor(
    private apis: MasterAPIsServicesService,
    public cs: ComponentsServicesService,
  ) {}

 
  submitStatus: boolean = false;
  schoolData: any = [];
  studentData: any = [];
  school_code: any = 'Select School';
  school_id: any;
  admissionNo: any = null;
  uuid: any;
  hintBox: boolean = false;
  studentDataList: any = [];
  searchBy: any = 'account';
  tagName: any = 'Account No';
  feeType:any = 'MF'
  searchType:string = 'full'
  univeralStudentData:any  
  searchText:any
  searchTerm:string = "account"
  @ViewChild("searchInput") myInputField: ElementRef;

  ngOnInit(): void {
    this.localStorageUpdate();
    this.cs.focusCollect$.subscribe((response:any)=>{
      if(response){
        this.ngAfterViewInit()
      }
    })
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.myInputField.nativeElement.focus();
      this.searchText = ''
    }, 1);
    }



  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code');
      this.school_id = localStorage.getItem('school_id');
      this.uuid = localStorage.getItem('uuid');
      this.showAllStudent();
    }
  }


  showAllStudent() {
    this.apis.allStudentList().subscribe((response: any) => {
      console.log(response)
       var studentDataList:any = response.response.data;
      this.studentDataList = studentDataList.filter(this.deleteUuid)
    });
  }

  deleteUuid(data:any){
     delete data['uuid']
    //  delete data['division']
     delete data['id']
     delete data['parental']['id']
    //  delete data['standard']

     return data
  }

 

  searchByAdmission() {
    // call all the api
    if(this.admissionNo.length < 1 || this.admissionNo == null){
      return
    }
   
    var data:any = {'account_no' : this.admissionNo , 'auto_print' : false , 'type' : this.feeType}
    this.cs.passAccountNo(data)
  }
 
  feeOption(value:any){
    this.feeType = value
    if(this.admissionNo.length < 1 || this.admissionNo == null){
      return
    }
    var data:any = {'account_no' : this.admissionNo , 'auto_print' : false , 'type' : this.feeType}
    this.cs.passAccountNo(data);
  }
 
  

  focusIn(){
    this.hintBox = true;
  }


  onChangeBox(account: any) {
    this.admissionNo = account;
    this.searchText = account
    setTimeout(() => {
      this.searchByAdmission()
    }, 500);
  }
  onFocusOut() {
    setTimeout(() => {
      this.hintBox = false;
    }, 300);
  }
  openList(){
    this.cs.paymentNoticsBox(true)
  }


  

} 
 