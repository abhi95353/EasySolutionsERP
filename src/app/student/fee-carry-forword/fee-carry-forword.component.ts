import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fee-carry-forword',
  templateUrl: './fee-carry-forword.component.html',
  styleUrls: ['./fee-carry-forword.component.css']
})
export class FeeCarryForwordComponent implements OnInit {

  constructor(
    private apis: MasterAPIsServicesService,
    private fb: FormBuilder
  ) {}
  feesCarryForwardForm = this.fb.group({
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
    return this.feesCarryForwardForm.get('studentList') as FormArray;
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
        this.addStudent(element.id, element.name, element.uuid , element ,event);
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

  addStudent(id: any, name: any,uuid:any , dt:any ,event: any) {
    if (event.target.checked === true || event == true) {
      var data: any = [];
      if(dt.fee_collects.length > 0){
      data = [{ id: id, name: name, uuid: uuid , account:dt.account , amount:dt.fee_collects[0].due  }];

      }else{
        data = [{ id: id, name: name, uuid: uuid , account:dt.account , amount:0 }];

      }
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
  newStudentList(id: any, name: any, uuid: any , account:any , amount:any ): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name],
      uuid: [uuid],
      bal: [amount],
      account: [account],
    });

  }
  setValue(item: any) {
    for (let dt of item) {
      this.findDuplicate(dt.id, dt.name, dt.uuid , dt.account , dt.amount);
    }
  }

  findDuplicate(id: any, name: any, uuid: any , account:any , amount:any) {
    var flag: any;
    if (this.studentList.length == 0) {
      this.studentList.push(this.newStudentList(id, name, uuid ,account , amount));
      console.log(this.studentList.value)

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
      this.studentList.push(this.newStudentList(id, name, uuid ,account,amount));
    }
  } 

  submit() {
    var icon: any;
    var title: any;
    this.submitStatus = true;
    if(this.studentList.value.length <0){
      return
    }
    console.log(this.feesCarryForwardForm.value)
    this.apis
      .carryStudentNextFun(this.feesCarryForwardForm.value)
      .subscribe((response: any) => {
        if (response.success) {
          icon = 'success';
          title = 'Success';
          this.allCheckMarked = false;
          this.studentList.reset();
          this.studentList.controls = [];
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
        this.apis.getStudentCarryForwardList(element.pivot.id , element.pivot.uuid).subscribe((response:any)=>{
          console.log(response)
          this.studentData = [];
          if (response.response != null) {
            this.studentData = response.response.data;
          }
        })
      }
      
    }
  }

  updateAmount(amount:any , id:any){
    for (let index = 0; index < this.studentList.value.length; index++) {
      const element = this.studentList.value[index];
      if(element.id == id){
        element.bal = amount
      }
      
    }
  }


  // showCarryForwardList(){
  //   this.apis.getStudentCarryForwardList().subscribe((response:any)=>{
  //     console.log(response , 'Carry')
  //   })
  // }
}
