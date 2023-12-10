import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReturnDetailsFrontDto, ReturnInvoiceFrontDto } from 'generated-src/model-front';
import { ReturnApiService } from 'src/app/shared/apis/return.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-return-invoice-details',
  templateUrl: './return-invoice-details.component.html',
  styleUrls: ['./return-invoice-details.component.scss'],
})
export class ReturnInvoiceDetailsComponent  implements OnInit {

  public returnInvoiceId: any = this.activatedRoute.snapshot.paramMap.get('id');
  public returnInvoiceFront! : ReturnDetailsFrontDto; 
  public language = "en";
  public totalPrice: number = 0;
  public company = environment.company;
  public address = environment.address;
  public phone = environment.phone;
  public email = environment.email;
  public regNo = environment.regNo;
  public yoe = environment.yoe;

  constructor( private returnApiService: ReturnApiService,
    private readonly activatedRoute: ActivatedRoute,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.initialiseReturnInvoices();
    this.populateReturnInvoiceDetails();
  }

  public ionChangeLanguage(event: any): void {
    this.translateService.use(event.detail.value);
  }

  public populateReturnInvoiceDetails(): void{
    this.returnApiService.findReturnInvoiceDetailsById(this.returnInvoiceId).subscribe((res:any)=>{
      this.returnInvoiceFront = res;
      this.totalPrice = this.returnInvoiceFront.totalPrice;
      console.log(this.returnInvoiceFront);
    })
  }

  public initialiseReturnInvoices(): void {
    this.returnInvoiceFront = {
      id:  null,
      createdBy: null,
      createdDate: null,
      customerFirstName:null,
      customerLastName: null,
      customerAddress: null,
      customerTelephoneNumber:null,
      driverFirstName: null,
      driverLastName: null,
      comment: null,
      totalPrice: null,
      returnDetailsDtos: [] 
    }
  }

}
