import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-view-student-facility',
  templateUrl: './view-student-facility.component.html',
  styleUrls: ['./view-student-facility.component.css']
})
export class ViewStudentFacilityComponent implements OnInit {

 
  constructor(private apis:MasterAPIsServicesService , private fb: FormBuilder) { }
  studentListData:any
  school_code:any = 'Select School' 
  customFeesList:any=[]
  regBoxStatus:boolean = false;
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Classes List',
    useBom: true,
    noDownload: false,
    headers: ["ID", "Classes", "Number Of Section"]
  };
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
  
  get studentList() {
    return this.customFeesForm.get('studentList') as FormArray;
  }
  ngOnInit(): void {
    this.localStorageUpdate()
    if(localStorage.getItem('sub_host') != 'null'){

    }
  }

 
  downloadCSV() {
    new AngularCsv( this.studentList , "classes_list", this.csvOptions);
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
      this.showFacility()
    }
  }
  

  showFacility(){
    this.apis.showStudentAvailFacility().subscribe((response:any)=>{
      this.customFeesList = response.response
      console.log(response)
    })
  }
  search(value: any) {
    var newDataList = []
    newDataList = this.studentListData
    this.studentListData = []
    
    if (value.inputType.match('deleteContentBackward')) {
    }
    else {
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp(value.data, 'gi')
        if (newDataList[i].stud_name.match(str)) {
          this.studentList.push(newDataList[i])
        }
      }
    }
  }

  showDetails(data:any){
    this.studentListData = []
    for (let i = 0; i < data.length; i++) {
    var list:any = {}
    const element = data[i];
    list = {'id':element.id ,'sid':element.student.id,'name':element.student.name,'admission_no':element.student.admission_no}
    this.studentListData.push(list)  
    }
    this.regBoxStatus = true
    console.log(this.studentListData)
  }

  onClickRegBox(value:any){
    this.regBoxStatus = value
  }


  deleteStudentActivityPro(id:any){
    this.apis.deleteStudentActivitiyPro(id , 'uuid').subscribe((response)=>{
      console.log(response)
    })
  }

 
  newStudentList(id: any): FormGroup {
    return this.fb.group({
      id: [id],
    })
  }
  setValue(item: any) {
    for (let dt of item) {
      this.studentList.push(this.newStudentList(dt.id))
    }
    console.log(this.studentList.value)
  }

  submit(facility_id:any , student_id:any){
    var icon:any
    var title : any
    // this.submitStatus = true
    this.customFeesForm.patchValue({
      facility_id:facility_id,
      is_terminate:1
    })
    console.log(facility_id,student_id)
    var data: any = []
    data = [{ 'id': student_id }]
    this.setValue(data)
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
      // this.submitStatus = false

      this.Toast.fire({
        icon: icon,
        title: title
      })
    })
  }

}

