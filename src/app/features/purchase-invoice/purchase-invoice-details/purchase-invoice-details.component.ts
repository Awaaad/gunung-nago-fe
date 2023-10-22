import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseInvoiceDetailsFrontDto } from 'generated-src/model-front';
import { FileApiService } from 'src/app/shared/apis/file.api.service';
import { PurchaseInvoiceApiService } from 'src/app/shared/apis/purchase-invoice.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-purchase-invoice-details',
  templateUrl: './purchase-invoice-details.component.html',
  styleUrls: ['./purchase-invoice-details.component.scss'],
})
export class PurchaseInvoiceDetailsComponent implements OnInit {
  public purchaseInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('purchaseInvoiceId');
  public type: any = this.activatedRoute.snapshot.paramMap.get('type');
  public language = "en";
  public purchaseInvoiceDetailsDto!: PurchaseInvoiceDetailsFrontDto;
  public totalQuantity: number = 0;
  public totalWholesalePrice: number = 0;
  public totalRetailPrice: number = 0;
  public totalBonusBoxesReceived: number = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fileApiService: FileApiService,
    private translateService: TranslateService,
    private purchaseInvoiceApiService: PurchaseInvoiceApiService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.initialisePurchaseInvoices();
    this.findPurchaseInvoiceDetailsById();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public generatePurchaseInvoicePdf(): void {
    this.fileApiService.generatePurchaseInvoicePdf(this.purchaseInvoiceId).subscribe(fileResponse => {
      this.utilsService.openTemplateInNewTab(fileResponse);
    })
  }

  public findPurchaseInvoiceDetailsById(): void {
    this.purchaseInvoiceApiService.findPurchaseInvoiceDetailsById(this.purchaseInvoiceId).subscribe(purchaseInvoiceDetailsDto => {
      this.purchaseInvoiceDetailsDto = purchaseInvoiceDetailsDto;
      this.totalQuantity = 0;
      this.totalWholesalePrice = 0;
      this.totalRetailPrice = 0;
      this.totalBonusBoxesReceived = 0;
      this.purchaseInvoiceDetailsDto?.purchaseDetailsDtos?.forEach(purchase => {
        this.totalQuantity = this.totalQuantity + purchase.quantity;
        this.totalWholesalePrice = this.totalWholesalePrice + purchase.wholesalePrice;
        this.totalRetailPrice = this.totalRetailPrice + purchase.price;
        this.totalBonusBoxesReceived = this.totalBonusBoxesReceived + purchase.bonus;
      })
    })
  }

  private initialisePurchaseInvoices(): void {
    this.purchaseInvoiceDetailsDto = {
      id: 0,
      number: null,
      supplierName: null,
      supplierAddress: null,
      supplierTelephoneNumber: null,
      supplierTelephoneNumberTwo: null,
      supplierTelephoneNumberThree: null,
      createdBy: null,
      createdDate: null,
      discount: null,
      totalPrice: null,
      comment: null,
      purchaseDetailsDtos: []
    }
  }
}
