import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ComponentsServicesService } from '../../components-services.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-registration-detail-view',
  templateUrl: './registration-detail-view.component.html',
  styleUrls: ['./registration-detail-view.component.css']
})
export class RegistrationDetailViewComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;

  constructor(private cs:ComponentsServicesService) { }
  regBoxStatus:boolean = false;
  studentData:any
  ngOnInit(): void {
    this.cs.registrationBox$.subscribe((response:any)=>{
      this.studentData =  response
      this.regBoxStatus = true
      console.log(response)
    })
  }



  onClickRegBox(value:any){
    this.regBoxStatus = value
  }

  
  openPDF(): void {
    var DATA: any
    DATA = document.getElementById('htmlData');

    html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('erp_pdf.pdf');
    });
  }

}
