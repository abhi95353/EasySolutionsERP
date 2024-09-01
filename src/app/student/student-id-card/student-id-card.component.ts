import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-student-id-card',
  templateUrl: './student-id-card.component.html',
  styleUrls: ['./student-id-card.component.css']
})
export class StudentIdCardComponent implements OnInit {

  submitStatus: boolean = false
  @ViewChild('htmlData') htmlData!: ElementRef;

  school_code: any = 'Select School' 
  printView:boolean = false
  printDisplay:boolean = true
  classList: any = []
  studentData:any=[]
  facilityList:any=[]
  studentList:any = []
  buttonSubmit:boolean = false
  blob:any
  constructor(private apis: MasterAPIsServicesService) { }


  ngOnInit(): void { 
    this.localStorageUpdate()
    if (localStorage.getItem('sub_host') != 'null') {
      this.showClass()
    }
  }
  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
    }
  }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response
    })
  }

  onSelectClass(event:any){
    var value:any
    value = JSON.parse(event.target.value)
    this.apis.printIdCard(value.id ).subscribe((response:any)=>{
      this.blob = new Blob([response], {type: 'application/pdf'});

      var downloadURL = window.URL.createObjectURL(response);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "StudentIDCard.pdf";
      link.click();
      
    console.log(response)
    this.buttonSubmit = true
    })
  
  }

  onClickPdf(){

  }

  openPDF(): void {
    var DATA: any;
    DATA = document.getElementById('htmlData');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    PDF.html(DATA, {
      callback: function (PDF) {
        PDF.save();
      }
   });
    this.printView = false
    this.printDisplay = false
    

  }

}
 
