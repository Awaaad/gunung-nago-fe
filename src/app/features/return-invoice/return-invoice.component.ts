import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SaleDetailsDto, SalesInvoiceDto } from 'generated-src/model';
import { SalesInvoiceDetailsFrontDto } from 'generated-src/model-front';
import { SalesInvoiceApiService } from 'src/app/shared/apis/sales-invoice.api.service';

@Component({
  selector: 'app-return-invoice',
  templateUrl: './return-invoice.component.html',
  styleUrls: ['./return-invoice.component.scss'],
})
export class ReturnInvoiceComponent  implements OnInit {
  public salesDetailsTable = new MatTableDataSource<SalesInvoiceDto>;
  public salesDetails: SaleDetailsDto[] = [];
  public salesInvoiceDetailsFrontDto!: SalesInvoiceDetailsFrontDto;
  public language = "en";
  public salesInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(private formBuilder: FormBuilder,
    private salesInvoiceApiService: SalesInvoiceApiService,
    private readonly activatedRoute: ActivatedRoute,
    private translateService: TranslateService) { }

  ngOnInit() {
    if (this.salesInvoiceId != null){
      this.findSalesInvoiceDetailsById()
      
      
    }
  }

  public findSalesInvoiceDetailsById() {
      this.salesInvoiceApiService.findSalesInvoiceDetailsById(this.salesInvoiceId).subscribe(res=>{
      this.salesInvoiceDetailsFrontDto = res;
      console.log(this.salesInvoiceDetailsFrontDto);
    })
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }
}
