import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-section',
  templateUrl: './manage-section.component.html',
  styleUrls: ['./manage-section.component.css'],
})
export class ManageSectionComponent implements OnInit {
  constructor(
    private apis: MasterAPIsServicesService,
    private fb: FormBuilder
  ) {}
  customFeesForm = this.fb.group({
    grade_id: [''],
    is_terminate: [''],
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
  allCheckMarked: boolean = false;
  searchText:any

  get studentList() {
    return this.customFeesForm.get('studentList') as FormArray;
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

  // downloadCSV() {
  //   new AngularCsv('', "classes_list", this.csvOptions);
  // }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
    });
  }

  onSelectClass(event: any) {
    this.studentList.reset();
    this.studentList.controls = [];
    this.allCheckMarked = false;
    var value: any;
    value = JSON.parse(event.target.value);
    this.apis
      .showSelectiveClass(value.id, value.uuid)
      .subscribe((response: any) => {
        this.sectionList = [];
        this.sectionList.push(response.response);
      });
    this.apis
      .showSelectiveClassStudentDiv(value.id, value.uuid)
      .subscribe((response: any) => {
        this.studentData = [];
        if (response.response != null) {
          this.studentData = response.response.data;
        }
        console.log(this.studentData , 'sd')
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
        this.addStudent(element.id, element.name, event);
      }
    } else {
      this.allCheckMarked = false;
      this.studentList.reset();
      this.studentList.controls = [];
      for (let i = 0; i < this.studentData.length; i++) {
        const element = this.studentData[i];
        element.checked = false;
      }
    }
  }

  addStudent(id: any, name: any, event: any) {
    if (event.target.checked === true || event == true) {
      var data: any = [];
      data = [{ id: id, name: name, value: true }];
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
  newStudentList(id: any, name: any, value: any): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name],
      value: [value],
    });
  }
  setValue(item: any) {
    for (let dt of item) {
      this.findDuplicate(dt.id, dt.name, dt.value);
    }
  }

  findDuplicate(id: any, name: any, value: any) {
    var flag: any;
    if (this.studentList.length == 0) {
      this.studentList.push(this.newStudentList(id, name, value));
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
      this.studentList.push(this.newStudentList(id, name, value));
    }
  }

  submit() {
    var icon: any;
    var title: any;
    this.submitStatus = true;
    this.apis
      .assignedSection(this.customFeesForm.value)
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
}
