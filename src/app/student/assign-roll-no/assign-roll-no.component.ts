import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';


@Component({
  selector: 'app-assign-roll-no',
  templateUrl: './assign-roll-no.component.html',
  styleUrls: ['./assign-roll-no.component.css']
})
export class AssignRollNoComponent implements OnInit {
  constructor(private cs: ComponentsServicesService , private apis:MasterAPIsServicesService) {}
  regBoxStatus: boolean = false;
  studentData: any=[];
  studentAssign:any=[]
  orderValue: string = 'desc';
  selectedStudentList:any = []
  loadingStatus:boolean = false 
  lastStudentCount:number=0
  ngOnInit(): void {
    this.cs.rollListBox$.subscribe((response: any) => {
      this.regBoxStatus = true;
      this.showStudentList(response);
      this.selectedStudentList = []
      console.log(response)
    }); 
  }

  onClickRegBox(value: any) {
    this.regBoxStatus = value;
  }

  submit(){
    this.loadingStatus = true
    this.apis.assignedRoll(this.studentData).subscribe((response:any)=>{
      this.loadingStatus = false
      if(response.success){
        this.apis.showNotifications('success' , 'Success')
        this.studentData = []
      }else{
        this.apis.showNotifications('error' , 'Error')
      }
    })
  }

  showStudentList(data:any) {
    this.studentAssign = []
    this.studentData = []
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if(element.roll_no == null){
        this.studentData.push(element)
      }else{
        this.studentAssign.push(element)
      }
    }
  }

  updateRollNo() {
    this.lastStudentCount = this.studentAssign.length
    for (let i = 0; i < this.studentData.length; i++) {
      const element = this.studentData[i];
      this.studentData[i].roll_no = this.lastStudentCount + i + 1
    }
    console.log(this.selectedStudentList.length , this.studentData.length)
  }

  clear(){
    for (let i = 0; i < this.studentData.length; i++) {
      const element = this.studentData[i];
      this.studentData[i].roll_no = null
    }
  }

  arrangeOrder(value: any, type: any) {
    if (this.orderValue == 'desc') {
      this.orderValue = 'asc';
      this.studentData = this.studentData.sort((a: any, b: any) => {
        if (type == 'string') {
          var data_a: any = a.name;
          var data_b: any = b.name;
          var fa = data_a.toLowerCase(),
            fb = data_b.toLowerCase();
        } else {
          var data_a: any = a.name;
          var data_b: any = b.name;
          var fa = data_a,
            fb = data_b;
        }
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      return;
    }
    if (this.orderValue == 'asc') {
      this.orderValue = 'desc';
      this.studentData = this.studentData.sort((a: any, b: any) => {
        if (type == 'string') {
          var data_a: any = a.name;
          var data_b: any = b.name;
          var fa = data_a.toLowerCase(),
            fb = data_b.toLowerCase();
        } else {
          var data_a: any = a.name;
          var data_b: any = b.name;
          var fa = data_a,
            fb = data_b;
        }
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
        return 0;
      });
      return;
    }
  }
}
