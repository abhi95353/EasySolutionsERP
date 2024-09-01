import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComponentsServicesService } from '../../components-services.service';
@Component({
  selector: 'app-download-registration',
  templateUrl: './download-registration.component.html',
  styleUrls: ['./download-registration.component.css'],
})


export class DownloadRegistrationComponent implements OnInit {
@ViewChild('htmlData') htmlData!: ElementRef;

  school_id: any;
  schoolData: any = [];
  today: number = Date.now();
  studentist: any = [];
  registration_id: any = 0;
  viewFile:boolean = false
  uuid:any

  

  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService
  ) {}

  ngOnInit(): void {
    this.localStorageUpdate()
    
    this.cs.downlLoadPdf$.subscribe((response: any) => {
      console.log(response)
      if (response == true) {
        this.viewFile = true
        this.studentist = localStorage.getItem('student_data');
        this.studentist = JSON.parse(this.studentist);
        console.log(this.studentist)
        this.registration_id = localStorage.getItem('registration_number');
        setTimeout(() => {
          this.openPDF()
        }, 500);
      }
    });
  }

  showSchool() {
    this.apis
      .showSelectiveMigrationSchool(this.school_id,this.uuid)
      .subscribe((response: any) => {
        this.schoolData = response.response;
        console.log(response , 'scData');
      });
  }

  openPDF(): void {
    var DATA: any;
    DATA = document.getElementById('htmlData');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      PDF.addImage(
        FILEURI,
        'PNG',
        0,
        position,
        fileWidth,
        fileHeight,
        '',
        'SLOW'
      );
      PDF.save(this.registration_id+'.pdf');
      this.viewFile = false
      localStorage.removeItem('student_data')
      localStorage.removeItem('student_data_image')
      localStorage.removeItem('step')
    });
  }


  localStorageUpdate() {
    if (localStorage.getItem('sub_host') != null) {
      this.school_id = localStorage.getItem('school_id');
      this.uuid = localStorage.getItem('uuid');
      this.showSchool();
    }
  }
}
