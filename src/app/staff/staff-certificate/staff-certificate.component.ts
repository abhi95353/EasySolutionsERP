import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';

@Component({
  selector: 'app-staff-certificate',
  templateUrl: './staff-certificate.component.html',
  styleUrls: ['./staff-certificate.component.css']
})
export class StaffCertificateComponent implements OnInit {

    submitStatus: boolean = false
  
    school_code: any = 'Select School' 
    // certificateType:any = "relieving-certificate"
    certificateType:any = "practical_examination"
    studentName:any
    FD:any
    TD:any
    AECD:any
    OD:any
    FSSC:any
    subject:any
    EN:any
    APSR:any
    P_TE:any
    T_TE:any
    P_STM:any
    T_STM:any
    WIN:any

letter_no:any
examiner_no:any
designation:any
sub_code:any
class:any
    constructor(private apis: MasterAPIsServicesService , private cs:ComponentsServicesService) { }
  
  
    ngOnInit(): void {
      this.localStorageUpdate()
      if (localStorage.getItem('sub_host') != 'null') {
      }
    }
    localStorageUpdate() {
      if (localStorage.getItem('sub_host') !== null) {
        this.school_code = localStorage.getItem('school_code')
      }
    }
  
  
   
    onClickPdf(formName:any , data_type:any , is_teacher:any){
      var data:any = {}
      var student_data:any = {}
      console.log(formName , 'FN')
      student_data = {
                      name : this.studentName , 
                      AECD:this.AECD,
                      OD:this.OD,
                      FSSC:this.FSSC,
                      subject:this.subject,
                      EN:this.EN,
                      APSR:this.APSR,
                      P_TE:this.P_TE,
                      T_TE:this.T_TE,
                      P_STM:this.P_STM,
                      T_STM:this.T_STM,
                      WIN:this.WIN,
                      TD:this.FD,
                      FD:this.TD
  
                    }
      data = {'account': null , 'form':formName , 'data_type' : data_type , student_data:student_data , is_teacher:is_teacher}
      console.log(data)
      this.cs.cetificateDownload(data)
    }
  
    
  
  
   
  

}
