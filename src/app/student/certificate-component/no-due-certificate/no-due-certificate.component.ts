import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-no-due-certificate',
  templateUrl: './no-due-certificate.component.html',
  styleUrls: ['./no-due-certificate.component.css'],
})
export class NoDueCertificateComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;

  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService
  ) {}
  school_id: any;
  uuid: any;
  schoolData: any = [];
  printView: any = false;
  studentData: any = [];
  certificateType:any
  is_forTeacher:boolean
  entry_type:any
  ngOnInit(): void {
    this.cs.certificateBox$.subscribe((response: any) => {
      this.school_id = localStorage.getItem('school_id');
      this.uuid = localStorage.getItem('uuid');
      this.certificateType = response.form
      this.is_forTeacher = response.is_teacher
      this.entry_type = response.data_type
      this.showSchool();
      if(response.data_type == 'auto'){
        this.showStudent(response.account);
      }
      else{
        this.createStudent(response.student_data)
      }
      
    });
  }
  showSchool() {
    this.apis
      .showSelectiveMigrationSchool(this.school_id, this.uuid)
      .subscribe((response: any) => {
        this.schoolData = response.response;
        console.log(response, 'scData');
      });
  }

  showStudent(account: any) {
    if(account == '' || account == undefined){
      alert('Plaese! Select Student')
      return
    }
    this.apis.showStudntCertificate(account).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        this.studentData = response.response;
        this.printView = true;
        setTimeout(() => {
          this.openPDF();
        }, 500);
      }
    });
  }
  createStudent(data:any){
    this.studentData = data;
        this.printView = true;
        setTimeout(() => {
          this.openPDF();
        }, 500);
  }


  openPDF(): void {
    var DATA: any;
    DATA = document.getElementById('htmlData');

    html2canvas(DATA).then((canvas) => {
      let fileWidth = 200;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 4, 10, fileWidth, fileHeight , '' ,'FAST');
      PDF.save(this.certificateType+'.pdf');
      this.printView = false;
    });
  }
}