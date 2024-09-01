import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label , Color } from 'ng2-charts';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent implements OnInit {

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'lightseagreen',
    },
  ];

  barChartData: ChartDataSets[] = [
    { data: [], label: 'Student Count' }
  ];

  constructor(private apis:MasterAPIsServicesService) { }
  duration: number = 1000;
  steps:any; 
  
  ngOnInit(): void {
    if(localStorage.getItem('sub_host') != null){
      this.showDashboardClassList()
    }
  }



  showDashboardClassList(){
    this.apis.showDashboardClassList().subscribe((response:any)=>{
      if(response.success){
        this.barChartLabels = response.response.data.label
        this.barChartData[0].data = response.response.data.value
      }
    })
  }

}