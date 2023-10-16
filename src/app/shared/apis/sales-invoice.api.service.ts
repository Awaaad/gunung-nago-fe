import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesInvoiceDto } from 'generated-src/model';
import { EggSalesInvoiceDetailsFrontDto, FlockSalesInvoiceDetailsFrontDto, ManureSalesInvoiceDetailsFrontDto, PageResult } from 'generated-src/model-front';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class SalesInvoiceApiService {
    baseUrl = `${environment.apiPath}sales-invoices/`;

    constructor(private http: HttpClient) { }

    public search(searchValues: any): Observable<PageResult<SalesInvoiceDto>> {
        return this.http.get<PageResult<SalesInvoiceDto>>(`${this.baseUrl}search`, { params: searchValues });
    }

    public findEggSalesInvoiceDetailsById(id: number): Observable<EggSalesInvoiceDetailsFrontDto> {
        return this.http.get<any>(`${this.baseUrl}egg/${id}`);
    }

    public findFlockSalesInvoiceDetailsById(id: number): Observable<FlockSalesInvoiceDetailsFrontDto> {
        return this.http.get<any>(`${this.baseUrl}flock/${id}`);
    }

    public findManureSalesInvoiceDetailsById(id: number): Observable<ManureSalesInvoiceDetailsFrontDto> {
        return this.http.get<any>(`${this.baseUrl}manure/${id}`);
    }
}