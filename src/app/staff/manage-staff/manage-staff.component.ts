import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  styleUrls: ['./manage-staff.component.css'],
})
export class ManageStaffComponent implements OnInit {
  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService
  ) {}
  school_code: any = 'Select School';
  staffData: any = [];
  roleData: any = [];
  searchText:any
  ngOnInit(): void {
    this.localStorageUpdate();
    this.cs.roleAssignBoxUpdate$.subscribe((response:any)=>{
      if(response){
        this.showAllEmployee()
      }
    })
  } 

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showAllEmployee()
      this.school_code = localStorage.getItem('school_code');
    }
  }

  showAllEmployee() {
    this.apis.getAllEmployee().subscribe((response: any) => {
      console.log(response)
      this.staffData = response.response;
    });
  }


  

 

  showRoleBox(id: any, uuid: any, name: any) {
    var data: any;
        data = {
      id: id,
      uuid: uuid,
      name: name,
    };
    this.cs.setStaffRoleBox(data);
  }


 


  deleteRole(eid: any, euuid: any, rid: any, ruuid: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        var data: any;
        data = {
          employee: {
            id: eid,
            uuid: euuid,
          },
          role: {
            id: rid,
            uuid: ruuid,
          },
        };
    
        this.apis.roleStaffRemove(data).subscribe((res: any) => {
          if (res.success) {
            console.log(res)
            if (res) {
             this.apis.showNotifications('success' , res.message)
              this.showAllEmployee()
            } else {
             this.apis.showNotifications('error' , res.message)
              
            } 
           
          }
        })
      }
    })
  }

  search(value: any) {
    var arrylist:any = []
    var newDataList = {'count' : '' , 'data' : arrylist}
    newDataList.data = this.staffData.data
    this.staffData.data = []
    
    if (value.inputType.match('deleteContentBackward')) {
      this.showAllEmployee()
    }
    else {
      for (let i = 0; i < newDataList.data.length; i++) {
        var str = new RegExp(value.data, 'gi')
          if (newDataList.data[i].name.match(str)) {
            this.staffData.data.push(newDataList.data[i])
          }
      
      }
    }
  }

}
