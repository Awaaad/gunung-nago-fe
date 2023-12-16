import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesInvoiceDto, SalesInvoiceLineDto } from 'generated-src/model';
import { PageResult, SalesInvoiceDetailsForReturnFrontDto, SalesInvoiceDetailsFrontDto } from 'generated-src/model-front';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class SalesInvoiceApiService {
    baseUrl = `${environment.apiPath}sales-invoices`;

    constructor(private http: HttpClient) { }

    public search(searchValues: any): Observable<PageResult<SalesInvoiceDto>> {
        return this.http.get<PageResult<SalesInvoiceDto>>(`${this.baseUrl}/search`, { params: searchValues });
    }

    public searchForType(searchValues: any): Observable<PageResult<SalesInvoiceLineDto>> {
        return this.http.get<PageResult<SalesInvoiceLineDto>>(`${this.baseUrl}/search/type`, { params: searchValues });
    }

    public generateStatement(searchValues: any): Observable<PageResult<SalesInvoiceDto>> {
        return this.http.get<PageResult<SalesInvoiceDto>>(`${this.baseUrl}/generate-statement`, { params: searchValues });
    }

    public findSalesInvoiceDetailsById(id: number): Observable<SalesInvoiceDetailsFrontDto> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    public findSalesInvoiceDetailsForReturnById(id: number): Observable<SalesInvoiceDetailsForReturnFrontDto> {
        return this.http.get<any>(`${this.baseUrl}/sales-invoice-for-return/${id}`);
    }

    public approveSalesInvoiceStatus(id: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/approved/${id}`, null, { responseType: 'text' });
    }

    public cancelSalesInvoiceStatus(id: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/cancelled/${id}`, null, { responseType: 'text' });
    }

    public completeSalesInvoiceStatus(id: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/completed/${id}`, null, { responseType: 'text' });
    }

    public paidSalesInvoiceStatus(id: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/paid/${id}`, null, { responseType: 'text' });
    }
}