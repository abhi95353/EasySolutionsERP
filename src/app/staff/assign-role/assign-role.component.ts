import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';

@Component({
  selector: 'app-assign-role',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.css']
})
export class AssignRoleComponent implements OnInit {


  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService) { }
  co_box:boolean = false
  roleData:any = []
  name:string 
  empData:any = []
  data:any = []
  ngOnInit(): void {
    this.cs.roleAssignBox$.subscribe((response:any)=>{
      console.log(response)
      this.name = response.name
      this.empData = response
      this.showRole()
      this.co_box = true
    })
  }

  showRole(){
     this.apis.roleStaffshow().subscribe((response:any)=>{
      this.roleData = response.response.data
      console.log(this.roleData)
    })
  }
  updateRole(value:any){
    console.log(value)
    value = JSON.parse(value)
    var data:any
    data = {"employee" : {
      "id":this.empData.id,
      "uuid":this.empData.uuid,
    },
    "role" : {
      "id":value.id,
      "uuid":value.uuid,
    },}
    this.data = data

   
  }
  onClickRegBox(value:any){
    this.co_box = false
  }

  onClickUpdate(){
    this.apis.updateRoleStaff(this.data).subscribe((response:any)=>{
      if(response.success){
      this.apis.showNotifications('success' , response.message)
      this.cs.refreshRoleData(true)
      this.co_box = false

      }else{
      this.apis.showNotifications('error' , response.message)

      }
    })
  }
}

