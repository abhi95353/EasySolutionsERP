import { Component, OnInit } from '@angular/core';
import { ComponentsServicesService } from '../../components-services.service';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create-classes',
  templateUrl: './create-classes.component.html',
  styleUrls: ['./create-classes.component.css']
})
export class CreateClassesComponent implements OnInit {

  constructor(private cs:ComponentsServicesService , private apis:MasterAPIsServicesService , private fb:FormBuilder) { }
  classesBoxStatus:boolean = false;
  classesBoxStatusEdit:boolean = false;
  submitStatus:boolean = false
  title:any
  schoolData:any
  id:any
  uuid:any
  classForm = this.fb.group({
    class : [''],
    school_code : [localStorage.getItem('school_name')],
    div_count : ['']
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

  ngOnInit(): void { 
    this.cs.classesBox$.subscribe((response:any)=>{
      console.log(response)
      this.classForm.reset()
      this.title = response.layout
      this.classesBoxStatus = response.value
      this.id =response.id
      this.uuid =response.uuid
        if(response.layout == 'edit'){
        this.classesBoxStatusEdit = response.value
        if(response.id != null){
            this.showSelectiveClass(response.id)
          }
        }
    })
  }



  addSubmit(){
    var icon:any
    var title : any
    this.submitStatus = true
    if(this.title == 'add'){
      this.apis.createClass(this.classForm.value).subscribe((response:any)=>{
        if (response.success) {
          icon = 'success'
          title = 'Success'
          this.cs.setClassesBox(false)
          this.cs.refreshClasses(true)
  
        } else {
          icon = 'error'
          title = 'Error'
        }
        this.submitStatus = false
        this.classForm.reset()
  
        this.Toast.fire({
          icon: icon,
          title: title
        })
      })
    }

    if(this.title == 'edit'){
      this.apis.updateClass(this.id , this.classForm.value).subscribe((response:any)=>{
      console.log(response)

        if (response.success) {
          icon = 'success'
          title = 'Success'
          this.cs.setClassesBox(false)
          this.cs.refreshClasses(true)
  
        } else {
          icon = 'error'
          title = 'Error'
        }
        this.submitStatus = false
        this.classForm.reset()
  
        this.Toast.fire({
          icon: icon,
          title: title
        })
      })
    }
    
  }

 
  onClickClassesBox(value:any , layout:any ,id:any){
    var data:any
    data = {'value' : value , 'layout':layout , 'id':id}
    this.cs.setClassesBox(data)
  }

  showSelectiveClass(id:any){
    this.apis.showSelectiveClass(id , this.uuid).subscribe((response:any)=>{
      this.classForm.setValue({
        class : response.response.class,
        school_code : localStorage.getItem('school_name'),
        div_count : response.response.div_count
      })
    })
  }
}
