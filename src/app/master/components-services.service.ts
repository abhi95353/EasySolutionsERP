import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsServicesService {

  // Global Variable
  public  feesSearchStatus:boolean = false
  constructor() { }
  private _classesBox = new Subject<string>();
  private _feesbox = new Subject<string>();
  private _school_code = new Subject<string>();
  private _registrationBox = new Subject<string>()
  private _admissionBox = new Subject<string>()
  private _downloadPdf = new Subject<string>();
  private _classRefresh =new Subject<string>();
  private _downloadAdmissionPdf = new Subject<string>()
  private _sectionListBox = new Subject<string>()
  private _certificateBox = new Subject<string>()
  private _rollListBox = new Subject<string>()
  private _coordinatorBox = new Subject<string>()
  private _roleAssignBox = new Subject<string>()
  private _roleAssignBoxUpdate = new Subject<string>()
  private _noticeBox = new Subject<string>()
  private _refreshNoticeBox = new Subject<string>()
  private _paymentLinkBox = new Subject<string>()


  private _feesCollection = new Subject<string>();
  private _pdfView = new Subject<string>();

  private _concessionBox = new Subject<string>();
  private _transportBox = new Subject<string>();
  private _transportBoxData = new Subject<string>();

  private _studentList = new Subject<string>();
  private _focusCollect = new Subject<string>();
  private _downloadCenterBox = new Subject<string>();

  classesBox$ = this._classesBox.asObservable();
  coordinatorBox$ = this._coordinatorBox.asObservable();
  feesBox$ = this._feesbox.asObservable();
  schoolCode$ = this._school_code.asObservable();
  registrationBox$ =this._registrationBox.asObservable()
  admissionBox$ =this._admissionBox.asObservable()
  classRefesh$ = this._classRefresh.asObservable()
  downlLoadPdf$ = this._downloadPdf.asObservable()
  downloadAdmissionPdf$ = this._downloadAdmissionPdf.asObservable()
  sectionListBox$ = this._sectionListBox.asObservable()
  rollListBox$ = this._rollListBox.asObservable()
  certificateBox$ = this._certificateBox.asObservable()
  roleAssignBox$ = this._roleAssignBox.asObservable()
  roleAssignBoxUpdate$ = this._roleAssignBoxUpdate.asObservable()
  noticeBox$ = this._noticeBox.asObservable()
  downloadCenterBox$ = this._downloadCenterBox.asObservable()
  refreshNoticeBox$ = this._refreshNoticeBox.asObservable()
  paymentLinkBox$ = this._paymentLinkBox.asObservable()
  feesCollection$ = this._feesCollection.asObservable()
   pdfView$ = this._pdfView.asObservable()
   concessionBox$ = this._concessionBox.asObservable()
   transportBox$ = this._transportBox.asObservable()
   transportBoxDdata$ = this._transportBoxData.asObservable()

   studentList$ = this._studentList.asObservable()
   focusCollect$ = this._focusCollect.asObservable()
  




  setClassesBox(data:any){
    this._classesBox.next(data)
  }

  setCordinatorBox(data:any){
    this._coordinatorBox.next(data)
  }


  setStaffRoleBox(data:any){
    this._roleAssignBox.next(data)
  }

  setFeesBox(data:any){
    this._feesbox.next(data);
  }

  setSchoolCode(data:any){
    localStorage.setItem('sub_host' , data.sub_host)
    localStorage.setItem('school_code' , data.school_code)
    localStorage.setItem('school_name' , data.school_name)
    localStorage.setItem('school_id' , data.school_id)
    localStorage.setItem('uuid' , data.uuid)
    localStorage.setItem('base_url' , data.base_url)
    localStorage.setItem('role' , 'Super Admin')
    localStorage.setItem('all_data' , JSON.stringify( data.all_data))
    let dt:any 
    dt = {value : true}
    this._school_code.next(dt)
  }

  setRegBox(data:any){
    this._registrationBox.next(data);
  }

  setAddBox(data:any){
    this._admissionBox.next(data);
  }

  setSecBox(data:any){
    this._sectionListBox.next(data);
  }


  setRollBox(data:any){
    this._rollListBox.next(data);
  }

  refreshClasses(data:any){
    this._classRefresh.next(data)
  }

  refreshRoleData(data:any){
    this._roleAssignBoxUpdate.next(data)
  }

  pdfDownLoad(data:any){
    this._downloadPdf.next(data)
  }
  pdfAdmissionDownLoad(data:any){
    this._downloadAdmissionPdf.next(data)
  }


  cetificateDownload(data:any){
    this._certificateBox.next(data)
  }

  setNoticeBox(data:any){
    this._noticeBox.next(data)
  }

  setDownloadCenterBox(data:any){
    this._downloadCenterBox.next(data)
  }

  refreshNoticsBox(data:any){
    this._refreshNoticeBox.next(data)

  }
  
  paymentNoticsBox(data:any){
    this._paymentLinkBox.next(data)

  }


  passAccountNo(data:any){
    this._feesCollection.next(data)
  }

  pdfShow(data:any){
    this._pdfView.next(data)
  }

  concessionBox(data:any){
    this._concessionBox.next(data)
  }

  transportBox(data:any){
    this._transportBox.next(data)
  }

  studentListRefresh(data:any){
    this._studentList.next(data)
  }

  studentTransportData(data:any){
    this._transportBoxData.next(data)
  }

  focusInputFiledCollect(data:any){
    this._focusCollect.next(data)

  }
}
