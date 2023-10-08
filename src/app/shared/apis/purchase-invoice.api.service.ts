import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedPurchaseInvoiceDetailsDto, HealthPurchaseInvoiceDetailsDto, PurchaseInvoiceDto } from 'generated-src/model';
import { FeedPurchaseInvoiceDetailsFrontDto, HealthPurchaseInvoiceDetailsFrontDto, PageResult } from 'generated-src/model-front';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseInvoiceApiService {
    baseUrl = `${environment.apiPath}purchase-invoices/`;

    constructor(private http: HttpClient) { }

    public search(searchValues: any): Observable<PageResult<PurchaseInvoiceDto>> {
        return this.http.get<PageResult<PurchaseInvoiceDto>>(`${this.baseUrl}search`, { params: searchValues });
    }

    public findHealthPurchaseInvoiceDetailsById(id: number): Observable<HealthPurchaseInvoiceDetailsFrontDto> {
        return this.http.get<HealthPurchaseInvoiceDetailsFrontDto>(`${this.baseUrl}health/${id}`);
    }

    public findFeedPurchaseInvoiceDetailsById(id: number): Observable<FeedPurchaseInvoiceDetailsFrontDto> {
        return this.http.get<FeedPurchaseInvoiceDetailsFrontDto>(`${this.baseUrl}feed/${id}`);
    }
}