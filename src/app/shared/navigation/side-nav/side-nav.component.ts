import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent  implements OnInit {
  public flock = 'assets/flaticon/chicken-icon.svg';
  public supplier = 'assets/flaticon/supplier-icon.svg';
  public feed = 'assets/flaticon/feed-icon.svg';
  public cage = 'assets/flaticon/cage-icon.svg';
  public salesInvoice = 'assets/flaticon/sales-invoice-icon.svg';
  public stock = 'assets/flaticon/stock-icon.svg';
  public manure = 'assets/flaticon/manure-icon.svg';
  public egg = 'assets/flaticon/egg-icon.svg';
  constructor() { }

  ngOnInit() {}

}
