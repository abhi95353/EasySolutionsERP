import { Component, OnInit } from '@angular/core';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-concession-box',
  templateUrl: './concession-box.component.html',
  styleUrls: ['./concession-box.component.css']
})
export class ConcessionBoxComponent implements OnInit {

  constructor(private cs:ComponentsServicesService , private apis: MasterAPIsServicesService , private fb:FormBuilder) { }
  visibility:boolean = false
  dataList:any = {}
  dataMatch:any
  account:any
  type:any
  concessionBox:any = this.fb.group({
   concession:this.fb.array([])
  })

  get concession() {
    return this.concessionBox.get('concession') as FormArray;
  }
  ngOnInit(): void {
    this.cs.concessionBox$.subscribe((response:any)=>{
      this.visibility = response.status
      this.dataMatch = []
      this.type = response.type
      this.dataMatch = response.data
      this.account = response.account
      if(response.type == 'concessions'){
      this.addForm()
      this.createConcession()
    }else{
      // this.showFine()
      }
    })
  }

 
  closeBox(){
    this.visibility = false
    var data:any = {'account_no' : this.account , 'auto_print' : false , 'type' : 'MF'}
    this.cs.passAccountNo(data)
  } 



  addForm(){
    this.concession.clear()
    this.concession.push(
      this.fb.group({
        id: this.dataMatch.id,
        uuid: this.dataMatch.uuid,
        name:'Third Child Concession',
        mode: 0,
        is_active: 0,
        is_active_all: 0
      }))

      this.concession.push(
        this.fb.group({
          id: this.dataMatch.id,
        uuid: this.dataMatch.uuid,
          name:'Staff Concession',
          mode: 0,
          is_active: 0,
        is_active_all: 0

        }))

        this.concession.push(
          this.fb.group({
            id: this.dataMatch.id,
            uuid: this.dataMatch.uuid,
            name:'Fatherless Concession',
            mode: 0,
            is_active: 0,
        is_active_all: 0

          }))
    
  }

  // showFine(){
  //   this.apis.showFineValueList().subscribe((response:any)=>{
  //     this.dataList = response.response.data
  //     for (let index = 0; index < this.dataList.length; index++) {
  //       const element = this.dataList[index];
  //       var flag:any = 0
  //       for (let i = 0; i < this.dataMatch.length; i++) {
  //         const el = this.dataMatch[i];
  //         if(el.name === element.name){
  //           this.dataList[index].status = true             
  //           flag = 1
  //           break
  //         }else{
  //           this.dataList[index].status = false
  //         }
  //         if(flag == 1){
  //           break
  //         }
  //       }
        
        
  //     }
  //   })
  // }


// showConcession(){
//     this.apis.showConsessionValueList().subscribe((response:any)=>{
//     this.dataList = response.response.data
//     for (let index = 0; index < this.dataList.length; index++) {
//       const element = this.dataList[index];
//       var flag:any = 0
//       for (let i = 0; i < this.dataMatch.length; i++) {
//         const el = this.dataMatch[i];
//         if(el.name === element.name){
//           this.dataList[index].status = true             
//           flag = 1
//           break
//         }else{
//           this.dataList[index].status = false
//         }
//         if(flag == 1){
//           break
//         }
//       }
      
      
//     }
//   })
// }


createConcession(){
  var newForm:any
  this.dataList = {
    'Third Child Concession': 0 ,
    'Employee Ward Concession' : 0 ,
    'Fatherless Concession' : 0
  }
if(this.dataMatch.conc_3c){
  this.dataList['Third Child Concession'] = this.dataMatch.conc_3c
  this.concession.controls[0].patchValue({is_active: 1})
}
if(this.dataMatch.conc_ew){
  this.dataList['Employee Ward Concession'] = this.dataMatch.conc_ew
  this.concession.controls[1].patchValue({is_active: 1})


}
if(this.dataMatch.conc_fl){
  this.dataList['Fatherless Concession'] = this.dataMatch.conc_fl
  this.concession.controls[2].patchValue({is_active: 1})

}
}


updateConcession(event:any , value:any , mode:any , is_active:any){
  var data:any = {}
  data.account = this.account
  data.name = name
  data.is_active = event.target.checked
  if(this.type == 'fines'){
    this.apis.updateFineStudent(data).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
      }else{
        this.apis.showNotifications('error' , response.message)
  
      }
    })
  }else{
    
    for (let index = 0; index < this.concession.length; index++) {
      const element = this.concession.controls[index].value;
      if(element.name  == value.name){
        if(mode == 1){
        if(element.is_active){
        this.concession.controls[index].patchValue({mode:mode , is_active:0})
        }else{
        this.concession.controls[index].patchValue({mode:mode , is_active:1})
        }
      }

      if(mode == 0){
        if(element.is_active_all){
        this.concession.controls[index].patchValue({mode:mode , is_active_all:0})
        this.concession.controls[index].patchValue({mode:mode , is_active:0})

        }else{
        this.concession.controls[index].patchValue({mode:mode , is_active_all:1})
        this.concession.controls[index].patchValue({mode:mode , is_active:1})

        }
      }
        data = this.concession.controls[index].value
      }
    }
    this.apis.updateNewConcessionStudent(data).subscribe((response:any)=>{
      if(response.success){
        this.apis.showNotifications('success' , response.message)
      }else{
        this.apis.showNotifications('error' , response.message)
  
      }
    })
  }


}
}
