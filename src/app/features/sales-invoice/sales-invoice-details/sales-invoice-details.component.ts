import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FlockSalesInvoiceDetailsDto, SalesInvoiceEggDetailsDto, SalesInvoiceType } from 'generated-src/model';
import { EggSalesInvoiceDetailsFrontDto, FlockSalesInvoiceDetailsFrontDto, ManureSalesInvoiceDetailsFrontDto } from 'generated-src/model-front';
import { FileApiService } from 'src/app/shared/apis/file.api.service';
import { ReceiptApiService } from 'src/app/shared/apis/receipt.api.service';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sales-invoice-details',
  templateUrl: './sales-invoice-details.component.html',
  styleUrls: ['./sales-invoice-details.component.scss'],
})
export class SalesInvoiceDetailsComponent implements OnInit {
  public salesInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('salesInvoiceId');
  public type: any = this.activatedRoute.snapshot.paramMap.get('type');
  public language = "en";
  public flockSalesInvoiceDetailsDto!: FlockSalesInvoiceDetailsFrontDto;
  public eggSalesInvoiceDetailsFrontDto!: EggSalesInvoiceDetailsFrontDto;
  public manureSalesInvoiceDetailsFrontDto!: ManureSalesInvoiceDetailsFrontDto;
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
    private receiptApiService: ReceiptApiService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.initialiseSalesInvoices();
    if (this.type === SalesInvoiceType.EGG) {
      this.findEggSalesInvoiceDetailsById();
    } else if (this.type === SalesInvoiceType.FLOCK) {
      this.findFlockSalesInvoiceDetailsById();
    } else if (this.type === SalesInvoiceType.MANURE) {
      this.findManureSalesInvoiceDetailsById();
    }

    // this.receiptApiService.findFlockReceiptDetailsById(this.salesInvoiceId).subscribe(data => {
    //   console.log(data);
    // })
  }

  public generateEggSaleInvoicePdf(): void {
    if (this.type === SalesInvoiceType.EGG) {
      this.fileApiService.generateEggSaleInvoicePdf(this.salesInvoiceId).subscribe(data => {
        console.log(data);
      })
    } else if (this.type === SalesInvoiceType.FLOCK) {
      this.fileApiService.generateFlockSaleInvoicePdf(this.salesInvoiceId).subscribe(fileResponse => {
        this.utilsService.openTemplateInNewTab(fileResponse);
      })
    }
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public findEggSalesInvoiceDetailsById(): void {
    this.salesInvoiceApiService.findEggSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(eggSalesInvoiceDetailsFrontDto => {
      this.eggSalesInvoiceDetailsFrontDto = eggSalesInvoiceDetailsFrontDto;
      this.eggSalesInvoiceDetailsFrontDto.salesInvoiceEggDetailsDtos?.forEach(salesInvoice => {
        this.totalPiece = this.totalPiece + (salesInvoice.bigGoodPiece + salesInvoice.mediumGoodPiece + salesInvoice.smallGoodPiece + salesInvoice.badPiece);
        this.totalTray = this.totalTray + (salesInvoice.bigGoodTray + salesInvoice.mediumGoodTray + salesInvoice.smallGoodTray + salesInvoice.badTray);
        this.totalTie = this.totalTie + (salesInvoice.bigGoodTie + salesInvoice.mediumGoodTie + salesInvoice.smallGoodTie + salesInvoice.badTie);
        this.totalEggs = salesInvoice.totalEggs;
        this.totalPricePiece = this.totalPricePiece + (salesInvoice.bigGoodPricePerPiece) + (salesInvoice.mediumGoodPricePerPiece) + (salesInvoice.smallGoodPricePerPiece) + (salesInvoice.badPricePerPiece);
        this.totalPriceTray = this.totalPriceTray + (salesInvoice.bigGoodPricePerTray) + (salesInvoice.mediumGoodPricePerTray) + (salesInvoice.smallGoodPricePerTray) + (salesInvoice.badPricePerTray);
        this.totalPriceTie = this.totalPriceTie + (salesInvoice.bigGoodPricePerTie) + (salesInvoice.mediumGoodPricePerTie) + (salesInvoice.smallGoodPricePerTie) + (salesInvoice.badPricePerTie);
        this.totalPrice = salesInvoice.totalPrice;
      })
    })
  }

  public findFlockSalesInvoiceDetailsById(): void {
    this.salesInvoiceApiService.findFlockSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(flockSalesInvoiceDetailsDto => {
      this.flockSalesInvoiceDetailsDto = flockSalesInvoiceDetailsDto;
      this.flockSalesInvoiceDetailsDto.salesInvoiceFlockDetailsDtos?.forEach(salesInvoice => {
        this.totalQuantityForGoodChicken = this.totalQuantityForGoodChicken + salesInvoice.quantityForGood;
        this.totalQuantityForSterileChicken = this.totalQuantityForSterileChicken + salesInvoice.quantityForSterile;
        this.totalPriceForGoodChicken = this.totalPriceForGoodChicken + salesInvoice.pricePerChickenForGood;
        this.totalPriceForSterileChicken = this.totalPriceForSterileChicken + salesInvoice.pricePerChickenForSterile;
      })
    })
  }

  public findManureSalesInvoiceDetailsById(): void {
    this.salesInvoiceApiService.findManureSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(manureSalesInvoiceDetailsDto => {
      this.manureSalesInvoiceDetailsFrontDto = manureSalesInvoiceDetailsDto;
      this.manureSalesInvoiceDetailsFrontDto.salesInvoiceManureDetailsDtos?.forEach(salesInvoice => {
        this.totalQuantityManure = this.totalQuantityManure + salesInvoice.quantity;
        this.totalPriceManure = this.totalPriceManure + salesInvoice.price;
      })
    })
  }

  public initialiseSalesInvoices(): void {
    this.flockSalesInvoiceDetailsDto = {
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
      salesInvoiceFlockDetailsDtos: []
    }

    this.eggSalesInvoiceDetailsFrontDto = {
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
      salesInvoiceEggDetailsDtos: []
    }

    this.manureSalesInvoiceDetailsFrontDto = {
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
      salesInvoiceManureDetailsDtos: []
    }
  }

  public calculateTotalBigEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return salesInvoiceEggDetailsDto.bigGoodPiece + (salesInvoiceEggDetailsDto.bigGoodTie * 300) + (salesInvoiceEggDetailsDto.bigGoodTray * 30);
  }

  public calculateTotalMediumEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return salesInvoiceEggDetailsDto.mediumGoodPiece + (salesInvoiceEggDetailsDto.mediumGoodTie * 300) + (salesInvoiceEggDetailsDto.mediumGoodTray * 30);
  }

  public calculateTotalSmallEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return salesInvoiceEggDetailsDto.smallGoodPiece + (salesInvoiceEggDetailsDto.smallGoodTie * 300) + (salesInvoiceEggDetailsDto.smallGoodTray * 30);
  }

  public calculateTotalBadEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return salesInvoiceEggDetailsDto.badPiece + (salesInvoiceEggDetailsDto.badTie * 300) + (salesInvoiceEggDetailsDto.badTray * 30);
  }

  public calculateTotalPriceBigEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return (salesInvoiceEggDetailsDto.bigGoodPiece * salesInvoiceEggDetailsDto.bigGoodPricePerPiece) + (salesInvoiceEggDetailsDto.bigGoodTray * salesInvoiceEggDetailsDto.bigGoodPricePerTray) + (salesInvoiceEggDetailsDto.bigGoodTie * salesInvoiceEggDetailsDto.bigGoodPricePerTie);
  }

  public calculateTotalPriceMediumEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return (salesInvoiceEggDetailsDto.mediumGoodPiece * salesInvoiceEggDetailsDto.mediumGoodPricePerPiece) + (salesInvoiceEggDetailsDto.mediumGoodTray * salesInvoiceEggDetailsDto.mediumGoodPricePerTray) + (salesInvoiceEggDetailsDto.mediumGoodTie * salesInvoiceEggDetailsDto.mediumGoodPricePerTie);
  }

  public calculateTotalPriceSmallEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return (salesInvoiceEggDetailsDto.smallGoodPiece * salesInvoiceEggDetailsDto.smallGoodPricePerPiece) + (salesInvoiceEggDetailsDto.smallGoodTray * salesInvoiceEggDetailsDto.smallGoodPricePerTray) + (salesInvoiceEggDetailsDto.smallGoodTie * salesInvoiceEggDetailsDto.smallGoodPricePerTie);
  }

  public calculateTotalPriceBadEggs(salesInvoiceEggDetailsDto: SalesInvoiceEggDetailsDto): number {
    return (salesInvoiceEggDetailsDto.badPiece * salesInvoiceEggDetailsDto.badPricePerPiece) + (salesInvoiceEggDetailsDto.badTray * salesInvoiceEggDetailsDto.badPricePerTray) + (salesInvoiceEggDetailsDto.badTie * salesInvoiceEggDetailsDto.badPricePerTie);
  }
}
