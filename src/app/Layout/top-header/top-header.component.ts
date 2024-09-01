import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {

  constructor() { }
  iconStatus:boolean = true
  ngOnInit(): void {
  }

  icon(value:any){
    this.iconStatus = value
  }
}
