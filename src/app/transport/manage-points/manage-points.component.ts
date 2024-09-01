import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';

@Component({
  selector: 'app-manage-points',
  templateUrl: './manage-points.component.html',
  styleUrls: ['./manage-points.component.css']
})
export class ManagePointsComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService , private fb:FormBuilder) { }
  transData:any = null
  checkPoints:any = []
  checkPointsList = this.fb.group({
    transport_route_id:[''],
    stop_no:[''],
    stop_name:[''],
    distance:[''],
    unit:['km'],
    timing:[]
  })
  ngOnInit(): void {
    this.cs.transportBoxDdata$.subscribe((response:any)=>{
    this.transData = response
    console.log(this.transData)
    this.checkPointsList.patchValue({transport_route_id : this.transData.id})
    this.showPoints()
    })
  }


  showPoints(){
    this.checkPoints = []
    this.apis.showStudentTransportPoint().subscribe((response:any)=>{
      for (let index = 0; index < response.response.data.length; index++) {
        const element = response.response.data[index];
        if(this.transData.id == element.transport_route_id ){
          this.checkPoints.push(element)
        }
      }
    })
  }


  submit(){
    console.log(this.checkPointsList.value)
    this.apis.postCheckPoints(this.checkPointsList.value).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        this.checkPoints.push(this.checkPointsList.value)
        this.checkPointsList.patchValue({
          stop_no:'',
          stop_name:'',
          distance:'',
          unit:'km',
          timing:''
        })
      }else{
        this.apis.showNotifications('error' , response.message)

      }
    })
  }

  deleteCheckBox(id:any , uuid:any){
    this.apis.deleteCheckPoints(id,uuid).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
        for (let index = 0; index < this.checkPoints.length; index++) {
          const element = this.checkPoints[index];
          if(element.id == id){
            this.checkPoints.splice(index, 1)
          }
        }

      }else{
        this.apis.showNotifications('error' , response.message)

      }
    })
  }

 
}
