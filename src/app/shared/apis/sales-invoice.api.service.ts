import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesInvoiceDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class SalesInvoiceApiService {
    baseUrl = `${environment.apiPath}sales-invoices/`;

    constructor(private http: HttpClient) { }

    public search(searchValues: any): Observable<PageResult<SalesInvoiceDto>> {
        return this.http.get<PageResult<SalesInvoiceDto>>(`${this.baseUrl}search`, { params: searchValues });
    }
}