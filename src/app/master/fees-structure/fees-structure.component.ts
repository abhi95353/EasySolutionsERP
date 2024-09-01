import { Component, OnInit } from '@angular/core';
import { ComponentsServicesService } from '../components-services.service';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-fees-structure',
  templateUrl: './fees-structure.component.html',
  styleUrls: ['./fees-structure.component.css']
})
export class FeesStructureComponent implements OnInit {

  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService) { }
  backgroundColor:any = 'green'
  classList:any = []
  school_code:any
  ngOnInit(): void {
    this.localStorageUpdate()

    if(localStorage.getItem('sub_host') != 'null'){
      this.showClasses()

    }
  }
  onClickFeesBox(id:any,uuid:any,value:any , class_name:any , layout:any){
    var data:any
    data = {'id':id ,'uuid':uuid, 'value':value , 'class' : class_name , 'layout':layout} 
    this.cs.setFeesBox(data)
  }
 
  showClasses(){
    this.apis.showClass().subscribe((response:any)=>{
      this.classList = []
      this.classList = response.response
    })
  }
  localStorageUpdate(){
    if(localStorage.getItem('sub_host') !== null){
      this.school_code = localStorage.getItem('school_code')
    }
  }

 
}
