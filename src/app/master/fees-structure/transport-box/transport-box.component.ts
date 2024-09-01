import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { ComponentsServicesService } from '../../components-services.service';

@Component({
  selector: 'app-transport-box',
  templateUrl: './transport-box.component.html',
  styleUrls: ['./transport-box.component.css']
})
export class TransportBoxComponent implements OnInit {

  constructor(private cs:ComponentsServicesService , private apis: MasterAPIsServicesService , private fb:FormBuilder) { }
  visibility:boolean = false
  routeData:any = []
  submitStatusTrans:boolean = false
  account:any
  studentData:any []
  fid:any
  fuuid:any
  trueAll:boolean = false
  allLoadingStatus:boolean = false
  transportForm = this.fb.group({
    transportRoute:this.fb.group({
      id:[],
      uuid:[]
    }),
 
    mode:[],
    is_active : [],
    studentFee:this.fb.group({
      id:[],
      uuid:[]
    })

  }) 
  ngOnInit(): void {
    this.cs.transportBox$.subscribe((response:any)=>{
    console.log(response)
    this.fid = response.dt.id
    this.fuuid = response.dt.uuid
    this.account = response.student.account
    this.showRoute()
    this.onClickOpenBox(this.account)
    this.account = response.student.account

    })
    }

    
  showRoute(){
    this.apis.showTransportRoute().subscribe((response: any) => {
      this.routeData = response.response;
    });
  }

  onClickOpenBox(account:any){
    this.onClickServiceBox(true)
    this.apis.showStudentTransportDetails(account).subscribe((response:any)=>{
      this.studentData =  response.response.data
    })
  }
 
  onClickCheckBox(id:any , uuid:any){
    this.transportForm.controls.transportRoute.patchValue({id:id , uuid:uuid})
    console.log(this.transportForm.value)
    this.onClickOpenBox(this.account)
  }

  onClickServiceBox(value:any){
    this.visibility = value 
    } 


    submitAllData(event:any){
      this.allLoadingStatus = true
      this.trueAll = true
    this.transportForm.patchValue({mode : 0 })
    if(event.target.checked){
    this.transportForm.patchValue({is_active : 1 })

    }else{
    this.transportForm.patchValue({mode : 0 })
    this.transportForm.patchValue({is_active : 0 })

    }
    console.log(this.transportForm.value)

        this.apis.updateStudentRouteAll(this.transportForm.value).subscribe((response:any)=>{
          if(response.success){
            this.apis.showNotifications('success' , response.message)
            var data:any = {'account_no' : this.account , 'auto_print' : false , 'type' : 'MF'}
            this.trueAll = false
            this.visibility = false
            this.allLoadingStatus = false
            this.cs.passAccountNo(data)
            this.onClickOpenBox(this.account)

    
          }else{
          this.apis.showNotifications('error' , response.message)

          }
        })
        
    }


    submitData(id:any , uuid:any , event:any , last:boolean){
      if(this.transportForm.value.transportRoute != null){
      if(this.transportForm.value.transportRoute.id == null){
        this.onClickOpenBox(this.account)

        this.apis.showNotifications('error' , 'Please! Select Transport Route')
        return
      }
    }
    this.transportForm.controls.studentFee.patchValue({id:id , uuid:uuid})

      if(event.target.checked){
        this.transportForm.patchValue({is_active:1 , mode:1})

      }else{
        this.transportForm.patchValue({is_active:0 , mode:1})
        this.transportForm.value.transportRoute = null
        
      }

      
      this.submitStatusTrans = true
      console.log(this.transportForm.value)
      this.apis.updateStudentRouteAll(this.transportForm.value).subscribe((response:any)=>{
        if(response.success){
          this.apis.showNotifications('success' , response.message)
          var data:any = {'account_no' : this.account , 'auto_print' : false , 'type' : 'MF'}
          
         if(last){
          this.trueAll = false
          this.visibility = false
          this.allLoadingStatus = false
          this.cs.passAccountNo(data)
          this.onClickOpenBox(this.account)

        }
  
        }else{
          this.apis.showNotifications('error' , response.message)

        }
       
      })
    }
  
    applyDate(value:any){
      console.log(value)
      this.transportForm.controls.month.patchValue({
        no:value.slice(5)
      }) 
    }

  
  }
