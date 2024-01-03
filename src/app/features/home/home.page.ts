import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartData, ChartType, Color } from 'chart.js';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { size } from 'lodash';
import { baseColors } from 'ng2-charts';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public currentDate = new Date;
  public darkBlue = "#1B1464";
  public darkBlueGreen = "#216168";
  public darkGreen = "#008413";
  public darkYellow = "#F79F1F";
  public darkYellowGreen = "#7b8145";
  public darkRed = "#e84118";
  public darkPurple = "#6F1E51";
  public language = "en";
  public doughnutChartType: ChartType = 'doughnut';
  public lineChartType: ChartType = 'line';
  public barChartType: ChartType = 'bar';
  public monthsLabel: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  public doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  constructor(
    private translateService: TranslateService
  ) { }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public doughnutChartData: ChartData<'doughnut'> = {
    // labels: this.doughnutChartLabels,
    datasets: [
      // {
      //   backgroundColor: [
      //     this.darkGreen,
      //     this.darkBlue,
      //     this.darkYellow,
      //   ],
      //   data: [350, 450, 100],
      // },
      {
        label: "Big",
        backgroundColor: this.darkYellow,
        data: [65, 16, 80, 81, 56, 12, 40],
      },
      {
        label: "Medium",
        backgroundColor: this.darkYellow,
        data: [23, 67, 34, 81, 12, 87, 12],
      },
      {
        label: "Small",
        backgroundColor: this.darkYellow,
        data: [63, 59, 45, 81, 53, 31, 76],
      }
    ],
  };

  public lineChartData: ChartData<'line'> = {
    labels: this.monthsLabel,
    datasets: [
      {
        label: "Purchase Amount (IDR)",
        backgroundColor: 'rgb(247, 159, 31, 0.001)',
        borderColor: this.darkYellow,
        pointBackgroundColor: 'rgb(247, 159, 31, 0.001)',
        pointBorderColor: 'rgb(247, 159, 31, 1)',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(247, 159, 31, 1)',
        data: [350, 450, 100, 93, 50, 12, 455, 13, 95],
      },
      {
        label: "Sales Amount (IDR)",
        backgroundColor: 'rgb(6, 140, 56, 0.001)',
        borderColor: this.darkGreen,
        pointBackgroundColor: 'rgb(6, 140, 56, 0.001)',
        pointBorderColor: 'rgb(6, 140, 56, 1)',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(6, 140, 56, 1)',
        fill: 'origin',
        data: [899, 650, 400, 193, 100, 12, 400, 130, 495],
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.3,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Sales To Purchase Amount`,
        font: {
          size: 15,
          style: "normal",
          weight: 300,
        }
      },
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: this.monthsLabel,
    datasets: [
      {
        label: "Amount (IDR)",
        backgroundColor: this.darkGreen,
        data: [65, 59, 80, 81, 56, 55, 40],
      }
    ],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Sales`,
        font: {
          size: 15,
          style: "normal",
          weight: 300,
        }
      },
    },
  };

  public eggProductionBarChartData: ChartData<'bar'> = {
    labels: this.monthsLabel,
    datasets: [
      {
        label: "Big",
        backgroundColor: this.darkYellow,
        data: [65, 16, 80, 71, 56, 12, 40],
      },
      {
        label: "Medium",
        backgroundColor: this.darkYellow,
        data: [23, 67, 34, 87, 12, 87, 12],
      },
      {
        label: "Small",
        backgroundColor: this.darkYellow,
        data: [63, 59, 45, 41, 53, 31, 76],
      }
    ],
  };

  public eggProductionBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Egg Production`,
        font: {
          size: 15,
          style: "normal",
          weight: 300,
        }
      },
    },
  };

  public eggSalesBarChartData: ChartData<'bar'> = {
    labels: this.monthsLabel,
    datasets: [
      {
        label: "Big",
        backgroundColor: this.darkGreen,
        data: [65, 16, 80, 61, 56, 12, 40],
      },
      {
        label: "Medium",
        backgroundColor: this.darkGreen,
        data: [23, 67, 34, 81, 12, 87, 12],
      },
      {
        label: "Small",
        backgroundColor: this.darkGreen,
        data: [63, 59, 45, 41, 53, 31, 76],
      }
    ],
  };

  public eggSalesBarChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Egg Sales`,
        font: {
          size: 15,
          style: "normal",
          weight: 300,
        }
      },
    },
  };

  public flockSurveyBarChartData: ChartData<'bar'> = {
    labels: this.monthsLabel,
    datasets: [
      {
        label: "Dead",
        backgroundColor: this.darkRed,
        data: [65, 16, 80, 71, 56, 12, 40],
      },
      {
        label: "Sterile",
        backgroundColor: this.darkYellow,
        data: [23, 67, 34, 87, 12, 87, 12],
      },
      {
        label: "Good",
        backgroundColor: this.darkGreen,
        data: [63, 59, 45, 41, 53, 31, 76],
      }
    ],
  };

  public flockSurveyBarChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Chicken Survey`,
        font: {
          size: 15,
          style: "normal",
          weight: 300,
        }
      },
    },
  };

  public flockSalesBarChartData: ChartData<'bar'> = {
    labels: this.monthsLabel,
    datasets: [
      {
        label: "Sterile",
        backgroundColor: this.darkYellow,
        data: [23, 67, 34, 87, 12, 87, 12],
      },
      {
        label: "Good",
        backgroundColor: this.darkGreen,
        data: [63, 59, 45, 41, 53, 31, 76],
      }
    ],
  };

  public flockSalesBarChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Chicken Sales`,
        font: {
          size: 15,
          style: "normal",
          weight: 300,
        }
      },
    },
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
  }
}
