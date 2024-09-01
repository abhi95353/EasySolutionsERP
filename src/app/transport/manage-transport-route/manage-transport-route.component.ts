import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-manage-transport-route',
  templateUrl: './manage-transport-route.component.html',
  styleUrls: ['./manage-transport-route.component.css']
})
export class ManageTransportRouteComponent implements OnInit {

  constructor(
    private apis: MasterAPIsServicesService,
    private cs: ComponentsServicesService
  ) {}
  school_code: any = 'Select School';
  routeData: any = [];
  roleData: any = [];
  searchText:any
  ngOnInit(): void {
    this.localStorageUpdate();
    this.cs.roleAssignBoxUpdate$.subscribe((response:any)=>{
      if(response){
        this.showBusList()
      }
    })
  }
 
  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showBusList()
      this.school_code = localStorage.getItem('school_code');
    }
  }

  showBusList() {
    this.apis.showTransportRoute().subscribe((response: any) => {
      console.log(response);
      this.routeData = response.response;
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
              this.showBusList()
            } else {
             this.apis.showNotifications('error' , res.message)
              
            } 
           
          }
        })
      }
    })
  }


  passRouteData(data:any){
    this.cs.studentTransportData(data)
  }
}
