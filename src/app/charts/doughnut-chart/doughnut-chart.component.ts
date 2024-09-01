import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})

export class DoughnutChartComponent {

  doughnutChartLabels: Label[] = ['L.K.G', 'U.K.G', 'Class 1' , 'Class 2' , 'Class 3'];
  doughnutChartData: MultiDataSet = [
    [0, 0, 0 , 0,0]
  ];
  doughnutChartType: ChartType = 'doughnut';
}