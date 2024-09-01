import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComponentsServicesService } from '../../components-services.service';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-download-admission',
  templateUrl: './download-admission.component.html',
  styleUrls: ['./download-admission.component.css']
})
export class DownloadAdmissionComponent implements OnInit , AfterViewInit {

  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService,
    private router:Router
  ) { }
  @ViewChild('htmlData') htmlData!: ElementRef;
  @ViewChild('htmlDataI') htmlDataI!: ElementRef;
  @ViewChild('htmlDataIB') htmlDataIB!: ElementRef;
  @ViewChild('htmlDataTA') htmlDataTB!: ElementRef;
  @ViewChild('htmlDataTI') htmlDataTI!: ElementRef;
  @ViewChild('htmlDataIC') htmlDataIC!: ElementRef;
  @ViewChild('htmlDataMI') htmlDataMI!: ElementRef;
  @ViewChild('htmlDataDS') htmlDataDS!: ElementRef;

  school_id: any;
  schoolData: any = [];
  viewFile:boolean = false
  studentist:any=[]
  addmission_id:any
  transport:any = []
  year:any = new Date().getFullYear()
  today: any = new Date(this.year, 3 , 1)
  age:any
  uuid:any
  ngOnInit(): void {
    this.school_id = localStorage.getItem('school_id');
    this.uuid = localStorage.getItem('uuid');
    this.showSchool();
  // this.cs.downloadAdmissionPdf$.subscribe((response: any) => {
    // console.log(response)
    if (true) {
      this.viewFile = true
      this.studentist = localStorage.getItem('student_admission_data');
      // this.transport = localStorage.getItem('student_transport_data');
      this.studentist = JSON.parse(this.studentist);
      this.getAge(this.studentist.dob)
      this.addmission_id = localStorage.getItem('addmission_number');
    }
  // });
  }
  getAge(dateString:any) {
    var birthDate = new Date(dateString);
    var today = new Date(this.today)
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    this.age =  age;
}

  showSchool() {
    this.apis
      .showSelectiveMigrationSchool(this.school_id , this.uuid)
      .subscribe((response: any) => {
        this.schoolData = response.response;
        setTimeout(() => {
          this.openPDF()
        }, 1000);
        console.log(this.schoolData);
      });
  }
  ngAfterViewInit(): void {
  }

  openPDF(): void {
    var DATA: any
    var DATAI: any
    var DATAIB: any
    var DATATA: any
    var DATAIC: any
    var DATAMI: any
    var DATADS: any 
    DATA = document.getElementById('htmlData');
    DATAI = document.getElementById('htmlDataI');
    DATAIB = document.getElementById('htmlDataIB');
    DATATA = document.getElementById('htmlDataTA');
    DATAIC = document.getElementById('htmlDataIC');
    DATAMI = document.getElementById('htmlDataMI');
    DATADS = document.getElementById('htmlDataDS');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    html2canvas(DATA).then(canvas => {
      console.log(canvas, 'c')
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, '', 'SLOW')

      html2canvas(DATAI).then(canvas => {
        PDF.addPage('a4', 'p')
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;

        const FILEURI = canvas.toDataURL('image/png')
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, '', 'SLOW')

        html2canvas(DATAIB).then(canvas => {
          PDF.addPage('a4', 'p')
          let fileWidth = 208;
          let fileHeight = canvas.height * fileWidth / canvas.width;

          const FILEURI = canvas.toDataURL('image/png')
          PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, '', 'SLOW')

          html2canvas(DATATA).then(canvas => {
            PDF.addPage('a4', 'p')
            let fileWidth = 208;
            let fileHeight = canvas.height * fileWidth / canvas.width;

            const FILEURI = canvas.toDataURL('image/png')
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, '', 'SLOW')


              html2canvas(DATAIC).then(canvas => {
                PDF.addPage('a4', 'p')
                let fileWidth = 208;
                let fileHeight = canvas.height * fileWidth / canvas.width;

                const FILEURI = canvas.toDataURL('image/png')
                PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, '', 'SLOW')

                html2canvas(DATAMI).then(canvas => {
                  PDF.addPage('a4', 'p') 
                  let fileWidth = 208;
                  let fileHeight = canvas.height * fileWidth / canvas.width;

                  const FILEURI = canvas.toDataURL('image/png')
                  PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, '', 'SLOW')

                  html2canvas(DATADS).then(canvas => {
                    PDF.addPage('a4', 'p')
                    let fileWidth = 208;
                    let fileHeight = canvas.height * fileWidth / canvas.width; 

                    const FILEURI = canvas.toDataURL('image/png')
                    PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, '', 'SLOW')
                    PDF.save(this.addmission_id+'.pdf');
                    localStorage.removeItem('addmission_number');
                    localStorage.removeItem('student_admission_data');
                    localStorage.removeItem('app-step');
                    localStorage.removeItem('student_transport_data');
                    localStorage.removeItem('student_admission_data_image');
                    localStorage.removeItem('transport_status');
                    localStorage.removeItem('addmission_number');
                    this.router.navigateByUrl('student-admission')
                  });
                });
              });
          });
        });
      });

    });



  }

}
