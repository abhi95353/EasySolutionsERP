import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-promote-student',
  templateUrl: './promote-student.component.html',
  styleUrls: ['./promote-student.component.css']
})
export class PromoteStudentComponent implements OnInit {

  constructor(
    private apis: MasterAPIsServicesService,
    private fb: FormBuilder
  ) {}
  promoteForm = this.fb.group({
    grade_id: [''],
    studentList: this.fb.array([]),
  });

  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: { 
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  submitStatus: boolean = false;

  school_code: any = 'Select School';
  classList: any = [];
  studentData: any = [];
  facilityList: any = [];
  sectionList: any = [];
  sectionListAssign: any = [];
  allCheckMarked: boolean = false;
  cid:any
  cuuid:any
  searchText:any
  
  get studentList() {
    return this.promoteForm.get('studentList') as FormArray;
  }

  ngOnInit(): void {
    this.localStorageUpdate();
    if (localStorage.getItem('sub_host') != 'null') {
      this.showClass();
    }
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code');
    }
  }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
    });
  }

  onSelectClass(event: any  , type?:any) {
    console.log(type)
    if(type == 'assign'){
      var value: any;
      value = JSON.parse(event.target.value);
      this.apis
      .showSelectiveClass(value.id, value.uuid)
      .subscribe((response: any) => {
        this.sectionListAssign = [];
        this.sectionListAssign.push(response.response);
      });
    return
    }
    this.studentList.reset();
    this.studentList.controls = [];
    this.allCheckMarked = false;
    var value: any;
    value = JSON.parse(event.target.value);
    this.cid = value.id

    this.apis
      .showSelectiveClass(value.id, value.uuid)
      .subscribe((response: any) => {
        this.sectionList = [];
        this.sectionList.push(response.response);
      });
  }

  onClickAll(event: any) {
    if (event.target.checked === true) {
      this.allCheckMarked = true;
      this.studentList.reset();
      this.studentList.controls = [];
      for (let i = 0; i < this.studentData.length; i++) {
        const element = this.studentData[i];
        element.checked = true;
        this.addStudent(element.id, element.name, element.uuid, event);
      }
    } else {
      console.log('else')
      this.allCheckMarked = false;
      this.studentList.reset();
      this.studentList.controls = [];
      for (let i = 0; i < this.studentData.length; i++) {
        const element = this.studentData[i];
        element.checked = false;
      }
    }
  }

  addStudent(id: any, name: any,uuid:any, event: any) {
    if (event.target.checked === true || event == true) {
      var data: any = [];
      data = [{ id: id, name: name, uuid: uuid }];
      this.setValue(data);
    } else {
      for (let i = 0; i < this.studentList.length; i++) {
        const element = this.studentList.value[i];
        if (element.id == id) {
          this.studentList.removeAt(i);
        }
      }
    }
  }
  newStudentList(id: any, name: any, uuid: any): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name],
      uuid: [uuid],
    });
  }
  setValue(item: any) {
    for (let dt of item) {
      this.findDuplicate(dt.id, dt.name, dt.uuid);
    }
  }

  findDuplicate(id: any, name: any, uuid: any) {
    var flag: any;
    if (this.studentList.length == 0) {
      this.studentList.push(this.newStudentList(id, name, uuid));
      return;
    }
    for (let i = 0; i < this.studentList.length; i++) {
      const element = this.studentList.value[i];
      if (element.id == id) {
        alert('Student Already Selected');
        flag = 0;
        return;
      } else {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.studentList.push(this.newStudentList(id, name, uuid));
    }
  } 

  submit() {
    var icon: any;
    var title: any;
    this.submitStatus = true;
    console.log(this.promoteForm.value)
    this.apis
      .promoteStudentNextFun(this.promoteForm.value)
      .subscribe((response: any) => {
        if (response.success) {
          icon = 'success';
          title = 'Success';
          this.allCheckMarked = false;
          this.studentList.reset();
          this.studentList.controls = [];
          this.studentData = [];
        } else {
          icon = 'error';
          title = 'Error';
        }
        this.submitStatus = false;

        this.Toast.fire({
          icon: icon,
          title: title,
        });
      });
  }

  searchStudent(data:any){
    this.studentList.reset();
    this.studentList.controls = [];
    this.allCheckMarked = false;
    console.log(this.sectionList[0].divisions.length)
    for (let index = 0; index < this.sectionList[0].divisions.length; index++) {
      const element = this.sectionList[0].divisions[index];
      if(element.pivot.id == data){
        console.log(element)
        this.apis.getStudentListForPromoote(element.pivot.id , element.pivot.uuid).subscribe((response:any)=>{
          console.log(response)
          this.studentData = [];
          if (response.response != null) {
            this.studentData = response.response.data;
          }
        })
      }
      
    }
  }
}
