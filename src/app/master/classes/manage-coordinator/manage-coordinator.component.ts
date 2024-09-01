import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';

@Component({
  selector: 'app-manage-coordinator',
  templateUrl: './manage-coordinator.component.html',
  styleUrls: ['./manage-coordinator.component.css']
})
export class ManageCoordinatorComponent implements OnInit {

  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService) { }
  co_box:boolean = false
  classList:any = []
  coOrdinator:any = []
  classTeacher:any = []
  submitData:any = []
  submitDataClass:any = []

  ngOnInit(): void {
    this.cs.coordinatorBox$.subscribe((response:any)=>{
      console.log(response)
      this.showsection(response.id , response.uuid)
      this.co_box = true
      this.getEmpByRole('Class Coordinator')
      this.getEmpByRole('Class Teacher')
    })
  }

  showsection(id:any , uuid:any){
    this.apis.showSelectiveClass(id,uuid).subscribe((response:any)=>{
      console.log(response)
      this.classList = response.response
    })
  }

  getEmpByRole(value:any){
    this.apis.getEmployeeTitle(value).subscribe((response:any)=>{
      console.log(response)
      if(value == 'Class Coordinator'){
        this.coOrdinator = response.response.data
        return
      }
      if(value == 'Class Teacher'){
        this.classTeacher = response.response.data
        console.log(this.classTeacher , 'teacher')
        return
      }
    })
  }

  onClickRegBox(value:any){
    this.co_box = false
  }
  updateCoData(data:any){
    data = JSON.parse(data)
    this.submitData = {
      standard: {
        id:this.classList.id,
        uuid:this.classList.uuid
      },
      employee: {
        id:data.id,
        uuid:data.uuid
      }
    }
  }
  updateCoSubmit(){
    this.apis.assignClassCO(this.submitData).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.cs.refreshClasses(true)
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }

  updateTeacherData(data:any , section:any){
    console.log(section)
    data = JSON.parse(data)
    this.submitDataClass = {
      div_std: {
        id:section.id,
        uuid:section.uuid
      },
      employee: {
        id:data.id,
        uuid:data.uuid
      }
    }
  }

  updateTeacherSubmit(){ 
    console.log(this.submitDataClass)
    this.apis.assignClassTeachers(this.submitDataClass).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.cs.refreshClasses(true)
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }
}
 