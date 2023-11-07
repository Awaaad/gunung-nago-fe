import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseInvoiceDto, TodayAndCurrentMonthPurchaseDto } from 'generated-src/model';
import { PageResult, PurchaseInvoiceDetailsFrontDto } from 'generated-src/model-front';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseInvoiceApiService {
    baseUrl = `${environment.apiPath}purchase-invoices/`;

    constructor(private http: HttpClient) { }

    public search(searchValues: any): Observable<PageResult<PurchaseInvoiceDto>> {
        return this.http.get<PageResult<PurchaseInvoiceDto>>(`${this.baseUrl}search`, { params: searchValues });
    }

    public findPurchaseInvoiceDetailsById(id: number): Observable<PurchaseInvoiceDetailsFrontDto> {
        return this.http.get<PurchaseInvoiceDetailsFrontDto>(`${this.baseUrl}${id}`);
    }

    public getTodayAndCurrentMonthPurchaseAmount(): Observable<TodayAndCurrentMonthPurchaseDto> {
        return this.http.get<TodayAndCurrentMonthPurchaseDto>(`${this.baseUrl}purchase-today`);
      }
}