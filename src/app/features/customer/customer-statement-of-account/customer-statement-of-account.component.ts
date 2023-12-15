import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SalesInvoiceDetailsFrontDto } from 'generated-src/model-front';
import { FileApiService } from 'src/app/shared/apis/file.api.service';
import { ReceiptApiService } from 'src/app/shared/apis/receipt.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-statement-of-account',
  templateUrl: './customer-statement-of-account.component.html',
  styleUrls: ['./customer-statement-of-account.component.scss'],
})
export class CustomerStatementOfAccountComponent implements OnInit {
  public salesInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('salesInvoiceId');
  public language = "en";
  public salesInvoiceDetailsFrontDto!: SalesInvoiceDetailsFrontDto;
  public totalPiece: number = 0;
  public totalTray: number = 0;
  public totalTie: number = 0;
  public totalEggs: number = 0
  public totalPricePiece: number = 0;
  public totalPriceTray: number = 0;
  public totalPriceTie: number = 0;
  public totalPrice: number = 0;
  public totalQuantityForGoodChicken: number = 0;
  public totalQuantityForSterileChicken: number = 0;
  public totalPriceForGoodChicken: number = 0;
  public totalPriceForSterileChicken: number = 0;
  public totalQuantityManure: number = 0;
  public totalPriceManure: number = 0;
  public company = environment.company;
  public address = environment.address;
  public phone = environment.phone;
  public email = environment.email;
  public regNo = environment.regNo;
  public yoe = environment.yoe;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fileApiService: FileApiService,
    private salesInvoiceApiService: SalesInvoiceApiService,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.initialiseSalesInvoices();
    this.findSalesInvoiceDetailsById();
  }

  public generateSaleInvoicePdf(): void {
    this.fileApiService.generateSaleInvoicePdf(this.salesInvoiceId).subscribe(fileResponse => {
      this.utilsService.openTemplateInNewTab(fileResponse);
    })
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public findSalesInvoiceDetailsById(): void {
    this.salesInvoiceApiService.findSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(salesInvoiceDetailsFrontDto => {
      this.salesInvoiceDetailsFrontDto = salesInvoiceDetailsFrontDto;
      this.totalPrice = salesInvoiceDetailsFrontDto.totalPrice;
    })
  }

  public initialiseSalesInvoices(): void {
    this.salesInvoiceDetailsFrontDto = {
      id: null,
      receiptId: null,
      salesInvoiceType: null,
      totalPrice: null,
      soldAt: null,
      createdBy: null,
      createdDate: null,
      customerFirstName: null,
      customerLastName: null,
      customerAddress: null,
      customerTelephoneNumber: null,
      driverFirstName: null,
      driverLastName: null,
      salesPerson: null,
      salesInvoiceCategory: null,
      salesInvoiceStatus: null,
      comment: null,
      saleDetailsDtos: []
    }
  }
}
