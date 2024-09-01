import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-custom-fees-list',
  templateUrl: './custom-fees-list.component.html',
  styleUrls: ['./custom-fees-list.component.css']
})
export class CustomFeesListComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService) { }
  studentList:any
  school_code:any = 'Select School' 
  customFeesList:any=[]
  regBoxStatus:boolean = false;
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
    headers: ["ID", "Classes", "Number Of Section"]
  };
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
      this.showActivitiyPro()
    }
  }
  

  showActivitiyPro(){
    this.apis.showActivitiyPro().subscribe((response:any)=>{
      this.customFeesList = response.response
      console.log(response)
    })
  }

  
  search(value: any) {
    var newDataList = []
    newDataList = this.studentList
    this.studentList = []
    
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
    this.studentList = []
    for (let i = 0; i < data.length; i++) {
    var list:any = {}
    const element = data[i];
    list = {'id':element.id ,'sid':element.student.id,'name':element.student.name,'account':element.student.account , 'uuid' : element.uuid}
    this.studentList.push(list)  
    }
    this.regBoxStatus = true
    console.log(this.studentList)
  }

  onClickRegBox(value:any){
    this.regBoxStatus = value
  }


  deleteStudentActivityPro(id:any , uuid:any){
    console.log(uuid)
    this.apis.deleteStudentActivitiyPro(id , uuid).subscribe((response)=>{
      console.log(response)
    })
  }

}

