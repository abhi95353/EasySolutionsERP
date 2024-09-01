import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-create-bus',
  templateUrl: './create-bus.component.html',
  styleUrls: ['./create-bus.component.css']
})
export class CreateBusComponent implements OnInit {
 
  constructor(private fb:FormBuilder , private apis:MasterAPIsServicesService , private route:ActivatedRoute , private router:Router) { }

  school_code: any = 'Select School';
  driverList:any = []
  routeData:any= []
  dataList:any = []
  loadingStatus:boolean = false
  action:any = 'add'
  id:any
  uuid:any
  busForm = this.fb.group({
    'reg_no' : [''],
    'employee_id' : [''],
    'transport_route_id' : [''],
  })
  

  ngOnInit(): void {
    this.localStorageUpdate()
    this.route.paramMap.subscribe((response:any)=>{
      this.action = response.params.action
      if(response.params.action == 'update'){
        var data:any
        data = JSON.parse(response.params.data)
        this.id = data.id
        this.uuid = data.uuid
        this.busForm.patchValue({
          'reg_no' : data.reg_no,
          'transport_route_id' : data.transport_route.id,
        })
      }

      else{
        this.busForm.reset()
        this.action = 'add' 
      } 
    })
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code');
      this.getEmpByRole('Driver')
      this.showAllRoute()
      this.showList()
    }
  }

  assignBus(){
    this.loadingStatus = true
      if(this.action == 'add'){
      this.apis.assignBusDriver(this.busForm.value).subscribe((response:any)=>{
        if(response.success){
          this.apis.showNotifications('success' , 'Success')
          this.busForm.reset()
          this.showList()
        }else{
          this.apis.showNotifications('error' , response.message)
        }
        this.loadingStatus = false
      })
    }

    if(this.action == 'update'){
      this.apis.updateBusDriver(this.id , this.uuid , this.busForm.value).subscribe((response:any)=>{
        if(response.success){
          this.apis.showNotifications('success' , 'Success')
          this.router.navigate( ['/manage-bus-driver' , { action: 'add', id: null }]);
          this.showList()

        }else{
          this.apis.showNotifications('error' , response.message)
        }
        this.loadingStatus = false
      })
    }

  }

  getEmpByRole(value:any){
    this.apis.getEmployeeTitle(value).subscribe((response:any)=>{
      if(response.response.count>0){
        this.driverList = response.response
      }
    })
  }



  showAllRoute() {
    this.apis.showTransportRoute().subscribe((response: any) => {
      console.log(response)
      if(response.response.count>0){
        this.routeData = response.response;
      }

    });
  }

  showList(){
    this.apis.getBusDriver().subscribe((response:any)=>{
      console.log(response)
      if(response.response.count>0){
        this.dataList = response.response
      }
    })
  }


}
