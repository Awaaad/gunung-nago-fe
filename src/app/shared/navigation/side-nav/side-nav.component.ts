import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent  implements OnInit {
  public flock = 'assets/flaticon/chicken-icon.svg';
  public survey = 'assets/flaticon/survey-icon.svg';
  public supplier = 'assets/flaticon/supplier-icon.svg';
  public feed = 'assets/flaticon/feed-icon.svg';
  public cage = 'assets/flaticon/cage-icon.svg';
  public salesInvoice = 'assets/flaticon/sales-invoice-icon.svg';
  public purchaseInvoice = 'assets/flaticon/purchase-invoice-icon.svg';
  public stock = 'assets/flaticon/stock-icon.svg';
  public purchase = 'assets/flaticon/purchase-icon.svg';
  public manure = 'assets/flaticon/manure-icon.svg';
  public egg = 'assets/flaticon/egg-icon.svg';
  public eggTransfer = 'assets/flaticon/egg-transfer-icon.svg';
  public pos = 'assets/flaticon/point-of-sale-icon.svg';
  public transfer = 'assets/flaticon/transfer-icon.svg';
  public customer = 'assets/flaticon/customer-icon.svg';
  public bankAccount = 'assets/flaticon/bank-account.svg';
  public returnInvoice = 'assets/flaticon/return-invoice-icon.svg';
  public salesRecord = 'assets/flaticon/record-icon.svg';
  public dailyReport = 'assets/flaticon/daily-report-icon.svg';
  public healthProducts = 'assets/flaticon/health-products-icon.svg';
  public sales = 'assets/flaticon/sales-icon.svg';
  public paymentMode = 'assets/flaticon/payment-mode-icon.svg';
  public users = 'assets/flaticon/users-icon.svg';
  public feedAllocation = 'assets/flaticon/feed-allocation-icon.svg';
  public eggReport = 'assets/flaticon/egg-report-icon.svg';
  public list = 'assets/flaticon/list-icon.svg';
  public add = 'assets/flaticon/add-icon.svg';
  public dashboard = 'assets/flaticon/dashboard-icon.svg';

  constructor() { }

  ngOnInit() {}

}
