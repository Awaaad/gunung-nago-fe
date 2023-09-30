
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupplierDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class SupplierApiService {
    baseUrl = `${environment.apiPath}suppliers/`;

    constructor(private http: HttpClient) { }

    public findAll(): Observable<SupplierDto[]> {
        return this.http.get<SupplierDto[]>(this.baseUrl);
    }

    public save(suppliers: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, suppliers, { responseType: 'text' });
    }

    public edit(supplierDto: SupplierDto): Observable<any> {
        return this.http.put(`${this.baseUrl}`, supplierDto);
    }

    public search(searchValues: any): Observable<PageResult<SupplierDto>> {
        return this.http.get<PageResult<SupplierDto>>(`${this.baseUrl}search`, { params: searchValues });
    }
}