import { Component, OnInit, } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MasterAPIsServicesService } from 'src/app/apis/master-apis-services.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements OnInit {

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Fees Collect' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'lightseagreen',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType:any = 'line';
  constructor(private apis:MasterAPIsServicesService) { }
  
  ngOnInit(): void {
    if(localStorage.getItem('sub_host') != null){
      this.showFessLineChart()
    }
  }
  refreshData() {
    this.lineChartData[0].data = [0, 0, 0, 0, 0, 0, 0]
 }

 showFessLineChart(){
  this.apis.showDashboardDaily().subscribe((response:any)=>{
    console.log(response)
    if(response.success){
      this.lineChartLabels = response.response.data.label
      this.lineChartData[0].data = response.response.data.value
    }
  })
}
  
}