import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ERP';
  loginStatus:boolean = false
  constructor(private router:Router , private route:ActivatedRoute){
    if(localStorage.getItem('user_type') == 'SuperAdmin' || localStorage.getItem('user_type') == 'Admin' || localStorage.getItem('user_type') == 'Staff' ){
        this.loginStatus = true      
    } 
  }
}
