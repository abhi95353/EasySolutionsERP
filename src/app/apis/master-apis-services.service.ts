import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders, 
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { catchError, retry, map, take, tap, last } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MasterAPIsServicesService {
  token:any
  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: { 
      popup: 'colored-toast',
    }, 
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  }); 
  constructor(private http: HttpClient) {
    if(localStorage.getItem('user_type') == 'Staff')
    {
      this.isStaff = true
    }else{
      this.isStaff = false
    }
  } 
  public deployOnNPS:boolean=true
  public deployOnAdmin:boolean=false
  public isStaff:boolean = false
  

  public baseUrl = 'https://apis.nps.myeasyerpsolutions.com/api/';  //NPS School Production

  // public baseUrl = 'https://apis.myeasyerpsolutions.com/api/';
  // public baseUrl = 'https://apis.dev.myeasyerpsolutions.com/api/'; //dev  
  // public baseUrl = 'https://apis.dev.myeasyerpsolutions.com/api/';  //NPS School

  // public baseUrl = 'https://admin.dev.myeasyerpsolutions.com/api/';  //NPS School

// 

// https://dev.myeasyerpsolutions.com/  // dev env
// https://erp.v2.myeasyerpsolutions.com/  // prod env


  //  public qrInfo = 'https://student.registration.myeasyerpsolutions.com/#/student;uuid=' //Dev
  //  public qrInfo = 'http://localhost:4200/#/student;uuid=' //local


   public qrInfo = 'https://student.registration.npsynr.com/#/student;uuid=' //NPS


  

  public headerWithToken(): HttpHeaders {
    let subHost: any;
    let session_id:any = localStorage.getItem('session_id');
    subHost = localStorage.getItem('sub_host');
    this.token = localStorage.getItem('token')
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'sub-host': subHost,
      'academic_session_id': session_id,
      "Authorization": "Bearer "+this.token+""
    });
  }

  public headerWithTokenWithoutSubHost(): HttpHeaders {
    this.token = localStorage.getItem('s_token')
    let subHost: any;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": "Bearer "+this.token+"",
    });
  }

  private handleError(error: HttpErrorResponse) { 
    var title: any;
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      title = 'An error occurred:' + error.error;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      title = `Backend returned code ${error.status}`;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        // text: 'Backend returned code '+ JSON.stringify(error.error),
        footer: title + '. Please refresh or login again'
        })
    }
    // Return an observable with a user-facing error message.
    var data: any;
    data = [{ success: false, message: title, code: error.status }];
    return data;
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(
          (100 * event.loaded) / (event.total ?? 0)
        );
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  showNotifications(icon: any, title: any) {
    this.Toast.fire({
      icon: icon,
      title: title,
    });
  }


  moveToTop(){
    document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  }
  // <---------------------------------Login APi APIS---------------------------------------------->
  private login: any = this.baseUrl + 'sA/signIn';
  private showHost:any = this.baseUrl + 'tenant/sbHst'
  loginFunction(data: any , sub_host?:any)  {
    if(sub_host == null){
      return this.http.post(this.login, data,
        ).pipe(
           // retry a failed request up to 1 times
          catchError(this.handleError) // then handle the error
        );
    }else{
      return this.http.post(this.login, data,{headers:{'sub-host':sub_host}}
        ).pipe(
           // retry a failed request up to 1 times
          catchError(this.handleError) // then handle the error
        );
    }
    
  }
  showSubHost(code:any){
    return this.http.get(this.showHost+'?code='+code).pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError) // then handle the error
    );
  }


  // <---------------------------------Master School APIS---------------------------------------------->
  private school: any = this.baseUrl + 'school';
  private migration: any = this.baseUrl + 'tenant';
  showAllSchool() {
    return this.http
      .get(this.school, { headers: this.headerWithToken() })
      .pipe(map((response) => <Response>response));
  }
  showSelectiveSchool(id: any) {
    return this.http
      .get(this.school + '/' + id, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }
  createSchool(sub_host: any) {
    var data = [{ data: 'any' }];
    return this.http
      .post(this.school, data, { headers: new HttpHeaders({
        'sub-host': sub_host,
      })
    }
        )
      .pipe(
         // retry a failed request up to 3 times
        catchError(this.handleError)
      );
  }
  updateSchool(id: any, data: any, subHost: any) {
    return this.http
      .put(this.school + '/' + id, data, { headers: this.headerWithToken() })
      .pipe(map((response) => <Response>response));
  }
  deleteSchool(id: any) {
    return this.http
      .delete(this.school + '/' + id, { headers: this.headerWithToken() } )
      .pipe(map((response) => <Response>response));
  }

  migrationSchool(data: any) {
    return this.http
      .post(this.migration, data, {
        headers: this.headerWithTokenWithoutSubHost(),
      })
      .pipe(
        // retry a failed request up to 3 times
        // catchError(this.handleError)
      );
  }
  deleteMigration(id: any, uuid: any) {
    return this.http
      .delete(this.migration + '/' + id + 'uuid?' + uuid, {
        headers: this.headerWithTokenWithoutSubHost(),
      })
      .pipe(map((response) => <Response>response));
  }
  showMigrationSchool() {
    return this.http
      .get(this.migration , { headers: this.headerWithTokenWithoutSubHost() })
      .pipe(map((response) => <Response>response));
  }
  showSelectiveMigrationSchool(id: any, uuid: any) {
    return this.http
      .get(this.migration + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithTokenWithoutSubHost(),
      })
      .pipe(map((response) => <Response>response));
  }
  updateMigrationSchool(id: any, data: any) {
    return this.http
      .put(this.migration + '/' + id, data, {
        headers: this.headerWithTokenWithoutSubHost(),
      })
      .pipe(map((response) => <Response>response));
  }

  updateLogo(id: any, data: any) {
    return this.http
      .post(this.migration + '/logo' + '?code=' + id, data)
      .pipe(map((response) => <Response>response));
  }

  // <---------------------------------Master Classes & Section APIS---------------------------------------------->

  private class: any = this.baseUrl + 'standard';
  private section: any = this.baseUrl + 'division';
  private showClassAndSection: any = this.baseUrl + 'standard/rel';
  private standardDivision: any = this.baseUrl + 'divisionStandard';
  showAllClassAndSection() {
    return this.http
      .get(this.showClassAndSection, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  showClass() {
    return this.http.get(this.class, { headers: this.headerWithToken() }).pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError) // then handle the error
    );
  }

  showSection() {
    return this.http
      .get(this.section, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  showSelectiveClass(id: any, uuid: any) {
    return this.http
      .get(this.showClassAndSection + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(map((response) => <Response>response));
  }
  createClass(data: any) {
    return this.http
      .post(this.class, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  updateClass(id: any, data: any) {
    return this.http
      .put(this.class + '/' + id, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  updateDivision(data: any) {
    return this.http
      .post(this.section, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  deleteSection(id: any, uuid: any) {
    return this.http
      .delete(this.standardDivision + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  deleteClass(id: any, uuid: any) {
    return this.http
      .delete(this.class + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  selctionUpdate(data: any) {
    return this.http
      .post(this.standardDivision, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Student Registration  APIS---------------------------------------------->
  private registration: any = this.baseUrl + 'registration';
  private registered: any = this.baseUrl + 'registration/indextpl';

  registrationStudent(data: any) {
    return this.http
      .post(this.registration, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  registrationStudentDocument(data: any) {
    return this.http
      .post(this.registration + '/image', data, {
        headers: this.headerWithToken(),
        reportProgress: true,
      })
      .pipe(
        // map(event => this.getEventMessage(event, file)),
        // tap(message => this.showProgress(message)),
        // last(),
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showStudentRegistration() {
    return this.http
      .get(this.registration, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showRegisteredStudent() {
    return this.http
      .get(this.registered, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showSelectiveStudentRegistration(id: any, uuid: any) {
    return this.http
      .get(this.registration + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  deleteStudentRegistration(id: any) {
    return this.http
      .delete(this.registration + '/' + id, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Change Password APIS---------------------------------------------->
  private pasword: any = this.baseUrl + 'user/1';
  changePassword(subHost: any) {
    return this.http
      .put(this.pasword, [{ id: 1 }], { headers: { 'sub-host': subHost } })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------State & City  APIS---------------------------------------------->

  private state: any = this.baseUrl + 'state';
  private city: any = this.baseUrl + 'city';

  showStateWithoutSubHost() {
    return this.http
      .get(this.state + 't', { headers: this.headerWithTokenWithoutSubHost() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showCityWithoutSubHost(id: any) {
    return this.http
      .get(this.city + 't' + '?state_id=' + id, {
        headers: this.headerWithTokenWithoutSubHost(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showState() {
    return this.http.get(this.state, { headers: this.headerWithToken() }).pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError) // then handle the error
    );
  }

  showCity(id: any) {
    return this.http
      .get(this.city + '?state_id=' + id, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Student Admission  APIS---------------------------------------------->
  private candidate: any = this.baseUrl + 'parental';
  private transport: any = this.baseUrl + 'studentTransportDetail';
  private candidateDocumnet: any = this.baseUrl + 'studentDocument';
  private showStudent: any = this.baseUrl + 'student/rt';
  private bulkDeleteStudent:any = this.baseUrl + 'student/blkDlt'
  // private transportStudentDetails:any = this.baseUrl + 'studentTransportRoute/bStdnt'
  private transportStudentDetails:any = this.baseUrl + 'studentFee/trnsprtRt/bStdnt'
  private studentTranportList:any = this.baseUrl + 'student/stdntTrnsprtRt'
  private studentTranportPointList:any = this.baseUrl + 'transportRouteStoppage'
  private changeAsso:any = this.baseUrl + 'student/chng/prntl/ssctn'
  private updateParent:any = this.baseUrl + 'parental'
  private addParent:any = this.baseUrl + 'parental/nw'




  private studentEdit:any = this.baseUrl + 'student'

  addmissionStudent(data: any) {
    return this.http
      .post(this.candidate, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  addTransport(data: any) {
    return this.http
      .get(this.transport, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  deleteBulkStudent(data: any) {
    return this.http
      .post(this.bulkDeleteStudent, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  showStudentAdmission() {
    return this.http
      .get(this.showStudent, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  addmissionStudentDocument(data: any) {
    return this.http
      .post(this.candidateDocumnet, data, {
        headers: this.headerWithToken(),
        reportProgress: true,
      })
      .pipe(
        // map(event => this.getEventMessage(event, file)),
        // tap(message => this.showProgress(message)),
        // last(),
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // showStudentTransportDetails(id: any, uuid: any) {
  //   return this.http
  //     .get(this.transportStudentDetails +'?' + 'id='+id + '&uuid=' + uuid, {
  //       headers: this.headerWithToken(),
  //     })
  //     .pipe(
  //        // retry a failed request up to 1 times
  //       catchError(this.handleError) // then handle the error
  //     );
  // }

  showStudentTransportDetails(account:any) {
    return this.http
      .get(this.transportStudentDetails +'?' + 'account='+account, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  
  showStudentTransport(standard_id:any) {
    return this.http
      .get(this.studentTranportList+'?standard_id='+standard_id, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showStudentTransportPoint() {
    return this.http
      .get(this.studentTranportPointList, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  postCheckPoints(data: any) {
    return this.http
      .post(this.studentTranportPointList, data, { headers: this.headerWithToken() })
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  
  deleteCheckPoints(id: any, uuid: any) {
    return this.http
      .delete(this.studentTranportPointList + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  updateStudentList(id: any, uuid: any,data: any) {
    return this.http
      .put(this.studentEdit + '/' + id + '?uuid=' + uuid, data, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  updateParentAsso(data: any) {
    return this.http
      .post(this.changeAsso, data, {
        headers: this.headerWithToken(),
        reportProgress: true,
      })
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  updateParentDetail(id: any, data:any) {
    return this.http
      .put(this.updateParent + '/' + id , data, {
        headers: this.headerWithToken(),
      })
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  addParentDetail(data:any) {
    return this.http
      .post(this.addParent , data, {
        headers: this.headerWithToken(),
      })
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  // <---------------------------------Fees Type  APIS---------------------------------------------->

  private facility: any = this.baseUrl + 'facility';
  private studentFacility: any = this.baseUrl + 'facilityFee/bStd';
  private studentFacilityFee: any = this.baseUrl + 'studentFacilityFee';
  private showStudentFacilityIndex: any = this.baseUrl + 'studentFacilityFee/indxbfclty';
  private checkFacilty: any = this.baseUrl + 'parental/chk';
  private manageAdmissionFee:any = this.baseUrl + 'feeCollect/dmssnNwLd/tggl'
  // private checkAdmissionStatus:any = this.baseUrl + 'feeCollect/dmssnNwLd/chck'
  private checkAdmissionStatus:any = this.baseUrl + 'studentFee/dmssnNwLd/tggl'
  private payType:any = this.baseUrl + 'payType'


  updatemanageAdmissionFee(data:any){
    return this.http
      .post(this.manageAdmissionFee, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }


  checkManageAdmissionFee(data:any){
    return this.http
      .post(this.checkAdmissionStatus, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  storeFacility(data: any) {
    return this.http
      .post(this.facility, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  storeStudentFacility(data: any) {
    return this.http
      .post(this.studentFacilityFee, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  showStudentFacility() {
    return this.http
      .get(this.studentFacilityFee, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  showPayType() {
    return this.http
      .get(this.payType, { headers: this.headerWithToken() })
      .pipe(
        catchError(this.handleError)
      );
  }

  showStudentAvailFacility() {
    return this.http
      .get(this.showStudentFacilityIndex, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  showStarndardFacility(id: any) {
    return this.http
      .get(this.studentFacility + '?id=' + id, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showFacility() {
    return this.http
      .get(this.facility, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showSelectiveFacility(id: any, uuid: any) {
    return this.http
      .get(this.facility + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  updateFacility(id: any, data: any, uuid: any) {
    return this.http
      .put(this.facility + '/' + id + '?uuid=' + uuid, data, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  deleteFacility(id: any, uuid: any) {
    return this.http
      .delete(this.facility + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  checkFacilityByClass(id: any, uuid: any, academic_session: any) {
    return this.http
      .get(
        this.checkFacilty +
          '/' +
          id +
          '?uuid=' +
          uuid +
          '&academic_session=' +
          academic_session,
        { headers: this.headerWithToken() }
      )
      .pipe( catchError(this.handleError));
  }

  // <---------------------------------Fees Structure  APIS---------------------------------------------->
  private stabdard_facility = this.baseUrl + 'standard/facility';
  private facilityFee = this.baseUrl + 'facilityStandard';

  showSelectiveClassFacility(id: any, uuid: any, academic_session_id: any) {
    return this.http
      .get(
        this.stabdard_facility +
          '/' +
          id +
          '?uuid=' +
          uuid +
          '&academic_session=' +
          academic_session_id,
        {
          headers: this.headerWithToken(),
        }
      )
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  storeFacilityStructure(data: any) {
    return this.http
      .post(this.facilityFee, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------Manage standard APIS---------------------------------------------->
  private showstabdardStudent = this.baseUrl + 'standard/bstd';
  private showstabdardStudentDiv = this.baseUrl + 'standard/bstd/nDiv';
  private showAllStudentList = this.baseUrl + 'student/slctv/rt';

  showSelectiveClassStudent(id: any, uuid: any) {
    return this.http
      .get(this.showstabdardStudent + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showSelectiveClassStudentDiv(id: any, uuid: any) {
    return this.http
      .get(this.showstabdardStudentDiv + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showAllStudent(id: any, uuid: any) {
    return this.http
      .get(this.showAllStudentList + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Manage Custom Fee APIS---------------------------------------------->

  private activityProgramme: any = this.baseUrl + 'customFee';
  private studentActivityProgramme: any = this.baseUrl + 'customFeeCollect';
  storeActivitiyPro(data: any) {
    return this.http
      .post(this.activityProgramme, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  showActivitiyPro() {
    return this.http
      .get(this.activityProgramme, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  deleteStudentActivitiyPro(id: any, uuid: any) {
    return this.http
      .delete(this.studentActivityProgramme + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Manage Fine APIS---------------------------------------------->

  private studentFine: any = this.baseUrl + 'studentFine';
  private studentFee_fn_prcss: any = this.baseUrl + 'studentFee/fn/prcss';

  storeFine(data: any) {
    return this.http
      .post(this.studentFine, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  
  appply_fine(data: any) {
    return this.http
      .post(this.studentFee_fn_prcss, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  showFine() {
    return this.http
      .get(this.studentFine, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Manage Fee collection APIS---------------------------------------------->

  private studentAdmission: any = this.baseUrl + 'student/bAdm';
  private feesDetails: any = this.baseUrl + 'feeCollect/bStdnt?account=';
  private newFeeDetails:any = this.baseUrl + 'studentFee?account=';

  searchByAdmissionNo(id: any) {
    return this.http
      .get(this.studentAdmission + '?admission_no=' + id, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showFeesDetails(id: any, is_paid: any) {
    return this.http
      .get(this.feesDetails + id + '&is_paid=' + is_paid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }


  showNewFeesDetails(id: any, is_paid: any) {
    return this.http
      .get(this.newFeeDetails + id + '&is_paid=' + is_paid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // private payFees: any = this.baseUrl + 'studentDueCollection/pyD';
  private payFees: any = this.baseUrl + 'studentFee/pay';
  storePayFees(data: any) {
    return this.http
      .post(this.payFees, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------Manage Fee concessions &  default APIS---------------------------------------------->
  private feesDefaulterList: any = this.baseUrl + 'student/dfltrs';
  private feesConcessionList: any = this.baseUrl + 'concession/stdnt/lst';
  private feesConcessionValue: any = this.baseUrl + 'concession';
  private updateConcession:any = this.baseUrl + 'feeCollect/cncssn/tggl'
  private updateFine:any = this.baseUrl + 'feeCollect/fn/tggl'
  private updateNewCons:any = this.baseUrl +  'studentFee/cncssn/tggl'
 
  feeDefaulterList(mnth:any , standard_id:any) {
    return this.http
      .get(this.feesDefaulterList+'?mnth='+mnth+'&standard_id='+standard_id, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  feeConcessionList(id: any, uuid: any) {
    return this.http
      .get(this.feesConcessionList + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  showConsessionValueList() {
    return this.http
      .get(this.feesConcessionValue, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  
  updateConcessionStudent(data: any) {
    return this.http
      .post(this.updateConcession, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }


  updateNewConcessionStudent(data: any) {
    return this.http
      .post(this.updateNewCons, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  updateFineStudent(data: any) {
    return this.http
      .post(this.updateFine, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  // <---------------------------------Manage Fee Fine Report APIS---------------------------------------------->
  private feesFineReport: any = this.baseUrl + 'fine/stdnt/lst';
  private feesFineList: any = this.baseUrl + 'fine';
  feeFineList(id: any, uuid: any) {
    return this.http
      .get(this.feesFineReport + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  showFineValueList() {
    return this.http
      .get(this.feesFineList, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Manage Student Section APIS---------------------------------------------->
  private assignSection: any = this.baseUrl + 'student/assign/grd';
  private showSections: any = this.baseUrl + 'divisionStandard/stdnts';
  assignedSection(data: any) {
    return this.http
      .post(this.assignSection, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  showSectionList() {
    return this.http
      .get(this.showSections, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------Manage Student Section APIS---------------------------------------------->
  private assignRoll: any = this.baseUrl + 'student/assign/rlln';

  assignedRoll(data: any) {
    return this.http
      .post(this.assignRoll, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------Manage Custom Fee collection APIS---------------------------------------------->
  private serachByaccount: any = this.baseUrl + 'customFeeCollect/bAc?account=';
  private serachByaccountpaid: any =
    this.baseUrl + 'student/cstm/pd/f?account=';
  private payCustom: any = this.baseUrl + 'customFeeCollect/pyD';

  searchByAccountNoCustomFee(id: any) {
    return this.http
      .get(this.serachByaccount + id, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  searchByAccountNoCustomFeePaid(id: any) {
    return this.http
      .get(this.serachByaccountpaid + id, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  customFeesPay(data: any) {
    return this.http
      .post(this.payCustom, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------Export APIS---------------------------------------------->
  private exportData: any = this.baseUrl + 'imf';

  exportStudentList(data: any) {
    return this.http
      .post(this.exportData, data, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  // <---------------------------------Acedamic sessionS---------------------------------------------->

  private as: any = this.baseUrl + 'open/academicSession';

  private academicSession: any = this.baseUrl + 'academicSession';
  private academicAllSession: any = this.baseUrl + 'academicSession/ol';

  postSession(data:any) {
    return this.http.post(this.academicSession,data, { headers: this.headerWithToken() }).pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError) // then handle the error
    );
  }

  showSession() {
    return this.http.get(this.as, { headers: this.headerWithToken() }).pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError) // then handle the error
    );
  }

  showAcademicSession() {
    return this.http
      .get(this.academicSession, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  showAllAcademicSession() {
    return this.http
      .get(this.academicAllSession, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  deleteAcademicSession(id:any , uuid:any) {
    return this.http
      .delete(this.academicSession+'/'+id+'?uuid='+uuid, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------External Setup sessionS---------------------------------------------->
  private registrationFee: any = this.baseUrl + 'externalSetup/gt/rgstrtn/f';
  private externalSetup: any = this.baseUrl + 'externalSetup';
  showRegFee() {
    return this.http
      .get(this.registrationFee, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  updateRegFee(sub_host: any, data: any) {
    var token:any = localStorage.getItem('token')
    return this.http
      .put(this.externalSetup + '/1', data, { headers: new HttpHeaders({
        'sub-host': sub_host,
        "Authorization": "Bearer "+token+""
      })
    })
      .pipe( catchError(this.handleError));
  }

  getExternal(sub_host: any) {
    var token:any = localStorage.getItem('token')
    return this.http
      .get(this.externalSetup, { headers: new HttpHeaders({
        'sub-host': sub_host,
        "Authorization": "Bearer "+token+""
      })
    })
      .pipe( catchError(this.handleError));
  }

  // <---------------------------------ID CARDS---------------------------------------------->
  private completeListByclass: any = this.baseUrl + 'standard/stdnt/rt/';
  showAllIdcard(id: any, uuid: any) {
    return this.http
      .get(this.completeListByclass + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe( catchError(this.handleError));
  }

  // <---------------------------------Show Student Data APIS---------------------------------------------->
  private parentAsso:any = this.baseUrl + 'parental/ssctn'
  private showStudentData: any = this.baseUrl + 'student/lst';
  showStudntList(url: any) {
    return this.http
      .get(this.showStudentData + '?' + url, {
        headers: this.headerWithToken(),
      })
      .pipe( catchError(this.handleError));
  }

  getParentAsso() {
    return this.http
      .get(this.parentAsso, {
        headers: this.headerWithToken(),
      })
      .pipe( catchError(this.handleError));
  }
  // <---------------------------------Dashboard APIS---------------------------------------------->
  private dashboard_stdnt_cnt: any = this.baseUrl + 'dashboard/gt/stdnt/cnt';
  private dashboard_stdnt_reg: any = this.baseUrl + 'dashboard/gt/rgstrtn/cnt';
  private dashboard_stdnt_admsn: any = this.baseUrl + 'dashboard/gt/admssn/cnt';
  private dashboard_stdnt_tchr: any = this.baseUrl + 'dashboard/gt/tchr/cnt';
  private dashboard_stdnt_brthdy: any = this.baseUrl + 'dashboard/gt/stdnt/brthdy';
  private dashboard_stdnt_d: any = this.baseUrl + 'dashboard/gt/stdnt/d';
  private showDailyFeesDash: any = this.baseUrl + 'dashboard/gt/cllctn/bMnth';
  private showDailyClassDash: any = this.baseUrl + 'dashboard/gt/std/stdnt/cnt';
  private showDailyFeesCollection: any = this.baseUrl + 'dashboard/gt/cllctn/btdy/rt';
  private previousDue:any = this.baseUrl + 'dashboard/gt/stdnt/prvsBlnc'
  private timeline:any = this.baseUrl + 'dashboard/gt/ntc'

  showStudentCnt() {
    return this.http
      .get(this.dashboard_stdnt_cnt, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showStudntReg() {
    return this.http
      .get(this.dashboard_stdnt_reg, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showStudntAdmsn() {
    return this.http
      .get(this.dashboard_stdnt_admsn, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showStudntTchr() {
    return this.http
      .get(this.dashboard_stdnt_tchr, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showStudntbrth() {
    return this.http
      .get(this.dashboard_stdnt_brthdy, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showStudntD() {
    return this.http
      .get(this.dashboard_stdnt_d, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showDashboardDaily() {
    return this.http
      .get(this.showDailyFeesDash, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showDashboardClassList() {
    return this.http
      .get(this.showDailyClassDash, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showDashboardDailyFeeCollection() {
    return this.http
      .get(this.showDailyFeesCollection, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showPreviousBalance() {
    return this.http
      .get(this.previousDue, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  showTimeline() {
    return this.http
      .get(this.timeline, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  // <---------------------------------Cerificate APIS---------------------------------------------->
  private seachByacn: any = this.baseUrl + 'student/bAc';
  private searchForcert: any = this.baseUrl + 'student/slctvRt/bAc';
  private searchTc:any = this.baseUrl + 'student/slctv/cmplt'
  private tcCerttificate:any = this.baseUrl + 'pdf/stdnt/tc'
  showStudntCertificate(account: any) {
    return this.http
      .get(this.searchForcert + '?account=' + account, {
        headers: this.headerWithToken(),
      })
      .pipe( catchError(this.handleError));
  }

  showStudntCertificateTC(account: any) {
    return this.http
      .post(this.searchTc + '?account=' + account,'', {
        headers: this.headerWithToken(),
      })
      .pipe( catchError(this.handleError));
  }

  tcCerttificatePdf(data:any) {
    return this.http
      .post(this.tcCerttificate , data  , {
        headers: this.headerWithToken(),
        responseType: 'blob',
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Open School APIS---------------------------------------------->
  private open_school_check: any = this.baseUrl + 'open/school/chck?uuid=';
  openSchoolCheck(uuid: any) {
    return this.http
      .get(this.open_school_check + uuid, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  // <---------------------------------Open School APIS---------------------------------------------->

  private all_student_lst: any = this.baseUrl + 'student/lst/slctv';
  allStudentList() {
    return this.http
      .get(this.all_student_lst, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  // <---------------------------------Receipt APIS---------------------------------------------->

  private receipt: any = this.baseUrl + 'receipt/bFCllct';
  private receiptEdit: any = this.baseUrl + 'studentReceipt';

  getReceipt(account: any, type: any) {
    return this.http
      .get(this.receipt + '?account=' + account + '&type=' + type, {
        headers: this.headerWithToken(),
      })
      .pipe( catchError(this.handleError));
  }

  editReceipt(id:any , data:any) {
    return this.http
      .put(this.receiptEdit+'/'+id, data ,{
        headers: this.headerWithToken(),
      })
      .pipe( catchError(this.handleError));
  }

  // private feesReport: any = this.baseUrl + 'receipt/rprt';
  // private feesReport:any = this.baseUrl + 'studentReceipt/rprt'
  private feesReport:any = this.baseUrl + 'studentReceipt/rprt/byPyTyp'
  getFeeReport(academic_session_id: any, yr_month: any, date: any) {
    return this.http
      .get(
        this.feesReport +
          '?academic_session=' +
          academic_session_id +
          '&yr_month=' +
          yr_month +
          '&date=' +
          date,
        { headers: this.headerWithToken() }
      )
      .pipe( catchError(this.handleError));
  }

   // private feesReport: any = this.baseUrl + 'receipt/rprt';
   private transportReport:any = this.baseUrl + 'transportRoute/lst/stdnt?page=1'
  //  api/student/stdntTrnsprtRt?standard_id=8
   getTransportReport() {
     return this.http
       .get(
         this.transportReport , { headers: this.headerWithToken() }
       )
       .pipe( catchError(this.handleError));
   }


  // <---------------------------------Previous Fees APIS---------------------------------------------->

  private pre_fee_list: any = this.baseUrl + 'previousBalance';
  private pre_due_pay: any = this.baseUrl + 'previousBalance/pyD';
  private searchPre: any = this.baseUrl + 'previousBalance/bStdnt';
  getPreFeeList() {
    return this.http
      .get(this.pre_fee_list, { headers: this.headerWithToken() })
      .pipe( catchError(this.handleError));
  }

  searchByAccountNoPreDue(id: any) {
    return this.http
      .get(this.searchPre + '?account=' + id, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  storePreDueFees(data: any) {
    return this.http
      .post(this.pre_due_pay, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------ID cards APIS---------------------------------------------->

  private multiIDCard: any = this.baseUrl + 'multiICrd';
  private iDCard: any = this.baseUrl + 'iCrd';
  printIdCard(id: any) {
    return this.http
      .get(this.multiIDCard + '?standard_id=' + id, {
        headers: this.headerWithToken(),
        responseType: 'blob',
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }
  printIdCardI(id: any, uuid: any) {
    return this.http
      .get(this.iDCard + '?id=' + id + '&uuid=' + uuid, {
        headers: this.headerWithToken(),
        responseType: 'blob',
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  // <---------------------------------Coordinator APIS---------------------------------------------->
  private staff: any = this.baseUrl + 'employee';
  private getStaffTitle: any = this.baseUrl + 'employee/bRl';
  private updateStaff: any = this.baseUrl + 'employee/updt/CrtRl';
  private removeStaffRole: any = this.baseUrl + 'employee/dstryMplyRl';
  private roleStaff: any = this.baseUrl + 'role';

  storestaff(data: any) {
    return this.http
      .post(this.staff, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  getEmployeeTitle(value: any) {
    return this.http
      .get(this.getStaffTitle + '?role_name=' + value, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  getAllEmployee() {
    return this.http
      .get(this.staff, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

  updateRoleStaff(data: any) {
    return this.http
      .post(this.updateStaff, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  roleStaffshow() {
    return this.http
      .get(this.roleStaff, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  roleStaffRemove(data: any) {
    return this.http
      .post(this.removeStaffRole, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------Subject APIS---------------------------------------------->
  private subject: any = this.baseUrl + 'subject';
  private subjectwiseclass: any = this.baseUrl + 'subject/relStd';

  storeSubject(data: any) {
    return this.http
      .post(this.subject, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  showSubject() {
    return this.http
      .get(this.subjectwiseclass, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  // <---------------------------------Assign Coordinator APIS---------------------------------------------->

  private assignClassCo = this.baseUrl + 'standard/ssgnMply';
  private assignClassTeacher = this.baseUrl + 'divisionStandard/ssgnMply';

  assignClassCO(data: any) {
    return this.http
      .post(this.assignClassCo, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  assignClassTeachers(data: any) {
    return this.http
      .post(this.assignClassTeacher, data, { headers: this.headerWithToken() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // <---------------------------------Notice Board APIS---------------------------------------------->

  private noticeBoard = this.baseUrl + 'noticeBoard';
  private noticeBoardShow = this.baseUrl + 'noticeBoard/nb';
  private noticeBoardCategory = this.baseUrl + 'noticeCategory';

  createnoticeBoard(data: any) {
    return this.http
      .post(this.noticeBoard, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  shownoticeBoard() {
    return this.http
      .get(this.noticeBoardShow, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  createnoticeBoardCategory(data: any) {
    return this.http
      .post(this.noticeBoardCategory, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  shownoticeBoardCategory() {
    return this.http
      .get(this.noticeBoardCategory, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  updateNoticeBoard(id: any, uuid: any, data: any) {
    return this.http
      .put(this.noticeBoard + '/' + id + '?uuid=' + uuid, data, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  notificationDelete(id: any, uuid: any) {
    return this.http
      .delete(this.noticeBoardCategory + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  // <---------------------------------Transport APIS---------------------------------------------->

  private transportRoute = this.baseUrl + 'transportRoute';
  // private adTr = this.baseUrl + 'feeCollect/adTr';
  private adTr = this.baseUrl + 'studentTransportRoute/bStdnt/nblDsbl'
  // private allStudentTrans = this.baseUrl + 'studentTransportRoute/bStdntNblDsblOl'
  private allStudentTrans = this.baseUrl + 'studentFee/trnsprtRt/tggl'

  showTransportRoute() {
    return this.http
      .get(this.transportRoute, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  createTransportRoute(data: any) {
    return this.http
      .post(this.transportRoute, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  updateTransportRoute(id: any, uuid: any, data: any) {
    return this.http
      .put(this.transportRoute + '/' + id + '?uuid=' + uuid, data, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  updateStudentRoute(data: any) {
    return this.http
      .post(this.adTr, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  updateStudentRouteAll(data: any) {
    return this.http
      .post(this.allStudentTrans, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  

  // <---------------------------------Attendance APIS---------------------------------------------->

  private getAttendance = this.baseUrl + 'togglePortal';

  showAttendance() {
    return this.http
      .get(this.getAttendance, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  } 
  updatePortal(id: any, uuid: any, value: any , name:any) {
    return this.http
      .put(
        this.getAttendance +
          '/' +
          id +
          '?uuid=' +
          uuid +
          '&'+name+'=' +
          value,
        value,
        { headers: this.headerWithToken() }
      )
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
 

  // <---------------------------------Cheque APIS---------------------------------------------->

  private chequePayment = this.baseUrl + 'chequePayment';
  private chequePaymentStatus = this.baseUrl + 'chequePaymentStatus';
  createChequePayment(data: any) {
    return this.http
      .post(this.chequePayment, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  showChequePayment() {
    return this.http
      .get(this.chequePayment, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  updatePayment(id: any, uuid: any, cheque_payment_status_id: any) {
    return this.http
      .put(
        this.chequePayment+'/'+id+'?uuid='+uuid+'&cheque_payment_status_id='+cheque_payment_status_id,{'data':'data'},{ headers: this.headerWithToken() }
      )
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  showChequeStatus() {
    return this.http
      .post(this.chequePaymentStatus, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

   // <---------------------------------SMS APIS---------------------------------------------->

   updateAttendanceSMS(id: any, uuid: any, value: any) {
    return this.http
      .put(
        this.getAttendance +
          '/' +
          id +
          '?uuid=' +
          uuid +
          '&text_message=' +
          value,
        value,
        { headers: this.headerWithToken() }
      )
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

 // <---------------------------------Manual SMS APIS---------------------------------------------->

 private template = this.baseUrl + 'messageDesign';
 private sendSMS  = this.baseUrl + 'sendSms'

 showTemplate() {
   return this.http
     .get(this.template, { headers: this.headerWithToken() })
     .pipe(
        // retry a failed request up to 1 times
       catchError(this.handleError)
     );
 }

 postTemplate(data:any) {
  return this.http
    .post(this.template,data, { headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
}

 SMSsend(value:any) {
  return this.http
    .post(this.sendSMS,value, { headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
}

updateTemplate(id: any, uuid: any, value: any) {
  return this.http
    .put(
      this.template +'/' + id +'?uuid=' + uuid , value,
      { headers: this.headerWithToken() }
    )
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
}


// <---------------------------------Online APIS---------------------------------------------->

private onlinePayment = this.baseUrl + 'onlinePayment';
private cancelPayment = this.baseUrl +  'onlinePayment/cnclld'
private resendPayment = this.baseUrl +  'onlinePayment/rsnd'
private verifyPayment = this.baseUrl + 'onlinePayment/rvrfy'

createOnlinePayment(data: any) {
  return this.http
    .post(this.onlinePayment, data, { headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
}
resendOnlienPayment(data:any){
  return this.http
  .post(this.resendPayment, data, { headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}

verifyOnlienPayment(data:any){
  return this.http
  .post(this.verifyPayment, data, { headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}

cancelOnlienPayment(data:any){
  return this.http
  .post(this.cancelPayment, data, { headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}

showOnlinePayment() {
  return this.http
    .get(this.onlinePayment, { headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
}


// <---------------------------------Online Reset---------------------------------------------->
private resetPassword = this.baseUrl + 'resetPswd';
private resetPasswordFull = this.baseUrl + 'employee/rstPsswrd';
passwordReset(data:any){
  return this.http
  .post(this.resetPassword, data, { headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}
passwordResetFull(data:any){
  return this.http
  .put(this.resetPasswordFull, data, { headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}



// <---------------------------------Add bus and assign driver---------------------------------------------->
private schoolTans = this.baseUrl + 'schoolTransport';
private dataListDriver = this.baseUrl + 'transportRoutineReport/index0'
assignBusDriver(data:any){
  return this.http
  .post(this.schoolTans, data, { headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}

getBusDriver(){
  return this.http
  .get(this.schoolTans,{ headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}

updateBusDriver(id: any, uuid: any, value: any) {
  return this.http
    .put(
      this.schoolTans +'/' + id +'?uuid=' + uuid , value,
      { headers: this.headerWithToken() }
    )
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
}

getBusDriverReport(){
  return this.http
  .get(this.dataListDriver,{ headers: this.headerWithToken() })
  .pipe(
     // retry a failed request up to 1 times
    catchError(this.handleError)
  );
}

  // <---------------------------------Admission APIS---------------------------------------------->

  private admissionFee = this.baseUrl + 'studentAdmissionFee/bStdnt';
  private admissionFeePay = this.baseUrl + 'studentAdmissionFee/pyD';

  admissionFeeGet(account_no:any){
    return this.http
    .get(this.admissionFee+'?account='+account_no,{ headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
  }

  admissionFeePost(data:any){
    return this.http
    .post(this.admissionFeePay, data, { headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
  }


  // <---------------------------------Leave APIS---------------------------------------------->

  private studentLeave = this.baseUrl + 'studentLeave';

  getStudentLeave(){
    return this.http
    .get(this.studentLeave,{ headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
  }

  updateStudentLeave(id:any , data:any){
    return this.http
    .put(this.studentLeave+'/'+id , data , {headers:this.headerWithToken()})
    .pipe(
      // retry a failed request up to 1 times
     catchError(this.handleError)
   );
  }


  // <---------------------------------Attendance APIS---------------------------------------------->

  private student_attendance = this.baseUrl + 'attendance';

  getStudentAttendance(data:any){
    return this.http
    .post(this.student_attendance,data,{ headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
  }

  setStudentAttendance(id:any , data:any){
    return this.http
    .put(this.student_attendance+'/'+id,data,{ headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
  }


   // <---------------------------------Promote APIS---------------------------------------------->

   private proomoteStudent = this.baseUrl + 'student/bDivStd';
   private promoteStudentNext = this.baseUrl + 'student/prmt/nxt'
   private carryForward = this.baseUrl + 'student/crry-frwrd/blnc'
   private carryForwardList = this.baseUrl + 'student/nn-crry-frwrd/lst'
   private updateFee = this.baseUrl + 'student/gnrt-f/nxt'
   private demote = this.baseUrl +   'student/prmt/prvs'

   



   getStudentListForPromoote(id:any , uuid:any){
     return this.http
     .get(this.proomoteStudent+'?id='+id+'&uuid='+uuid,{ headers: this.headerWithToken() })
     .pipe(
        // retry a failed request up to 1 times
       catchError(this.handleError)
     );
   }

   getStudentCarryForwardList(id:any , uuid:any){
    return this.http
    .get(this.carryForwardList+'?id='+id+'&uuid='+uuid,{ headers: this.headerWithToken() })
    .pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError)
    );
  }

   promoteStudentNextFun(data: any) {
    return this.http
      .post(this.promoteStudentNext, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  promoteStudentPrevFun(data: any) {
    return this.http
      .post(this.demote, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  carryStudentNextFun(data: any) {
    return this.http
      .post(this.carryForward, data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  postUpdateFee() {
    return this.http
      .post(this.updateFee,{}, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }

  
   // <---------------------------------Excel Report APIS---------------------------------------------->
   private dailyExcelReport = this.baseUrl + 'export/feeReport';
   dailyExcelReportDPF(start_at:any , end_at:any) {
    return this.http
      .get(this.dailyExcelReport+'?start_at='+start_at+'&end_at='+end_at , {
        headers: this.headerWithToken(),
        responseType: 'blob',
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }

    // <---------------------------------Download Center APIS---------------------------------------------->
    private downLoadCenter = this.baseUrl + 'downloadCenter';
    getDownloadCenterList() {
     return this.http
       .get(this.downLoadCenter, {
         headers: this.headerWithToken(),
       })
       .pipe(
          // retry a failed request up to 1 times
         catchError(this.handleError) // then handle the error
       );
   }
   postDownloadCenter(data:any) {
    return this.http
      .post(this.downLoadCenter,data, { headers: this.headerWithToken() })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError)
      );
  }
  deleteDownloadCenter(id: any, uuid: any) {
    return this.http
      .delete(this.downLoadCenter + '/' + id + '?uuid=' + uuid, {
        headers: this.headerWithToken(),
      })
      .pipe(
         // retry a failed request up to 1 times
        catchError(this.handleError) // then handle the error
      );
  }


    // <---------------------------------MIS Report APIS---------------------------------------------->
    private mis_report: any = this.baseUrl + 'report/mis';
    misReport() {
      return this.http
        .get(this.mis_report, {
          headers: this.headerWithToken(),
        })
        .pipe(
           // retry a failed request up to 1 times
          catchError(this.handleError) // then handle the error
        );
    }
 
  
  // <---------------------------------Pagination APIS---------------------------------------------->

  pagination(data:any){
    return this.http.get(data, {headers: this.headerWithToken() , reportProgress:true}).pipe(
       // retry a failed request up to 1 times
      catchError(this.handleError) // then handle the error
    );
  }
  
}
