import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerCreditStatementOfAccountDto, StatementOfAccountDto } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FileApiService {
    baseUrl = `${environment.apiPath}files`;

    constructor(private http: HttpClient) { }

    private setHeaders(): HttpHeaders {
        return new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        });
      }

    public generatePurchaseInvoicePdf(purchaseInvoiceId: number): Observable<any> {
        const headers = this.setHeaders();
        return this.http.get<any>(`${this.baseUrl}/purchase-invoice/${purchaseInvoiceId}`, { headers, responseType: 'blob' as 'json' });
    }

    public generateEggSaleInvoicePdf(salesInvoiceId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/egg-sale-invoice/${salesInvoiceId}`);
    }

    public generateSaleInvoicePdf(salesInvoiceId: number): Observable<any> {
        const headers = this.setHeaders();
        return this.http.get<any>(`${this.baseUrl}/sale-invoice/${salesInvoiceId}`, { headers, responseType: 'blob' as 'json' });
    }

    public generateReturnInvoicePdf(returnInvoiceId: number): Observable<any> {
        const headers = this.setHeaders();
        return this.http.get<any>(`${this.baseUrl}/return-invoice/${returnInvoiceId}`, { headers, responseType: 'blob' as 'json' });
    }

    public generateCreditStatementOfAccountPdf(customerCreditStatementOfAccountDto: CustomerCreditStatementOfAccountDto): Observable<any> {
        const headers = this.setHeaders();
        return this.http.post<any>(`${this.baseUrl}/credit-statement-of-account`, customerCreditStatementOfAccountDto, { headers, responseType: 'blob' as 'json' });
    }

    public generateStatementOfAccountPdf(customerStatementOfAccountDto: StatementOfAccountDto): Observable<any> {
        const headers = this.setHeaders();
        return this.http.post<any>(`${this.baseUrl}/statement-of-account`, customerStatementOfAccountDto, { headers, responseType: 'blob' as 'json' });
    }
}