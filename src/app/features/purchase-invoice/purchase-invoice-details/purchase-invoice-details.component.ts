import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseInvoiceType } from 'generated-src/model';
import { FeedPurchaseInvoiceDetailsFrontDto, FlockPurchaseInvoiceDetailsFrontDto, HealthPurchaseInvoiceDetailsFrontDto } from 'generated-src/model-front';
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
  public healthPurchaseInvoiceDetailsDto!: HealthPurchaseInvoiceDetailsFrontDto;
  public feedPurchaseInvoiceDetailsDto!: FeedPurchaseInvoiceDetailsFrontDto;
  public flockPurchaseInvoiceDetailsDto!: FlockPurchaseInvoiceDetailsFrontDto;
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
    if (this.type === PurchaseInvoiceType.HEALTH_PRODUCT) {
      this.findHealthPurchaseInvoiceDetailsById();
    } else if (this.type === PurchaseInvoiceType.FEED) {
      this.findFeedPurchaseInvoiceDetailsById();
    } else if (this.type === PurchaseInvoiceType.FLOCK) {
      this.findFlockPurchaseInvoiceDetailsById();
    }
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public generatePurchaseInvoicePdf(): void {
    this.fileApiService.generatePurchaseInvoicePdf(this.purchaseInvoiceId).subscribe(fileResponse => {
      this.utilsService.openTemplateInNewTab(fileResponse);
    })
  }

  public findHealthPurchaseInvoiceDetailsById(): void {
    this.purchaseInvoiceApiService.findHealthPurchaseInvoiceDetailsById(this.purchaseInvoiceId).subscribe(purchaseInvoiceDetailsDto => {
      this.healthPurchaseInvoiceDetailsDto = purchaseInvoiceDetailsDto;
      this.totalQuantity = 0;
      this.totalWholesalePrice = 0;
      this.totalRetailPrice = 0;
      this.totalBonusBoxesReceived = 0;
      this.healthPurchaseInvoiceDetailsDto?.purchaseInvoiceHealthProductDetailsDtos?.forEach(healthProduct => {
        this.totalQuantity = this.totalQuantity + healthProduct.boxesReceived;
        this.totalWholesalePrice = this.totalWholesalePrice + healthProduct.wholesalePrice;
        this.totalRetailPrice = this.totalRetailPrice + healthProduct.pricePerBox;
        this.totalBonusBoxesReceived = this.totalBonusBoxesReceived + healthProduct.bonusBoxesReceived;
      })
    })
  }

  public findFeedPurchaseInvoiceDetailsById(): void {
    this.purchaseInvoiceApiService.findFeedPurchaseInvoiceDetailsById(this.purchaseInvoiceId).subscribe(purchaseInvoiceDetailsDto => {
      this.feedPurchaseInvoiceDetailsDto = purchaseInvoiceDetailsDto;
      this.totalQuantity = 0;
      this.totalWholesalePrice = 0;
      this.totalRetailPrice = 0;
      this.totalBonusBoxesReceived = 0;
      this.feedPurchaseInvoiceDetailsDto?.purchaseInvoiceFeedDetailsDtos?.forEach(feed => {
        this.totalQuantity = this.totalQuantity + feed.boxesReceived;
        this.totalWholesalePrice = this.totalWholesalePrice + feed.wholesalePrice;
        this.totalRetailPrice = this.totalRetailPrice + feed.pricePerBox;
        this.totalBonusBoxesReceived = this.totalBonusBoxesReceived + feed.bonusBoxesReceived;
      })
    })
  }

  public findFlockPurchaseInvoiceDetailsById(): void {
    this.purchaseInvoiceApiService.findFlockPurchaseInvoiceDetailsById(this.purchaseInvoiceId).subscribe(purchaseInvoiceDetailsDto => {
      this.flockPurchaseInvoiceDetailsDto = purchaseInvoiceDetailsDto;
      this.totalQuantity = 0;
      this.totalWholesalePrice = 0;
      this.totalRetailPrice = 0;
      this.totalBonusBoxesReceived = 0;
      this.flockPurchaseInvoiceDetailsDto?.purchaseInvoiceFlockDetailsDtos?.forEach(flock => {
        this.totalQuantity = this.totalQuantity + flock.boxesReceived;
        this.totalWholesalePrice = this.totalWholesalePrice + flock.wholesalePrice;
        this.totalRetailPrice = this.totalRetailPrice + flock.pricePerBox;
        this.totalBonusBoxesReceived = this.totalBonusBoxesReceived + flock.bonusBoxesReceived;
      })
    })
  }

  private initialisePurchaseInvoices(): void {
    this.healthPurchaseInvoiceDetailsDto = {
      id: 0,
      number: null,
      supplierName: null,
      supplierAddress: null,
      supplierTelephoneNumber: null,
      supplierTelephoneNumberTwo: null,
      supplierTelephoneNumberThree: null,
      createdBy: null,
      createdDate: null,
      purchaseInvoiceType: null,
      discount: null,
      totalPrice: null,
      comment: null,
      purchaseInvoiceHealthProductDetailsDtos: []
    }

    this.feedPurchaseInvoiceDetailsDto = {
      id: 0,
      number: null,
      supplierName: null,
      supplierAddress: null,
      supplierTelephoneNumber: null,
      supplierTelephoneNumberTwo: null,
      supplierTelephoneNumberThree: null,
      createdBy: null,
      createdDate: null,
      purchaseInvoiceType: null,
      discount: null,
      totalPrice: null,
      comment: null,
      purchaseInvoiceFeedDetailsDtos: []
    }

    this.flockPurchaseInvoiceDetailsDto = {
      id: 0,
      number: null,
      supplierName: null,
      supplierAddress: null,
      supplierTelephoneNumber: null,
      supplierTelephoneNumberTwo: null,
      supplierTelephoneNumberThree: null,
      createdBy: null,
      createdDate: null,
      purchaseInvoiceType: null,
      discount: null,
      totalPrice: null,
      comment: null,
      purchaseInvoiceFlockDetailsDtos: []
    }
  }
}
