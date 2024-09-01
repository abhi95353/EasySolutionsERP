import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-manage-subject',
  templateUrl: './manage-subject.component.html',
  styleUrls: ['./manage-subject.component.css']
})
export class ManageSubjectComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService) { }
  school_code: any = 'Select School';
  subjectList:any = []
  ngOnInit(): void {
    this.localStorageUpdate()
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showSubject()
      this.school_code = localStorage.getItem('school_code');
    }
  }

  showSubject(){
    this.apis.showSubject().subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.subjectList = response.response.data
        console.log(this.subjectList)
      }
    })
  
  }

}
 