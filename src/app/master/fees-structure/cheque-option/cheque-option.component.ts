import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-cheque-option',
  templateUrl: './cheque-option.component.html',
  styleUrls: ['./cheque-option.component.css']
})
export class ChequeOptionComponent implements OnInit {

  constructor(private apis:MasterAPIsServicesService) { }
  studentList:any
  school_code:any = 'Select School' 
  showChequeList:any=[]
  regBoxStatus:boolean = false;
  printStatus:boolean = false
  printValue:any
  searchText:any 
  ngOnInit(): void {
    this.localStorageUpdate()
    if(localStorage.getItem('sub_host') != 'null'){

    }
  }

  localStorageUpdate(){
    if(localStorage.getItem('sub_host') != null){
      this.school_code = localStorage.getItem('school_code')
      this.showCheque()
    }
  }

  showCheque(){
    this.apis.showChequePayment().subscribe((response:any)=>{
      this.showChequeList = response.response.data
      console.log(response)
      // this.apis.showChequeStatus().subscribe((res:any)=>{
      //   for (let i = 0; i < res.length; i++) {
      //     const element = res[i];
      //     for (let j = 0; j < this.showChequeList.length; j++) {
      //       const el = this.showChequeList[j];
      //       console.log(element.uuid , el.uuid)
      //       if(element.uuid == el.uuid)
      //       {
      //         this.showChequeList[j].status = element.status
      //       }
      //     }
      //   }
      //   console.log(this.showChequeList)
      // })
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

  updateCheque(id:any , uuid:any , value:any){
    console.log(id,uuid,value)
    if(value == 'success'){
      var vl = '3'
      this.apis.updatePayment(id,uuid,vl).subscribe((response:any)=>{
        console.log(response , 'sftfw')
        if(response.success){
          this.apis.showNotifications('success' , 'success')
          this.showCheque()
        }else{
          this.apis.showNotifications('error' , response.message)
        }
      }
      )
    }else{
      Swal.fire({
        title: 'Is Cheque Bounced?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.apis.updatePayment(id,uuid,'4').subscribe((response:any)=>{
            if(response.success){
              this.apis.showNotifications('success' , 'success')
            }else{
              this.apis.showNotifications('error' , response.message)
            }
            this.showCheque()
          }
          )
        } else if (result.isDenied) {
          this.apis.updatePayment(id,uuid,'2').subscribe((response:any)=>{
            if(response.success){
              this.apis.showNotifications('success' , 'success')
            }else{
              this.apis.showNotifications('error' , response.message)
            }
            this.showCheque()

          }
          )
        }
      })
    }
    
  }

  printPage(value:any , status:any) {
    this.printStatus = status
    console.log(value)
    this.printValue = value
    this.printValue.school_name = localStorage.getItem('school_name')
    this.printStatus = status
  }

}

