import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';

@Component({
  selector: 'app-section-list-details',
  templateUrl: './section-list-details.component.html',
  styleUrls: ['./section-list-details.component.css'],
})
export class SectionListDetailsComponent implements OnInit {
  constructor(private cs: ComponentsServicesService , private apis:MasterAPIsServicesService) {}
  regBoxStatus: boolean = false;
  studentData: any;
  orderValue: string = 'desc';
  selectedStudentList:any = []
  loadingStatus:boolean = false 
  ngOnInit(): void {
    this.cs.sectionListBox$.subscribe((response: any) => {
      this.studentData = response;
      this.regBoxStatus = true;
      this.showStudentList();
      this.selectedStudentList = []
      console.log(response)
    });
  }

  onClickRegBox(value: any) {
    this.regBoxStatus = value;
  }



  showStudentList() {
    for (let i = 0; i < this.studentData.length; i++) {
      const element = this.studentData[i];
      element.checked = false;
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
