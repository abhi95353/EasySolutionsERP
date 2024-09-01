import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent implements OnInit {

  constructor(private fb:FormBuilder , private apis:MasterAPIsServicesService) { }
  school_code: any = 'Select School';
  classList:any = []
  subjectForm = this.fb.group({
    name : [''],
    standard_list : this.fb.array([
    ])
  })
  ngOnInit(): void {
    this.localStorageUpdate()
  }


  get standard_list() {
    return this.subjectForm.get('standard_list') as FormArray;
  }

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.showClass()
      this.school_code = localStorage.getItem('school_code');
    }
  }


  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response;
      console.log(this.classList)
    });
  }
  addClass(id: any, uuid: any, event: any) {
    if (event.target.checked === true) {
      var data: any = []
      data = [{ 'id': id, 'uuid': uuid }]
      this.setValue(data)
    } else {
      for (let i = 0; i < this.standard_list.length; i++) {
        const element = this.standard_list.value[i];
        console.log(element , id)
        if(element.id == id){
          this.standard_list.removeAt(i)
        }
         
      }
    }

  }

  
  newClassList(id: any, uuid: any): FormGroup {
    return this.fb.group({
      id: [id],
      uuid: [uuid]
    })
  }
  setValue(item: any) {
    for (let dt of item) {
      this.findDuplicate(dt.id , dt.uuid)
    }
  }

  findDuplicate(id:any , uuid:any){
    var flag:any
    if(this.standard_list.length == 0){
      this.standard_list.push(this.newClassList(id,uuid))
      return
    }
   for (let i = 0; i < this.standard_list.length; i++) {
     const element = this.standard_list.value[i];
     if(element.id == id){
       alert('Class Already Selected')
       flag = 0
       return
     }else{
      flag = 1
     }
   }
   if(flag == 1){
    this.standard_list.push(this.newClassList(id,uuid))
   }
  }


  createSubject(){
    this.apis.storeSubject(this.subjectForm.value).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.apis.showNotifications('success' , response.message)
      }else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }









}
