import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FileApiService {
    baseUrl = `${environment.apiPath}files/`;

    constructor(private http: HttpClient) { }

    public generatePurchaseInvoicePdf(purchaseInvoiceId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}purchase-invoice/${purchaseInvoiceId}`);
    }
}