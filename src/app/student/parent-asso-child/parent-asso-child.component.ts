import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { FormBuilder, Validators } from '@angular/forms';

import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-parent-asso-child',
  templateUrl: './parent-asso-child.component.html',
  styleUrls: ['./parent-asso-child.component.css'],
})
export class ParentAssoChildComponent implements OnInit {
  constructor(
    private apis: MasterAPIsServicesService,
    private fb: FormBuilder
  ) {}
  classesBoxStatus: boolean = false;
  classesBoxStatusEdit: boolean = false;
  title: any;
  current_parent: any;
  schoolData: any;
  id: any;
  uuid: any;
  studentForm = this.fb.group({
    student_id: [''],
    student_uuid: [''],
    parental_id: [''],
    parental_uuid: [''],
  });

  parentUpdateForm = this.fb.group({
    id: [''],
    uuid: [''],
    f_name: [''],
    m_name: [''],
  });

  parentAddForm = this.fb.group({
    cred: ['', Validators.required],
    f_name: ['', Validators.required],
    m_name: ['', Validators.required],
    f_dob: [''],
    m_dob: [''],
    f_mobile_no: ['', Validators.required],
    m_mobile_no: ['', Validators.required],
    f_email: [''],
    m_email: [''],
    f_occupation: [''],
    m_occupation: [''],
    p_income: [''],
    secret: ['', Validators.required],
  });

  submitStatus: Boolean = false;
  dataList: any = [];
  loaderStatus: boolean = true;
  dataNotFound: boolean = false;
  EditBoxStatus: boolean = false;
  addBoxStatus: boolean = false;
  searchText: any = '';
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Parent Association List',
    useBom: true,
    noDownload: false,
    headers: [
      'User Name',
      'Login Credential',
      'Father Name',
      'Mother Name',
      'Child Count',
      'Student Details',
    ],
  };

  hintBox: boolean = false;
  searchTextValue: any;

  myControl = new FormControl('');
  options: any = [];
  filteredOptions: Observable<any[]>;

  ngOnInit(): void {
    this.get_paraent_asso();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  displayFn(option?: any): string | undefined {
    return option ? `${option.f_name} / ${option.cred}` : undefined;
  }

  private _filter(value: any): any[] {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (typeof value === 'object' && value !== null) {
      filterValue = (value.f_name || '').toLowerCase();
    }
    const filteredResults = this.options.filter((option: any) =>
      option.f_name.toLowerCase().includes(filterValue)
    );
    return filteredResults;
  }
  onChangeBox(searchText: any) {
    this.searchTextValue = searchText.f_name;
    setTimeout(() => {
      this.hintBox = false;
    }, 500);
  }

  focusIn() {
    this.hintBox = true;
  }

  onFocusOut() {
    setTimeout(() => {
      this.hintBox = false;
    }, 300);
  }

  get_paraent_asso() {
    this.loaderStatus = true;
    this.apis.getParentAsso().subscribe((response: any) => {
      console.log(response);
      this.dataList = response.response.data;
      this.options = this.dataList;
      this.loaderStatus = false;
    });
  }

  downloadCSV() {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    var all_data: any = [];
    for (let i = 0; i < this.dataList.length; i++) {
      var data: any = [];
      var student_list: any = [];
      const element = this.dataList[i];
      data['username'] = element['username'];
      data['login'] = element['cred'];
      data['f_name'] = element['f_name'];
      data['m_name'] = element['m_name'];
      data['child_count'] = element.students.length;
      element.students.forEach((el: any) => {
        student_list +=
          el.name + '/' + el.account + '/' + el.standard.class + ', ';
      });
      data['student_details'] = student_list;
      all_data.push(data);
    }
    console.log(all_data);

    new AngularCsv(all_data, 'Parent Association List', this.csvOptions);
  }
  changeFather(id: any, uuid: any, name: any, f_name: any) {
    this.classesBoxStatus = true;
    this.title = name;
    this.current_parent = f_name;
    this.studentForm.patchValue({
      student_id: id,
      student_uuid: uuid,
    });
  }

  updateFather(id: any, uuid: any) {
    this.EditBoxStatus = true;
    this.parentUpdateForm.patchValue({
      id: id,
      uuid: uuid,
    });
  }

  addFather() {
    this.addBoxStatus = true;
  }
  clickClose() {
    this.classesBoxStatus = false;
    this.EditBoxStatus = false;
    this.addBoxStatus = false;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedOption = event.option.value;
    console.log('Selected option:', selectedOption);
    this.myControl.setValue(
      `${selectedOption.f_name} / ${selectedOption.cred}`
    );
    this.studentForm.patchValue({
      parental_id: selectedOption.id,
      parental_uuid: selectedOption.uuid,
    });
  }

  onChnageParent(dt: any) {
    var data: any = JSON.parse(dt);
    console.log(data);
    this.studentForm.patchValue({
      parental_id: data.id,
      parental_uuid: data.uuid,
    });
  }
  submitForm() {
    console.log(this.studentForm.value);
    this.apis
      .updateParentAsso(this.studentForm.value)
      .subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.apis.showNotifications('success', response.message);
          this.get_paraent_asso();
          this.classesBoxStatus = false;
          return;
        }
        this.apis.showNotifications('error', response.message);
      });
  }

  updateFatherFormSubmit() {
    console.log(this.parentUpdateForm.value);
    this.apis
      .updateParentDetail(
        this.parentUpdateForm.value.id,
        this.parentUpdateForm.value
      )
      .subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.apis.showNotifications('success', response.message);
          this.get_paraent_asso();
          this.EditBoxStatus = false;
          return;
        }
        this.apis.showNotifications('error', response.message);
      });
  }

  addFatherFormSubmit() {
    console.log(this.parentAddForm);
    if (this.parentAddForm.status == 'INVALID') {
      this.apis.showNotifications('error', 'All Star Marked Field Required');
      return;
    }
    this.apis
      .addParentDetail(this.parentAddForm.value)
      .subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.apis.showNotifications('success', response.message);
          this.get_paraent_asso();
          this.addBoxStatus = false;

          return;
        }
        this.apis.showNotifications('error', response.message);
      });
  }
}
