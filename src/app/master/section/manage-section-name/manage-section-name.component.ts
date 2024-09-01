import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
@Component({
  selector: 'app-manage-section-name',
  templateUrl: './manage-section-name.component.html',
  styleUrls: ['./manage-section-name.component.css']
})
export class ManageSectionNameComponent implements OnInit {
  submitStatus: boolean = false

  school_code: any = 'Select School' 
  sectionList: any = []
  studentData:any=[]
  facilityList:any=[]
  studentList:any = []
  divisionForm = this.fb.group({
    divisions:this.fb.array([
      
    ])
  })
  loaderStatus:boolean = false
  constructor(private apis: MasterAPIsServicesService , private fb:FormBuilder) { }

  get divisions(){
    return this.divisionForm.get('divisions') as FormArray;
  }

  ngOnInit(): void {
    this.localStorageUpdate()
    if (localStorage.getItem('sub_host') != 'null') {
      this.showSection()
    }
  }
  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
    }
  }

  showSection() {
    this.apis.showSection().subscribe((response: any) => {
      this.sectionList = response.response
      for (let i = 0; i < this.sectionList.data.length; i++) {
        const element = this.sectionList.data[i];
        const newItem = this.fb.group({
          id:element.id,
          uuid:element.uuid,
          section:element.section,
          notation:element.notation
        })
          this.divisions.push(newItem)        
      }
      console.log(this.divisionForm.value)
    })
  }

  update(){
    this.loaderStatus = true
    console.log(this.divisions.value)
    this.apis.updateDivision(this.divisionForm.value).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , 'Success')
      }
      else{
        this.apis.showNotifications('error' , 'Error')
      }
      this.loaderStatus = false
    })

  }
 

}
 
