import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { MasterAPIsServicesService } from '../apis/master-apis-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb:FormBuilder , private router:Router , private apis:MasterAPIsServicesService) { }
 
  loginForm:FormGroup=this.fb.group({
    school_code:[''],
    username:[''], 
    password:['']
  })
  submitStatus:any=false
  deployOnNps:boolean
  school_code_status:boolean = false
  deployOnAdmin:boolean =this.apis.deployOnAdmin 
  schoolCodeDetails:any = []
 
  ngOnInit(): void {
    localStorage.clear();
    this.deployOnNps =  this.apis.deployOnNPS
  }  

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



  loginUsername(){
    var el_e = (document.getElementById('email') as HTMLElement);
    var el_p = (document.getElementById('password') as HTMLElement);
    el_e.classList.add('left-470');
    el_e.classList.remove("left_e");

    el_p.classList.remove('left470');
    el_p.classList.add("left_p");
    console.log(this.loginForm)
    localStorage.setItem('username' , this.loginForm.value.username)
  }


  back(){
    var el_e = (document.getElementById('email') as HTMLElement);
    var el_p = (document.getElementById('password') as HTMLElement);
    el_e.classList.remove('left-470');
    el_e.classList.add("left_e");

    el_p.classList.add('left470')
    el_p.classList.remove("left_p");
    console.log(this.loginForm)
    localStorage.setItem('username' , this.loginForm.value.username)
  }

  submit(){
  this.submitStatus = true
  var subHost:any = null
  if(this.deployOnAdmin){
    subHost = this.schoolCodeDetails.data.sub_host
  }
  this.apis.loginFunction(this.loginForm.value , subHost).subscribe((response:any)=>{
    console.log(response)

    if(response.success){
      localStorage.setItem('printingType' , 'A4')
      if(this.deployOnAdmin){
        localStorage.setItem('token' , response.response.data.token)
        localStorage.setItem('sub_host', response.response.data.school.sub_host);
        localStorage.setItem('school_name', response.response.data.school.name);
        localStorage.setItem('school_code', response.response.data.school.code);
        localStorage.setItem('school_id', response.response.data.school.id);
        localStorage.setItem('uuid', response.response.data.school.uuid);
        localStorage.setItem('base_url', response.response.data.school.base_url);
        localStorage.setItem('logo', response.response.data.school.logo);
      localStorage.setItem('user_type' , response.response.data.user_type)

      if(response.response.data.user_type == 'Staff'){
        var permits:any = []
        for (let i = 0; i < response.response.data.user.roles.length; i++) {
          const element = response.response.data.user.roles[i];
        console.log(element)

          for (let index = 0; index < element.permits.length; index++) {
            const el = element.permits[index];
            permits.push(el)
          }
          
        }
        localStorage.setItem('permits',JSON.stringify(permits));
      }

      }else{
        localStorage.setItem('s_token' , response.response.data.token)
      localStorage.setItem('user_type' , response.response.data.user_type)
      }
      
      this.apis.showNotifications('success' , response.message)
      this.router.navigateByUrl('dashboard')  
      window.location.reload()
    }else{
      this.apis.showNotifications('error' , response.message)
    }
  })
   
  }

  showSubHost(school_code:any){
    this.apis.showSubHost(school_code).subscribe((response:any)=>{
      console.log(response)
      if(response.success){
        this.school_code_status = true
        this.schoolCodeDetails = response.response
        this.apis.showNotifications('success' , response.message)
      }
      else{
        this.apis.showNotifications('error' , response.message)
      }
    })
  }



}
