import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class PaymentApiService {
    baseUrl = `${environment.apiPath}payments/`;

    constructor(private http: HttpClient) { }

    public settleInvoicePayment(salesInvoiceSettleCreditPaymentDto: any): Observable<any> {
        return this.http.post(`${this.baseUrl}settle-invoice`, salesInvoiceSettleCreditPaymentDto, { responseType: 'text' });
    }
}