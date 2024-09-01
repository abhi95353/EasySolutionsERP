import { Component, OnInit } from '@angular/core';
import { ComponentsServicesService } from '../../components-services.service';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create-fees-structure',
  templateUrl: './create-fees-structure.component.html',
  styleUrls: ['./create-fees-structure.component.css']
})
export class CreateFeesStructureComponent implements OnInit {

  constructor(private cs: ComponentsServicesService, private apis: MasterAPIsServicesService, private fb: FormBuilder) { }
  feesBoxStatus: boolean = false;
  facilityList: any = []
  title: any
  classFacility: any
  id: any
  layout:any
  dataArray: any = []
  submitStatus: boolean = false
  uuid:any
  academicSession:any = "undefined"
  feesStructureForm = this.fb.group({
    standard_id: [''],
    academic_session_id: [''],
    std_fclty: this.fb.array([

    ])
  })
  sessionList:any = []

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

  get std_fclty() {
    return this.feesStructureForm.get('std_fclty') as FormArray;
  }

  ngOnInit(): void {
    this.cs.feesBox$.subscribe((response: any) => {
      this.feesBoxStatus = response.value
      this.title = response.class
      this.id = response.id
      this.std_fclty.controls = []
      this.feesStructureForm.reset()
      this.std_fclty.reset()
      this.layout = response.layout
      this.uuid = response.uuid
      this.showSession()
     
    })
  }

  onClickClassesBox(value: any) {
    this.cs.setFeesBox(value)
  }
  onClickClassesBoxClose(value: any) {
    this.feesBoxStatus = value
  }

  facilityBox(value: any, data: any, index: any , id:any) {
    if (value == 0) {
      this.dataArray.push(data)
      this.std_fclty.controls[index].patchValue({ 'is_active': 1 })
    } else {
      for (let i = 0; i < this.dataArray.length; i++) { 
        if(this.dataArray[i].facility_id == id){
          this.dataArray.splice(i, 1)
        this.std_fclty.controls[index].patchValue({ 'is_active': 0 }) 
        }
      }
      
    }
  }
  updateValue(id:any , value: any, data: any , i:any) {
    for (let index = 0; index < this.dataArray.length; index++) {

      if(this.dataArray[index].facility_id == id){
        if (value == 'apr') {
          this.dataArray[index].jan = data.target.value
          this.dataArray[index].feb = data.target.value
          this.dataArray[index].mar = data.target.value
          this.dataArray[index].apr = data.target.value
          this.dataArray[index].may = data.target.value
          this.dataArray[index].jun = data.target.value
          this.dataArray[index].jul = data.target.value
          this.dataArray[index].aug = data.target.value
          this.dataArray[index].sep = data.target.value
          this.dataArray[index].oct = data.target.value
          this.dataArray[index].nov = data.target.value
          this.dataArray[index].dec = data.target.value

          this.std_fclty.controls[i].patchValue({ 'jan':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'feb':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'mar':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'apr':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'may':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'jun':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'jul':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'aug':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'sep':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'oct':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'nov':  data.target.value }) 
          this.std_fclty.controls[i].patchValue({ 'dec':  data.target.value }) 
        }
        if (value == 'feb') {
          this.dataArray[index].feb = data.target.value
        }
        if (value == 'mar') {
          this.dataArray[index].mar = data.target.value
        }
        if (value == 'apr') {
          this.dataArray[index].apr = data.target.value
        }
        if (value == 'may') {
          this.dataArray[index].may = data.target.value
        }
        if (value == 'jun') {
          this.dataArray[index].jun = data.target.value
        }
        if (value == 'jul') {
          this.dataArray[index].jul = data.target.value
        }
        if (value == 'aug') {
          this.dataArray[index].aug = data.target.value
        }
        if (value == 'sep') {
          this.dataArray[index].sep = data.target.value
        }
        if (value == 'oct') {
          this.dataArray[index].oct = data.target.value
        }
        if (value == 'nov') {
          this.dataArray[index].nov = data.target.value
        }
        if (value == 'dec') {
          this.dataArray[index].dec = data.target.value
        }
      } 
      
    }
   
  }

  showFacility() {
    this.apis.showFacility().subscribe((response: any) => {
      this.facilityList = []
      this.facilityList = response.response.data
      console.log(this.facilityList , 'facilityList')

      this.showApplyFacility()
    })
  }

  showApplyFacility() {
    this.apis.showSelectiveClassFacility(this.id , this.uuid , this.academicSession).subscribe((response: any) => {
      this.classFacility = []
      this.classFacility = response.response.facilities
      console.log(this.classFacility  , this.academicSession , 'applied')
      this.processFeesStructure()
    })
  }

  processFeesStructure() {
   if(this.layout == 'add'){
    for (let i = 0; i < this.facilityList.length; i++) {
      console.log(this.facilityList[i].id ,'id')
      for (let j = 0; j < this.classFacility.length; j++) {
        if(this.facilityList[i].id === this.classFacility[j].id) {
          this.facilityList.splice(i, 1)
        }
      }
    }
   }
    this.addForm()
  }

  addForm() {
    var arr: any
    this.std_fclty.reset();
    this.feesStructureForm.reset();
    this.std_fclty.controls = []
    if(this.layout == 'add'){
      for (let i = 0; i < this.facilityList.length; i++) {
        arr = this.fb.group({
          facility_id: [this.facilityList[i].id],
          jan_active: [this.facilityList[i].jan],
          jan: [0],
          feb_active: [this.facilityList[i].feb],
          feb: [0],
          mar_active: [this.facilityList[i].mar],
          mar: [0],
          apr_active: [this.facilityList[i].apr],
          apr: [0],
          may_active: [this.facilityList[i].may],
          may: [0],
          jun_active: [this.facilityList[i].jun],
          jun: [0],
          jul_active: [this.facilityList[i].jul],
          jul: [0],
          aug_active: [this.facilityList[i].aug],
          aug: [0],
          sep_active: [this.facilityList[i].sep],
          sep: [0],
          oct_active: [this.facilityList[i].oct],
          oct: [0],
          nov_active: [this.facilityList[i].nov],
          nov: [0],
          dec_active: [this.facilityList[i].dec],
          dec: [0],
          is_active: [0],
          name: [this.facilityList[i].name],
        })
        this.std_fclty.push(arr)
      }
    }
    else{
      for (let i = 0; i < this.classFacility.length; i++) {
        arr = this.fb.group({
          facility_id: [this.classFacility[i].id],
          jan_active: [this.classFacility[i].jan],
          jan: [this.classFacility[i].pivot.jan],
          feb_active: [this.classFacility[i].feb],
          feb: [this.classFacility[i].pivot.feb],
          mar_active: [this.classFacility[i].mar],
          mar: [this.classFacility[i].pivot.mar],
          apr_active: [this.classFacility[i].apr],
          apr: [this.classFacility[i].pivot.apr],
          may_active: [this.classFacility[i].may],
          may: [this.classFacility[i].pivot.may],
          jun_active: [this.classFacility[i].jun],
          jun: [this.classFacility[i].pivot.jun],
          jul_active: [this.classFacility[i].jul],
          jul: [this.classFacility[i].pivot.jul],
          aug_active: [this.classFacility[i].aug],
          aug: [this.classFacility[i].pivot.aug],
          sep_active: [this.classFacility[i].sep],
          sep: [this.classFacility[i].pivot.sep],
          oct_active: [this.classFacility[i].oct],
          oct: [this.classFacility[i].pivot.oct],
          nov_active: [this.classFacility[i].nov],
          nov: [this.classFacility[i].pivot.nov],
          dec_active: [this.classFacility[i].dec],
          dec: [this.classFacility[i].pivot.dec],
          is_active: [0],
          name: [this.classFacility[i].name],
        })
        this.std_fclty.push(arr)
      }
    }
  }

  addSubmit() {
    if(this.academicSession == "undefined"){
      this.apis.showNotifications('error' , 'Please! Select session')
      return
    }
    var dataArray: any = []
    dataArray = { 'standard_id': this.id, 'academic_session_id':this.academicSession, 'std_fclty': this.dataArray }
    var icon: any
    var title: any
    this.submitStatus = true
      this.apis.storeFacilityStructure(dataArray).subscribe((response: any) => {
        if (response.success) {
          icon = 'success'
          title = 'Success'
          this.feesBoxStatus = false
          this.dataArray = []
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

  showSession(){
    this.apis.showAcademicSession().subscribe((response:any)=>{
      this.sessionList = response.response
      console.log(this.sessionList)
    })
  }
  onSetsession(value:any){
    this.academicSession = value
    if(this.layout == 'add'){
      this.showFacility()
      console.log('add')
    }
    else{
      this.showApplyFacility()
      console.log('add')

    }
  }
}
