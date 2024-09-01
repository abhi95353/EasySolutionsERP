import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-manage-student-facility',
  templateUrl: './manage-student-facility.component.html',
  styleUrls: ['./manage-student-facility.component.css']
})
export class ManageStudentFacilityComponent implements OnInit {

  constructor(private apis: MasterAPIsServicesService, private fb: FormBuilder) { }
  customFeesForm = this.fb.group({
    facility_id: [''], 
    is_terminate: [''], 
    studentList: this.fb.array([])
  }) 
  
  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false, 
    timer: 1500,
    timerProgressBar: true
  }) 
  submitStatus: boolean = false

  school_code: any = 'Select School' 
  classList: any = []
  studentData:any=[]
  facilityList:any=[]

  get studentList() {
    return this.customFeesForm.get('studentList') as FormArray;
  }

  ngOnInit(): void {
    this.localStorageUpdate()
    if (localStorage.getItem('sub_host') != 'null') {
      this.showClass()
    }
  } 

  localStorageUpdate() {
    if (localStorage.getItem('sub_host') !== null) {
      this.school_code = localStorage.getItem('school_code')
    }
  }

  // downloadCSV() {
  //   new AngularCsv('', "classes_list", this.csvOptions);
  // }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response
    })
  }

  onSelectClass(event:any){
    console.log(event.target.value)
    this.showSelectiveFacility(event.target.value)
    this.apis.showSelectiveClassStudent(event.target.value , 'uuid').subscribe((response:any)=>{
      this.studentData = []
      this.studentData = response.response
      
    })
  }

  showSelectiveFacility(id:any){
    this.apis.showStarndardFacility(id).subscribe((response:any)=>{
      this.facilityList = response.response
      console.log(this.facilityList)
    })
  }
  addStudent(id: any, name: any, event: any) {
    if (event.target.checked === true) {
      var data: any = []
      data = [{ 'id': id, 'name': name }]
      this.setValue(data)
    } else {
      for (let i = 0; i < this.studentList.length; i++) {
        const element = this.studentList.value[i];
        if(element.id == id){
          this.studentList.removeAt(i)
        }
        
      }
    console.log(this.studentList.value)
    }

  }
  newStudentList(id: any, name: any): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name]
    })
  }
  setValue(item: any) {
    for (let dt of item) {
      this.findDuplicate(dt.id , dt.name)
    }
  }

  findDuplicate(id:any , name:any){
    var flag:any
    if(this.studentList.length == 0){
      this.studentList.push(this.newStudentList(id,name))
      return
    }
   for (let i = 0; i < this.studentList.length; i++) {
     const element = this.studentList.value[i];
     console.log(element , id)
     if(element.id == id){
       alert('Student Already Selected')
       flag = 0
       return
     }else{
      flag = 1
     }
   }
   if(flag == 1){
    this.studentList.push(this.newStudentList(id,name))
   }
  }


  submit(){
    var icon:any
    var title : any
    this.submitStatus = true
    console.log(this.customFeesForm.value)
    this.apis.storeStudentFacility(this.customFeesForm.value).subscribe((response:any)=>{
      console.log(response)
      if (response.success) {
        icon = 'success'
        title = 'Success'
    
      } else {
        icon = 'error'
        title = 'Error'
      }
      this.submitStatus = false

      this.Toast.fire({
        icon: icon,
        title: title
      })
    })
  }



}
