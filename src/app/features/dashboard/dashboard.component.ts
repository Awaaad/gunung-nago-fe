import { Component, OnInit } from '@angular/core';
import { FlocksCategoryDto, SalesInvoicePerMonthDto, TodayAndCurrentMonthPaymentDto, TodayAndCurrentMonthProfitDto, TodayAndCurrentMonthPurchaseDto, TotalEggsAndPercentageChangeDto, TotalFlocksAndPercentageChangeDto } from 'generated-src/model';
import { Chart, registerables } from 'node_modules/chart.js';
import { Observable } from 'rxjs';
import { EggStockApiService } from 'src/app/shared/apis/egg-stock.api.service';
import { FlockApiService } from 'src/app/shared/apis/flock.api.service';
import { PaymentApiService } from 'src/app/shared/apis/payment.api.service';
import { PurchaseInvoiceApiService } from 'src/app/shared/apis/purchase-invoice.api.service';
import { PurchaseApiService } from 'src/app/shared/apis/purchase.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent  implements OnInit {
  public totalSales = './assets/dashboard-icon/total-sales.png';
  public totalPurchases = './assets/dashboard-icon/total-purchases.png';
  public totalProfit = './assets/dashboard-icon/total-profit.png';
  public totalFlocks = './assets/dashboard-icon/total-flocks.png';
  public totalEggs = './assets/dashboard-icon/total-eggs.png';
  public totalFeeds = './assets/dashboard-icon/total-feeds.png';
  public totalManure = './assets/dashboard-icon/total-manure.png';
  public totalCredit = './assets/dashboard-icon/total-credit.png';

  public todayAndCurrentMonthTotalSales: TodayAndCurrentMonthPaymentDto | undefined;
  public todayAndCurrentMonthTotalPurchases: TodayAndCurrentMonthPurchaseDto | undefined;
  public todayAndCurrentMonthTotalprofit: TodayAndCurrentMonthProfitDto | undefined;
  public totalFlocksAndPercentageChange: TotalFlocksAndPercentageChangeDto | undefined;
  public totalGoodEggsAndPercentageChange: TotalEggsAndPercentageChangeDto | undefined;
  public flocksPerCategory: FlocksCategoryDto | undefined;
  public totalSalesPerMonth: SalesInvoicePerMonthDto | undefined;

  public chart: any;

  constructor(
              private readonly paymentApiService: PaymentApiService,
              private readonly purchaseInvoiceApiService: PurchaseInvoiceApiService,
              private readonly salesApiService: SalesInvoiceApiService,
              private readonly flocksApiService: FlockApiService,
              private readonly eggsApiService: EggStockApiService
              ) { }

  ngOnInit() {
    this.getTodayAndCurrentMonthSalesAmount();
    this.getTodayAndCurrentMonthPurchaseAmount();
    this.getTodayAndCurrentMonthProfitAmount();
    this.getTotalFlocksAndPercentageChange();
    this.getTotalGoodEggsAndPercentageChange();
    this.createDoughnutChartForFlockCategory();
    this.createChart();
  }

  createDoughnutChartForFlockCategory(){
    this.getFlocksPerCategory().subscribe((data) => {
      
      this.flocksPerCategory = data;
      this.chart = new Chart("MyChart", {
        type: 'doughnut', //this denotes the type of chart
  
        data: {// values on X-Axis
          labels: ['DOC', 'DARA','NORM'],
          datasets: [{
          label: 'Quantity',
          data: [this.flocksPerCategory?.doc, this.flocksPerCategory?.dara, this.flocksPerCategory?.norm],
          backgroundColor: [
            'brown',
            'blue',
            'green'	
          ],
          hoverOffset: 4
          }],
          },
          options: {
            aspectRatio:2.5
          }
      });
    });
    
  }

  createChart(){
    this.getTotalSalesPerMonth().subscribe((data)=>{
      this.totalSalesPerMonth = data;
      this.chart = new Chart("MyLineChart", {
        type: 'line', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Sep', 'Oct', 'Nov', 'Dec'], 
           datasets: [
            {
              label: "Sales",
              data: [this.totalSalesPerMonth?.jan, this.totalSalesPerMonth?.feb, this.totalSalesPerMonth?.mar, this.totalSalesPerMonth?.apr,
                    this.totalSalesPerMonth?.may, this.totalSalesPerMonth?.jun, this.totalSalesPerMonth?.jul, this.totalSalesPerMonth?.aug, this.totalSalesPerMonth?.sep,
                    this.totalSalesPerMonth?.oct, this.totalSalesPerMonth?.nov, this.totalSalesPerMonth?.dec
                    ],
              backgroundColor: 'blue'
            },
            // {
            //   label: "Profit",
            //   data: ['542', '542', '536', '327', '17',
            // 				 '0.00', '538', '541'],
            //   backgroundColor: 'limegreen'
            // }  
          ]
        },
        options: {
          aspectRatio:2.5
        }
      });
    })
    
  }


  navigateToSalesInvoiceList(){
    return null;
  }

  private getTodayAndCurrentMonthSalesAmount(): void {
    this.paymentApiService.getTodayAndMonthSales().subscribe((data) => {
      this.todayAndCurrentMonthTotalSales = data;
    });
  }

  private getTodayAndCurrentMonthPurchaseAmount(): void {
    this.purchaseInvoiceApiService.getTodayAndCurrentMonthPurchaseAmount().subscribe((data) => {
      this.todayAndCurrentMonthTotalPurchases = data;
    });
  }

  private getTodayAndCurrentMonthProfitAmount(): void {
    this.salesApiService.findTodayAndCurrentMonthProfit().subscribe((data) => {
      this.todayAndCurrentMonthTotalprofit = data;
    });
  }

  private getTotalFlocksAndPercentageChange(): void {
    this.flocksApiService.getTotalFlocksAndPercentageChange().subscribe((data) => {
      this.totalFlocksAndPercentageChange = data;
    });
  }

  private getTotalGoodEggsAndPercentageChange(): void {
    this.eggsApiService.findTotalGoodEggs().subscribe((data) => {
      this.totalGoodEggsAndPercentageChange = data;
    });
  }

  private getFlocksPerCategory(): Observable<FlocksCategoryDto> {
    return this.flocksApiService.getTotalFlocksPerCategory()
  }

  private getTotalSalesPerMonth(): Observable<SalesInvoicePerMonthDto> {
    return this.salesApiService.findTotalSalesPerMonth();
  }

}
