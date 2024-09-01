import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';
import Swal from 'sweetalert2'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrls: ['./admission-list.component.css']
})
export class AdmissionListComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService , private fb:FormBuilder) { }
  studentList:any = null
  school_code:any = 'Select School' 
  search_by:any = 'account'
  routeData:any = []
  serviceBoxStatus:boolean = false
  submitStatus:boolean = false
  submitStatusTrans:boolean = false
  allCheckMarked: boolean = false;
  searchType:string = 'full'
  searchText:any


  countSearch:number = 0
  univeralStudentData:any

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

  transportForm = this.fb.group({
    student:this.fb.group({
      id:[],
      uuid:[]
    }),
    transportRoute:this.fb.group({
      id:[],
      uuid:[]
    }),

    month:this.fb.group({
      no:[],
    }),

  })

  customFeesForm = this.fb.group({
    studentLists: this.fb.array([]),
  });

  get studentLists() {
    return this.customFeesForm.get('studentLists') as FormArray;
  }

  ngOnInit(): void {
    this.localStorageUpdate()
    if(localStorage.getItem('sub_host') != 'null'){
      this.showStudentAdmission()
      this.showRoute()
    }
  }
  showStudentAdmission(){
    this.apis.showStudntList('url').subscribe((response:any)=>{
      console.log(response)
        if(response.response != null){
          this.studentList = response.response.data
          this.univeralStudentData = response.response.data 
        }else{
          this.studentList = null
        }
    })
  }

  // showStudentAdmission(){
  //   this.apis.showStudentAdmission().subscribe((response:any)=>{
  //     if(response.response != null){
  //       console.log(response)
  //      this.studentList = response.response.data
  //      this.univeralStudentData = response.response.data
  //     }
  //     console.log(this.studentList)
      
  //   })
  // }
  downloadCSV() {
    new AngularCsv( this.studentList , "classes_list", this.csvOptions);
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
    }
  }

  onChangingSearchBy(){
    this.univerData()
  }


  search(value: any) {
    var newDataList = []
    newDataList = this.studentList
    this.studentList = []     
    this.countSearch = 0
      value = value.trim()
      for (let i = 0; i < newDataList.length; i++) {
        var str = new RegExp('\\b'+value+'\\b', 'gi')
        if(this.searchType == 'full'){
          var str = new RegExp('\\b'+value+'\\b', 'gi')
        }else{
          var str = new RegExp(value, 'gi')
        }
         
        if(this.search_by == 'account'){
          if (newDataList[i].account.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        if(this.search_by == 'stud_name'){
          if (newDataList[i].name.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        if(this.search_by == 'f_name'){
          if (newDataList[i].f_name.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        if(this.search_by == 'mobile_no'){
          if (newDataList[i].mobile_no.match(str)) {
            this.studentList.push(newDataList[i])
          }
        }
        this.countSearch++
      }
  }

  Backsearch(value:any){
    if(value.data == undefined){
      this.univerData();
      return
    }
    if (value.inputType.match('deleteContentBackward')) {
        this.univerData()
    }
  }

  univerData(){
    this.studentList = this.univeralStudentData
  }


  showDetails(data:any){
    data.layout = 'admission-list' 
    this.cs.setAddBox(data)
  }




  onClickServiceBox(value:any){
    this.serviceBoxStatus = value
    }

   editTrans(data:any){
     var data:any
     data = JSON.parse(data)
   } 

  showRoute(){
    this.apis.showTransportRoute().subscribe((response: any) => {
      this.routeData = response.response;
    });
  }

  // onClickOpenBox(id:any , uuid:any){
  //   console.log(id, uuid)
  //   this.onClickServiceBox(true)
  // }

  onClickCheckBox(id:any , uuid:any){
    this.transportForm.controls.transportRoute.patchValue({id:id , uuid:uuid})
    console.log(this.transportForm.value)
  }

  submitData(){
    this.submitStatusTrans = true
    this.apis.updateStudentRoute(this.transportForm.value).subscribe((response:any)=>{
      if(response.success){
        this.showStudentAdmission()
        this.apis.showNotifications('success' , response.message)
        this.serviceBoxStatus = false

      }else{
        this.apis.showNotifications('error' , response.message)
      }
      this.submitStatusTrans = false
    })
  }

  applyDate(value:any){
    this.transportForm.controls.month.patchValue({
      no:value.slice(5)
    }) 
    console.log(this.transportForm.value)

  }



  onClickAll(event: any) {
    console.log(event.target.checked)
    if (event.target.checked === true) {
      this.allCheckMarked = true;
      this.studentLists.reset();
      this.studentLists.controls = [];
      for (let i = 0; i < this.studentList.length; i++) {
        const element = this.studentList[i];
        element.checked = true;
        // this.addStudent(element.id, element.uuid, event);
      }
    } else {
      this.allCheckMarked = false;
      this.studentLists.reset();
      this.studentLists.controls = [];
      for (let i = 0; i < this.studentList.length; i++) {
        const element = this.studentList[i];
        this.studentList[i].checked = false;
      }
    }
    console.log(this.studentList)
  }

  addStudent(id: any, uuid: any, event: any) {
    if (event.target.checked === true || event == true) {
      var data: any = [];
      data = [{ id: id, uuid: uuid, value: true }];
      this.setValue(data);
    } else {
      for (let i = 0; i < this.studentLists.length; i++) {
        const element = this.studentLists.value[i];
        if (element.id == id) {
          this.studentLists.removeAt(i);
        }
      }
    }
  }
  newStudentList(id: any, uuid: any, value: any): FormGroup {
    return this.fb.group({
      id: [id],
      uuid: [uuid],
      value: [value],
    });
  }
  setValue(item: any) {
    for (let dt of item) {
      this.findDuplicate(dt.id, dt.uuid, dt.value);
    }
  }

  findDuplicate(id: any, uuid: any, value: any) {
    var flag: any;

    if (this.studentLists.length == 0) {
      this.studentLists.push(this.newStudentList(id, uuid, value));
      return;
    }
    for (let i = 0; i < this.studentLists.length; i++) {
      const element = this.studentLists.value[i];
      if (element.id == id) {
        alert('Student Already Selected');
        flag = 0;
        return;
      } else {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.studentLists.push(this.newStudentList(id, uuid, value));
    }
  }

  deleteStudent(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apis.deleteBulkStudent(this.studentLists.value).subscribe((response:any)=>{
          if(response.success){
            this.apis.showNotifications('success' , response.message)
            this.studentLists.reset();
            this.studentLists.controls = [];
            for (let i = 0; i < this.studentList.length; i++) {
             this.studentLists.removeAt(i);
           }
           this.showStudentAdmission()
          }else{
            this.apis.showNotifications('error' , response.message)

          }

        })
     

      }
    })
  }



  setTransport(id:any , uuid:any){
    this.transportForm.controls.student.patchValue({id:id , uuid:uuid})
 
    this.cs.transportBox(this.transportForm.value)
  } 


}
