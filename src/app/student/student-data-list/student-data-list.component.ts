import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from 'src/app/master/components-services.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-student-data-list',
  templateUrl: './student-data-list.component.html',
  styleUrls: ['./student-data-list.component.css']
})
export class StudentDataListComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService , private cs:ComponentsServicesService) { }
  studentList:any =null
  school_code:any = 'Select School' 
  search_by:any = 'account'
  classList:any = []
  classId:any = 'all'
  sectionId:any = 'all'
  session:any = 'all'
  sectionList:any = []
  url:any
  pageCount:any = 10
  blob:any
  searchText:any
  csvOptions = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'Classes List',
    useBom: true,
    noDownload: false,
    headers: ["ID", "Account No", "Admission No" , "Student Name" , "Father Name" , "Mother Name" , "Gender" , 'DOB' , 'Class' , 'Section' , 'Login Mobile No']
  };
  searchType:string = 'full'


  univeralStudentData:any

  ngOnInit(): void {
      this.localStorageUpdate()
    if(localStorage.getItem('sub_host') != 'null'){
      this.showClass()
      this.showStudentAdmission('')
    }
    this.cs.studentList$.subscribe((response:any)=>{
     if(response){
      this.showStudentAdmission('')
     }
    })
  }
  showStudentAdmission(url:any){
    this.apis.showStudntList(url).subscribe((response:any)=>{
      console.log(response)
        if(response.response != null){
          this.studentList = response.response.data
          this.univeralStudentData = response.response.data 
        }else{
          this.studentList = []
        }
    })
  }

  downloadCSV() {
    console.log(this.studentList , 'okay')
    var data = []
    for (let index = 0; index < this.studentList.length; index++) {
      const element = this.studentList[index];
      var dt:any
      dt = {
        id: element.id,
        account: element.account,
        admission_no: element.admission_no,
        student_name: element.name,
        father_name: element.f_name,
        mother_name: element.m_name,
        gender: element.gender,
        dob: element.dob,
        class: element.class,
        DIV: element.DIV,
        cred: element.cred,
      }
      data.push(dt)
      
    }
    new AngularCsv( data , "Student_list", this.csvOptions);
  }

  showClass() {
    this.apis.showClass().subscribe((response: any) => {
      this.classList = response.response
    })
  }

  onSelectClass(id:any){
    if(id == 'all'){
      return
    }
    console.log(id)
    console.log(this.classList)
    for (let index = 0; index < this.classList.length; index++) {
      const element = this.classList[index];
      if(id == element.id){
        this.apis.showSelectiveClass(element.id  , element.uuid ).subscribe((response:any)=>{
          this.sectionList = []
          this.sectionList.push(response.response)
          console.log(this.sectionList)
        })    
      }
      
    }
    
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
    data.layout = 'student-list'
    this.cs.setAddBox(data)
  }

  onClickFileter(){
    var url:any
    if(this.classId != 'all'){
    this.classId = JSON.parse(this.classId)
    }
    if(this.session == 'old'){
      url = 'old=1&page_count='+this.pageCount+'&'
    }
    if(this.session == 'new'){
      url = 'new=1&page_count='+this.pageCount+'&'
    }
    if(this.session == 'all'){
      url = this.pageCount+'&'
    }
    if(this.classId != 'all'){
      url = url.concat('' , 'standard_id='+this.classId+'&')
      this.classId = JSON.stringify(this.classId)
      console.log(this.classId)
    }
     
    if(this.sectionId != 'all'){
      url = url.concat('' , 'division_standard_id='+this.sectionId)
    }
    this.url = url
    this.showStudentAdmission(this.url)
  }


  idCard(id:any  , uuid:any , name:any , standrad:any){
    this.apis.printIdCardI(id , uuid ).subscribe((response:any)=>{
      this.blob = new Blob([response], {type: 'application/pdf'});

      var downloadURL = window.URL.createObjectURL(response);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = name+'-'+standrad+"Id-Card.pdf";
      link.click();
      
    console.log(this.blob)
    })
  }
}
