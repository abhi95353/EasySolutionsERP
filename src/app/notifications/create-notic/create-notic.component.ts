import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-create-notic',
  templateUrl: './create-notic.component.html',
  styleUrls: ['./create-notic.component.css']
})
export class CreateNoticComponent implements OnInit {
  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService  , private fb:FormBuilder) { }
  regBoxStatus:boolean = false;
  action:any
  id:any
  uuid:any
  searchText:any
  hintBox: boolean = false;
  studentDataList:any
  admissionNo:any
  classList:any
  sectionList:any = []
  staffData:any = []
  categoryList:any=[]
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }
  noticeForm:FormGroup = this.fb.group({
    searchText2:[''],
    head:[''],
    body:[''],
    image:[''],
    noticable_type:['Admin'],
    to_admin: [''],
    to_student: [''],
    to_parent: this.fb.array([]),
    to_employee: [''],
    to_standard: this.fb.array([]),
    to_division_standard:[''],
    to_admin_data: this.fb.array([]),
    to_student_data: this.fb.array([]),
    to_parent_data: this.fb.array([]),
    to_employee_data: this.fb.array([]),
    to_standard_data: this.fb.array([]),
    to_division_standard_data: this.fb.array([]),
    notice_category_id: [''],
    student:[false],
    parent:[false],
    staff:[false],
    admin:[false]
  })
  // get to_student() {
  //   return this.noticeForm.get('to_student') as FormArray;
  // }
  get to_parent() {
    return this.noticeForm.get('to_parent') as FormArray;
  }
  // get to_division_standard() {
  //   return this.noticeForm.get('to_division_standard') as FormArray;
  // }
  // get to_employee() {
  //   return this.noticeForm.get('to_employee') as FormArray;
  // }
  get to_standard() {
    return this.noticeForm.get('to_standard') as FormArray;
  }
  
  get to_student_data() {
    return this.noticeForm.get('to_student_data') as FormArray;
  }
  get to_parent_data() {
    return this.noticeForm.get('to_parent_data') as FormArray;
  }
  get to_division_standard_data() {
    return this.noticeForm.get('to_division_standard_data') as FormArray;
  }
  get to_employee_data() {
    return this.noticeForm.get('to_employee_data') as FormArray;
  }
  get to_standard_data() {
    return this.noticeForm.get('to_standard_data') as FormArray;
  }
  get to_admin_data() {
    return this.noticeForm.get('to_admin_data') as FormArray;
  }
  ngOnInit(): void {
    this.cs.noticeBox$.subscribe((response:any)=>{
      console.log(response)
      this.showAllStudent();
      this.showClass();
      this. showAllEmployee();
      this.showCategory();
      this.action = response.action
      this.noticeForm.patchValue({noticable_type : localStorage.getItem('role')})
      // if(this.action == 'Update'){
      //   this.id = response.id
      //   this.uuid = response.uuid
      //   this.noticeForm.patchValue({
      //     head: response.head,
      //     body: response.body,
      //   })
      // }     
        this.regBoxStatus = true
    })
  }
  showCategory(){
    this.apis.shownoticeBoardCategory().subscribe((response:any)=>{
      this.categoryList = response.response.data
      console.log(this.categoryList)
    })
  }
  onClickRegBox(value:any){
    this.regBoxStatus = value
  }
  setFilter(value:any){
    this.searchText = value
  }
  submit(){ 
  
    if(this.action == 'Update'){
      // this.apis.updateNoticeBoard(this.id ,this.uuid, this.noticeForm.value).subscribe((response:any)=>{
      //   if(response.success){
      //     this.apis.showNotifications('success'  , response.message)
      //     this.noticeForm.reset()
      //     this.cs.refreshNoticsBox(true)
      //     this.regBoxStatus = false
      //   }else{
      //     this.apis.showNotifications('error' , response.message)
      //   }
      // })
    }else{
        let to_student = this.noticeForm.controls.to_student_data.value.map(this.getIds)
        let to_division_standard = this.noticeForm.controls.to_division_standard_data.value.map(this.getPivotIds)
        let to_employee = this.noticeForm.controls.to_employee_data.value.map(this.getIds)
      if(this.noticeForm.value.student){
        to_student = [0];
      }
   
      if(this.noticeForm.value.staff){
        to_employee = [0];
      }
      if(this.noticeForm.value.admin){
        this.noticeForm.patchValue({to_admin:1}) ;
      }
      this.noticeForm.controls.to_student.patchValue(to_student)
      this.noticeForm.controls.to_division_standard.patchValue(to_division_standard)
      this.noticeForm.controls.to_employee.patchValue(to_employee);

      this.apis.createnoticeBoard(this.noticeForm.value).subscribe((response:any)=>{
        console.log(this.noticeForm.value)
        if(response.success){
          this.apis.showNotifications('success'  , response.message)
          this.cs.refreshNoticsBox(true)
          this.to_student_data.clear()
          this.to_division_standard_data.clear()
          this.to_employee_data.clear()
          this.noticeForm.reset()
          this.regBoxStatus = false
        }else{
          this.apis.showNotifications('error' , response.message)
        }
      })
    }
  }
  getIds(item:any){
    return item.id;
  }
  getPivotIds(item:any){
    return item.section_pivot_id;
  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.noticeForm.patchValue({
            image:event.target.result
          })
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  focusIn(){
    this.hintBox = true;
  }
  onChangeBox(dt:any , type:any ) {
    this.admissionNo = dt.account;
    this.searchText = dt.account
    if(type == 'student'){
    this.addStudent(dt.id , dt.name , dt.account , true)
    }
    if(type == 'parent'){
    console.log(type)
    this.addParents(dt.id , dt.name , dt.account , true)
    }
    setTimeout(() => {
      // this.searchByAdmission()
    }, 500);
  }
  onFocusOut() {
    setTimeout(() => {
      this.hintBox = false;
    }, 300);
  }
  showAllStudent() {
    this.apis.allStudentList().subscribe((response: any) => {
      this.studentDataList = response.response.data;
    });
  }
  filter(value:any){
    this.searchText = value
  }
  addStudent(id: any, name: any, account:any ,event: any) {
    if (event == true) {
      var data: any = [];
      data = [{ id: id, name: name, account, value: true }];
      this.setValue(data);
    } 
    else {
      for (let i = 0; i < this.to_student_data.length; i++) {
        const element = this.to_student_data.value[i];
        if (element.id == id) {
          this.to_student_data.removeAt(i);
        }
      }
    }
  }
  newStudentList(id: any, name: any, account:any , value: any): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name],
      value: [value],
      account: [account]
    });
  }
  setValue(item: any) {
    for (let dt of item) {
      this.findDuplicate(dt.id, dt.name,dt.account , dt.value);
    }
  }
  findDuplicate(id: any, name: any, account:any , value: any) {
    var flag: any;
    if (this.to_student_data.length == 0) {
      this.to_student_data.push(this.newStudentList(id, name, account , value));
      return;
    }
    for (let i = 0; i < this.to_student_data.length; i++) {
      const element = this.to_student_data.value[i];
      if (element.id == id) {
        alert('Student Already Selected');
        flag = 0;
        return;
      } else {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.to_student_data.push(this.newStudentList(id, name, account, value));
     
    }
  }









  addParents(id: any, name: any, account:any ,event: any) {
    console.log(id , name , event , this.noticeForm)
    if (event == true) {
      var data: any = [];
      data = [{ id: id, name: name, account, value: true }];
      this.setParentValue(data);
    } 
    else {
      for (let i = 0; i < this.to_parent_data.length; i++) {
        const element = this.to_parent_data.value[i];
        if (element.id == id) {
          this.to_parent_data.removeAt(i);
        }
      }
    }
  }
  newParentList(id: any, name: any, account:any , value: any): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name],
      value: [value],
      account: [account]
    });
  }
  setParentValue(item: any) {
    for (let dt of item) {
      this.findDuplicateParent(dt.id, dt.name,dt.account , dt.value);
    }
  }

  findDuplicateParent(id: any, name: any, account:any , value: any) {
    var flag: any;
    if (this.to_parent_data.length == 0) {
      this.to_parent.push(this.newParentList(id, name, account , value));
      return;
    }
    for (let i = 0; i < this.to_parent_data.length; i++) {
      const element = this.to_parent_data.value[i];
      if (element.id == id) {
        alert('Student Already Selected');
        flag = 0;
        return;
      } else {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.to_parent_data.push(this.newParentList(id, name, account, value));
    }
  }



  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
      console.log(this.classList)
    });
  }

  onSelectClass(event: any) {
    var value: any;
    value = JSON.parse(event.target.value);
    this.apis
      .showSelectiveClass(value.id, value.uuid)
      .subscribe((response: any) => {
        this.sectionList = [];
        this.sectionList = response.response;
        console.log(this.sectionList)
      });
  }


  
  onClickSection(pivot_id:any , class_name:any , section:any, event:any){
    
    if (event.target.checked === true) {
      this.findDuplicateSection(pivot_id,class_name,section)
    } else {
      for (let i = 0; i < this.noticeForm.value.to_division_standard_data.length; i++) {
        const element = this.noticeForm.controls.to_division_standard_data.value[i];
        console.log(element.section_pivot_id_data , pivot_id)
        if(element.section_pivot_id_data == pivot_id){
          this.to_division_standard_data.removeAt(i)
        }
      }      
    }
  }

  deleteSection(pivot_id:any){
    for (let i = 0; i < this.noticeForm.value.to_division_standard_data.length; i++) {
      const element = this.noticeForm.controls.to_division_standard_data.value[i];
      console.log(element , pivot_id)
      console.log(element.section_pivot_id , pivot_id)
      if(element.section_pivot_id == pivot_id){
        this.to_division_standard_data.removeAt(i)
      }
    }   
  }


  findDuplicateSection(pivot_id:any , class_name:any , section:any){
    var flag:any
    if(this.to_division_standard_data.length == 0){
      this.addSection(pivot_id,class_name,section)
      return
    }
   for (let i = 0; i < this.to_division_standard_data.length; i++) {
     const element = this.to_division_standard_data.value[i];
     console.log(element , pivot_id)
     if(element.section_pivot_id == pivot_id){
       alert('Section Already Selected')
       flag = 0
       return
     }else{
      flag = 1
     }
   }
   if(flag == 1){
    this.addSection(pivot_id,class_name,section)
   }
  }

  addSection(pivot:any , class_name:any , section:any){
    this.to_division_standard_data.push( this.fb.group({
     section_pivot_id:[pivot],
     class_name:[class_name],
     section:[section],
   }))
   }






   showAllEmployee() {
    this.apis.getAllEmployee().subscribe((response: any) => {
      this.staffData = response.response;
      console.log(response)
    });
  }

  addStaff(id: any, name: any, account:any ,event: any) {
    if (event.target.checked == true) {
      var data: any = [];
      data = [{ id: id, name: name, account, value: true }];
      this.setStaffValue(data);
    } 
    else {
      for (let i = 0; i < this.to_employee_data.length; i++) {
        const element = this.to_employee_data.value[i];
        if (element.id == id) {
          this.to_employee_data.removeAt(i);
        }
      }
    }
  }

  newStaffList(id: any, name: any, account:any , value: any): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name],
      value: [value],
      account: [account]
    });
  }
  setStaffValue(item: any) {
    for (let dt of item) {
      this.findDuplicateStaff(dt.id, dt.name,dt.account , dt.value);
    }
  }

  findDuplicateStaff(id: any, name: any, account:any , value: any) {
    var flag: any;
    if (this.to_employee_data.length == 0) {
      this.to_employee_data.push(this.newStaffList(id, name, account , value));
      return;
    }
    for (let i = 0; i < this.to_employee_data.length; i++) {
      const element = this.to_employee_data.value[i];
      if (element.id == id) {
        alert('Student Already Selected');
        flag = 0;
        return;
      } else {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.to_employee_data.push(this.newStaffList(id, name, account, value));
    }
  }

  deleteStaff(id:any){
    for (let i = 0; i < this.noticeForm.value.to_employee_data.length; i++) {
      const element = this.noticeForm.controls.to_employee_data.value[i];
      if(element.id == id){
        this.to_employee_data.removeAt(i)
      }
    }   
  }

}
 
