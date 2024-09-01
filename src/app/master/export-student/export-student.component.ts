import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-student',
  templateUrl: './export-student.component.html',
  styleUrls: ['./export-student.component.css']
})
export class ExportStudentComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService) { }
  school_code:any
  exportData:any = undefined
  loaderSubmit:boolean = false
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

  
  // onFileChange(event: any) {
  //   let workBook = null;
  //   let jsonData = null;
  //   this.exportData = undefined
  //   if (event.target.files && event.target.files[0]) {
  //     var filesAmount = event.target.files.length;
  //     for (let i = 0; i < filesAmount; i++) {
  //       var reader = new FileReader();
  //       reader.onload = (event: any) => {
  //           this.exportData = event.target.result;
  //           console.log(this.exportData)
  //       };
  //       reader.readAsDataURL(event.target.files[i]);
  //     }
  //   }
  // }

  onFileChange(ev:any) {
    let workBook:any = null;
    let jsonData:any = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial:any, name:any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      this.exportData = dataString
      this.exportData = JSON.parse(this.exportData)
      console.log(this.exportData)
    for (let i = 0; i < this.exportData.Sheet1.length; i++) {
      const element = this.exportData.Sheet1[i];
      var newDate = new Date( (element.dob - 25569) * 24 * 60 * 60 * 1000)
      var newAddDate = new Date( (element.admission_date - 25569) * 24 * 60 * 60 * 1000)

      element.dob = newDate.getDate() +'-'+(newDate.getMonth() + 1) +'-'+newDate.getFullYear()
      element.admission_date = newAddDate.getDate() +'-'+(newAddDate.getMonth() + 1) +'-'+newAddDate.getFullYear()
    } 
    console.log(this.exportData)


    }
    reader.readAsBinaryString(file); 

  }


  submit(){
    if(this.exportData == undefined){
      this.apis.showNotifications('error' , 'Please! Select File')
      return
    }
    this.loaderSubmit = true
    var data:any ={}
    console.log('send' , this.exportData)
    this.apis.exportStudentList(this.exportData).subscribe((response:any)=>{
    this.loaderSubmit = false

      if(response.success){
        this.apis.showNotifications('success' , 'Success')
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }


}
